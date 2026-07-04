"use client";

import { useState } from "react";
import RegenerateEpitaphButton from "./RegenerateEpitaphButton";

interface EpitaphDisplayProps {
  projectId: string;
  initialEpitaph: string;
}

/**
 * 墓志铭展示 + 重新生成按钮
 *
 * 服务端详情页无法持有状态，故用此客户端组件封装墓志铭文本与重新生成按钮，
 * 在本地维护 epitaph 状态，重新生成成功后即时更新展示。
 */
export default function EpitaphDisplay({
  projectId,
  initialEpitaph,
}: EpitaphDisplayProps) {
  const [epitaph, setEpitaph] = useState(initialEpitaph);

  return (
    <div className="mb-6">
      <p
        className="text-2xl italic leading-relaxed"
        style={{ color: "var(--accent)", opacity: 0.85 }}
      >
        {epitaph}
      </p>
      <div className="mt-3">
        <RegenerateEpitaphButton
          projectId={projectId}
          currentEpitaph={epitaph}
          onRegenerated={setEpitaph}
        />
      </div>
    </div>
  );
}
