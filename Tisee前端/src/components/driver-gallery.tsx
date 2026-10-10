"use client";

import Image from "next/image";
import { useState } from "react";

export function DriverGallery({ title, photos }: { title: string; photos: { src: string; caption: string }[] }) {
  const [selected, setSelected] = useState(0);
  const current = photos[selected];
  return (
    <section className="driver-gallery" aria-label={title}>
      <div className="driver-gallery-heading"><h2>{title}</h2><span>{selected + 1} / {photos.length}</span></div>
      <div className="driver-gallery-main">
        <Image src={current.src} alt={current.caption} fill sizes="(max-width: 760px) 100vw, 50vw" loading="eager" />
        <span>{current.caption}</span>
      </div>
      <div className="driver-gallery-thumbnails">
        {photos.map((photo, index) => (
          <button key={index} type="button" aria-label={`查看${photo.caption}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
            <Image src={photo.src} alt="" fill sizes="(max-width: 760px) 25vw, 12vw" loading="eager" />
          </button>
        ))}
      </div>
    </section>
  );
}
