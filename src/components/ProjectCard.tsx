"use client";

import React from "react";
import { BrandText } from "./BrandText";

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  location: string;
  size: string;
  tags: string[];
  aspectRatio?: string;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  imageSrc,
  title,
  location,
  size,
  tags,
  aspectRatio = "aspect-[4/5]",
  className = "",
}) => {
  return (
    <article
      className={`project-card-hover group relative overflow-hidden border border-ca-border bg-ca-bg-surface/20 rounded-xl cursor-pointer ${aspectRatio} ${className}`}
    >
      {/* Background Image with Zoom on Hover */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-103 opacity-70 group-hover:opacity-85"
        style={{ backgroundImage: `url(${imageSrc})` }}
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/30 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-95" />

      {/* Hover Light Glow Accent using theme border color variable */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--ca-border)_0%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Project Specs */}
      <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end h-full z-10 translate-y-3 transition-transform duration-500 group-hover:translate-y-0">
        {/* Monospace tags */}
        <div className="flex flex-wrap gap-2.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono uppercase tracking-widest text-ca-text bg-ca-text/10 px-3 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Project Title (Syne) */}
        <h3 className="text-2xl md:text-3.5xl font-display font-light uppercase tracking-wide text-ca-text transition-all duration-300">
          <BrandText>{title}</BrandText>
        </h3>

        {/* Divider line that expands on hover */}
        <div className="w-16 h-[1.5px] bg-ca-text/30 my-4 transition-all duration-500 group-hover:w-full" />

        {/* Location & Metrics */}
        <div className="flex justify-between items-center text-[10px] sm:text-[11px] font-mono text-ca-text-secondary tracking-wider">
          <span>{location}</span>
          <span>{size}</span>
        </div>
      </div>

      {/* Top border technical detail */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-ca-text/20 to-transparent scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
    </article>
  );
};
export default ProjectCard;
