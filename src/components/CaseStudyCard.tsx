import React from 'react';
import Link from 'next/link';

interface CaseStudyCardProps {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
}

export default function CaseStudyCard({ slug, title, date, summary, tags }: CaseStudyCardProps) {
  return (
    <Link href={`/case-studies/${slug}`} className="group block select-text">
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-brand-border h-full flex flex-col relative overflow-hidden">
        {/* Border highlights */}
        <div className="absolute -inset-px bg-gradient-to-r from-brand-purple/0 via-brand-purple/10 to-brand-cyan/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Date */}
        <span className="text-xs font-mono text-brand-purple font-bold mb-2 block select-none">
          {date}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-purple transition-colors duration-200 line-clamp-2">
          {title}
        </h3>

        {/* Summary */}
        <p className="text-brand-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
          {summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto select-none">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gray-900 border border-brand-border text-gray-400 group-hover:text-brand-purple group-hover:border-brand-purple/20 transition-colors duration-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
