"use client";

import Image from "next/image";
import React from "react";
import { BrandText } from "./BrandText";

interface ProjectCardProps {
  imageSrc: string;
  imageAlt: string;
  visualLabel: string;
  title: string;
  location: string;
  size: string;
  tags: string[];
  aspectRatio?: string;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  imageSrc,
  imageAlt,
  visualLabel,
  title,
  location,
  size,
  tags,
  aspectRatio = "aspect-[4/5]",
  className = "",
}) => {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-ca-border bg-ca-bg-surface/20 ${aspectRatio} ${className}`}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover opacity-68 transition duration-700 ease-out group-hover:scale-[1.035] group-hover:opacity-82"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--ca-border)_0%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <span className="absolute left-5 top-5 z-10 border border-white/10 bg-ca-bg-deep/80 px-3 py-2 text-[8px] font-mono uppercase tracking-[0.18em] text-ca-text backdrop-blur-md">
        {visualLabel}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 flex h-full flex-col justify-end p-7 md:p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-white/10 bg-ca-bg-deep/55 px-3 py-1 text-[8px] font-mono uppercase tracking-[0.16em] text-ca-text"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-2xl font-display font-light uppercase tracking-[0.06em] text-ca-text md:text-3xl">
          <BrandText>{title}</BrandText>
        </h3>

        <div className="my-4 h-px w-16 bg-ca-text/30 transition-all duration-500 group-hover:w-full" />

        <div className="flex flex-col gap-2 text-[9px] font-mono uppercase tracking-[0.16em] text-ca-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <span>{location}</span>
          <span>{size}</span>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
