"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const VERT_SRC = `#version 300 es
  in vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAG_SRC = `#version 300 es
  precision highp float;
  uniform float iTime;
  uniform vec2 iResolution;
  out vec4 fragColor;

  mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}
  float map(vec3 p){
      p.xz*= m(iTime*0.4);p.xy*= m(iTime*0.3);
      vec3 q = p*2.0+iTime;
      return length(p+vec3(sin(iTime*0.7)))*log(length(p)+1.0) + sin(q.x+sin(q.z+sin(q.y)))*0.5 - 1.0;
  }

  void mainImage( out vec4 fc, in vec2 fragCoord ){
      vec2 uv = fragCoord.xy/iResolution.xy;
      // 到中心的距离（归一化），考虑宽高比
      vec2 centered = (uv - vec2(0.5)) * vec2(iResolution.x/iResolution.y, 1.0);
      float dist = length(centered);
      // 纯着色器羽化：0.3→0.55 平滑过渡，不依赖 CSS mask
      float alpha = 1.0 - smoothstep(0.3, 0.55, dist);

      vec2 p = fragCoord.xy/iResolution.y - vec2(0.5,0.5);
      vec3 cl = vec3(0.0);
      float d = 2.5;
      for(int i=0; i<=5; i++)     {
          vec3 pp = vec3(0.0,0.0,5.0) + normalize(vec3(p, -1.0))*d;
          float rz = map(pp);
          float f =  clamp((rz - map(pp+0.1))*0.5, -0.1, 1.0 );
          vec3 l = vec3(0.1,0.3,0.4) + vec3(5.0, 2.5, 3.0)*f;
          cl = cl*l + smoothstep(2.5, 0.0, rz)*0.7*l;
          d += min(rz, 1.0);
      }
      fc = vec4(cl, alpha);
  }

  void main() {
      mainImage(fragColor, gl_FragCoord.xy);
  }
`;

export default function BlackHoleButton() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }

    // 启用混合，让着色器边缘 alpha 平滑过渡到透明
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // 清除色为全透明
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function compileShader(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vert = compileShader(gl.VERTEX_SHADER, VERT_SRC);
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const verts = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "iTime");
    const uRes = gl.getUniformLocation(program, "iResolution");

    const startTime = performance.now();

    function render() {
      if (!gl || !canvas) return;
      const t = (performance.now() - startTime) * 0.001;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    }

    requestAnimationFrame(() => {
      resize();
      rafRef.current = requestAnimationFrame(render);
    });

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
    };
  }, []);

  const size = "min(552px, 96vw)";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* 1. 外层光晕 — 呼吸 */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "110%",
          height: "110%",
          background:
            "radial-gradient(circle, rgba(94,234,212,0.08) 0%, rgba(94,234,212,0.03) 40%, transparent 70%)",
          animation: "bh-glow-pulse 4s ease-in-out infinite",
        }}
      />

      {/* 2. WebGL 着色器画布 — 纯着色器 alpha 羽化，无 CSS mask，无矩形裁剪 */}
      <div
        className="absolute"
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <canvas
          ref={canvasRef}
          className="block"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {/* 4. 玻璃拟态上传按钮 — 居中 */}
      <Link href="/upload" className="bh-button relative z-10 group">
        {/* 渐变叠加 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.08), rgba(255,255,255,0.03), transparent)",
            borderRadius: "38px",
          }}
        />
        {/* 内发光 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: "inset 0 2px 4px rgba(255,255,255,0.15)",
            borderRadius: "38px",
          }}
        />
        {/* 按钮文字 */}
        <span
          className="relative z-10 whitespace-nowrap"
          style={{
            fontFamily:
              "Inter, 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif",
            fontSize: "17px",
            fontWeight: 500,
            color: "white",
            letterSpacing: "-0.3px",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          上传项目
        </span>
        {/* 箭头图标 */}
        <svg
          className="relative z-10 ml-2 transition-transform duration-200 group-hover:translate-x-1"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}
