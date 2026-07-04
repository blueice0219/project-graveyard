"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 读取 CSS 变量获取粒子颜色
function getParticleColors(): THREE.Color[] {
  if (typeof window === "undefined") {
    return [
      new THREE.Color("#5EEAD4"),
      new THREE.Color("#2DD4BF"),
      new THREE.Color("#7FF5E0"),
    ];
  }
  const styles = getComputedStyle(document.documentElement);
  return [
    new THREE.Color(styles.getPropertyValue("--particle-1").trim() || "#5EEAD4"),
    new THREE.Color(styles.getPropertyValue("--particle-2").trim() || "#2DD4BF"),
    new THREE.Color(styles.getPropertyValue("--particle-3").trim() || "#7FF5E0"),
  ];
}

function Particles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 生成粒子位置和颜色
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const palette = getParticleColors();

    for (let i = 0; i < count; i++) {
      // 球形分布，半径 8-15
      const radius = 8 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // 随机选一个颜色
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // 粒子大小 0.02-0.05
      sizes[i] = 0.02 + Math.random() * 0.03;
    }

    return { positions, colors, sizes };
  }, [count]);

  // 鼠标跟踪
  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // 缓慢旋转
    pointsRef.current.rotation.y += delta * 0.05;

    // 鼠标视差
    const targetX = state.mouse.x * 0.3;
    const targetY = state.mouse.y * 0.3;
    mouseRef.current.x += (targetX - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (targetY - mouseRef.current.y) * 0.05;
    pointsRef.current.rotation.x = mouseRef.current.y * 0.2;
    pointsRef.current.rotation.z = mouseRef.current.x * 0.1;
  });

  // 自定义 shader 让粒子是发光圆点
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec3 pos = position;
          // sin 波浮动
          pos.y += sin(time * 0.5 + position.x * 0.5) * 0.3;
          pos.x += cos(time * 0.3 + position.z * 0.5) * 0.2;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * 300.0 / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          // 圆形粒子，边缘柔和
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // 更新 time uniform
  useFrame((state) => {
    shaderMaterial.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={shaderMaterial} />
    </points>
  );
}

export default function ParticleField() {
  // 粒子数量：桌面 3000，移动端 800
  const count =
    typeof window !== "undefined" &&
    (window.devicePixelRatio > 1.5 || window.innerWidth < 768)
      ? 800
      : 3000;

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 60 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true }}
    >
      <Particles count={count} />
    </Canvas>
  );
}
