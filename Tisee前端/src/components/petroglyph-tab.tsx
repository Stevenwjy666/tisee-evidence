"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import "./petroglyph-tab.css";

type Category = "all" | "homes" | "routes" | "experiences" | "services";

export function PetroglyphTab({ category, label, active, onSelect }: {
  category: Category;
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  const [playback, setPlayback] = useState(active ? 1 : 0);
  const replay = () => setPlayback((value) => value + 1);

  return (
    <button
      className={cn("search-tab", active && "active")}
      type="button"
      aria-current={active ? "page" : undefined}
      onPointerEnter={(event) => { if (event.pointerType !== "touch") replay(); }}
      onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) replay(); }}
      onClick={() => { replay(); onSelect(); }}
    >
      <span key={playback} className={cn("petroglyph-icon", `petroglyph-${category}`, playback > 0 && "petroglyph-playing")} aria-hidden="true">
        <Image className="petroglyph-still" src={`/icons/petroglyph/${category}.webp`} alt="" width={40} height={40} loading="eager" />
        {(category === "routes" || category === "experiences") && <span className="petroglyph-frames" />}
      </span>
      <span>{label}</span>
    </button>
  );
}
