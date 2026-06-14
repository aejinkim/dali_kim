import React from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  demoLink?: string;
  stats?: string;
}

export default function ProjectCard({ title, description, tags, link, demoLink, stats }: ProjectCardProps) {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-brand-border flex flex-col h-full relative overflow-hidden group select-text">
      {/* Glow highlight inside card */}
      <div className="absolute -inset-px bg-gradient-to-r from-brand-cyan/0 via-brand-cyan/10 to-brand-purple/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Meta stat like WAU target */}
      {stats && (
        <div className="self-start px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald mb-4 select-none uppercase tracking-wider">
          {stats}
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-cyan transition-colors duration-200">
        {title}
      </h3>

      {/* Description */}
      <p className="text-brand-text-secondary text-sm leading-relaxed mb-6 flex-grow">
        {description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6 select-none">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-gray-900 border border-brand-border text-gray-400 group-hover:border-brand-cyan/20 group-hover:text-brand-cyan/85 transition-colors duration-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 select-none mt-auto">
        {demoLink && (
          <a
            href={demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-brand-cyan text-black font-semibold text-xs hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer shadow-lg shadow-brand-cyan/5"
          >
            Launch App
          </a>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg border border-brand-border text-brand-text-primary font-mono text-xs hover:border-brand-purple hover:text-brand-purple transition-colors duration-200 cursor-pointer"
          >
            Source Code
          </a>
        )}
      </div>
    </div>
  );
}
