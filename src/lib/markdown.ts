import fs from 'fs';
import path from 'path';

export interface CaseStudyData {
  slug: string;
  title: string;
  date: string;
  displayOrder?: number;
  summary: string;
  tags: string[];
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content/case-studies');

// Simple regex-based Markdown-to-HTML parser (zero dependencies, React 19 / Next 16 compatible)
export function parseMarkdownToHtml(markdown: string): string {
  let html = markdown;

  // 1. Remove Windows carriage returns
  html = html.replace(/\r\n/g, '\n');

  // 2. Code blocks (```lang ... ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre style="background:rgba(0,0,0,0.04);padding:20px;border-radius:8px;margin:24px 0;overflow-x:auto;border:1px solid rgba(0,0,0,0.08)"><code style="font-family:monospace;font-size:13px;color:#0a0a0a;line-height:1.6">${escapedCode}</code></pre>`;
  });

  // 3. Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code style="font-family:monospace;background:rgba(0,0,0,0.06);color:#0a0a0a;padding:2px 6px;border-radius:4px;font-size:0.9em">$1</code>');

  // 4. Headers (# Heading)
  html = html.replace(/^# (.*?)$/gm, '<h1 style="font-size:clamp(28px,3vw,40px);font-weight:500;color:#0a0a0a;margin:64px 0 20px;letter-spacing:-0.025em;line-height:1.1">$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 style="font-size:clamp(20px,2vw,28px);font-weight:500;color:#0a0a0a;margin:56px 0 16px;letter-spacing:-0.02em;line-height:1.2;padding-bottom:12px;border-bottom:1px solid rgba(0,0,0,0.08)">$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3 style="font-size:clamp(16px,1.4vw,20px);font-weight:500;color:#0a0a0a;margin:40px 0 12px;letter-spacing:-0.01em">$1</h3>');
  html = html.replace(/^#### (.*?)$/gm, '<h4 style="font-size:15px;font-weight:500;color:#0a0a0a;margin:32px 0 10px;letter-spacing:-0.01em">$1</h4>');

  // 5. Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:600;color:#0a0a0a">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em style="font-style:italic">$1</em>');

  // 6. Blockquotes & Alerts (GitHub alerts: > [!NOTE], > [!IMPORTANT] etc)
  // Match normal blockquotes first
  html = html.replace(/^> \[\!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n([\s\S]*?)(?=(?:\n\n|\n[^\s>]))/gm, (_, type, content) => {
    const cleanContent = content.replace(/^> ?/gm, '').trim();
    return `<div style="margin:24px 0;padding:16px 20px;border-left:3px solid rgba(0,0,0,0.2);background:rgba(0,0,0,0.03);border-radius:0 8px 8px 0">
      <div style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(10,10,10,0.4);margin-bottom:6px">${type}</div>
      <p style="color:rgba(10,10,10,0.7);font-size:15px;line-height:1.6;margin:0">${cleanContent}</p>
    </div>`;
  });

  html = html.replace(/^> (.*?)$/gm, '<blockquote style="border-left:3px solid rgba(0,0,0,0.15);padding:4px 0 4px 16px;margin:20px 0;color:rgba(10,10,10,0.55);font-style:italic">$1</blockquote>');

  // 7. Unordered Lists (- List Item)
  // Ensure lines starting with - are grouped in <ul>
  let inList = false;
  const lines = html.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^-\s+(.*?)$/);
    if (match) {
      const content = match[1];
      if (!inList) {
        lines[i] = `<ul style="list-style:disc;padding-left:24px;margin:16px 0;display:flex;flex-direction:column;gap:8px;color:rgba(10,10,10,0.7)">\n  <li>${content}</li>`;
        inList = true;
      } else {
        lines[i] = `  <li>${content}</li>`;
      }
    } else {
      if (inList) {
        lines[i - 1] = lines[i - 1] + '\n</ul>';
        inList = false;
      }
    }
  }
  if (inList) {
    lines[lines.length - 1] = lines[lines.length - 1] + '\n</ul>';
  }
  html = lines.join('\n');

  // 8. Tables
  // Simple table replacement
  html = html.replace(/\|(.+)\|[\r\n]\|[-:| ]+\|[\r\n]((?:\|.+\|[\r\n]?)+)/g, (_, headersStr, rowsStr) => {
    const headers = headersStr.split('|').map((h: string) => h.trim()).filter(Boolean);
    const rows = rowsStr.trim().split('\n').map((row: string) => {
      return row.split('|').map((c: string) => c.trim()).filter(Boolean);
    });

    const headerHtml = `<thead><tr style="border-bottom:1px solid rgba(0,0,0,0.12)">
      ${headers.map((h: string) => `<th style="padding:8px 16px;text-align:left;font-weight:600;color:#0a0a0a;font-size:13px">${h}</th>`).join('')}
    </tr></thead>`;

    const bodyHtml = `<tbody>
      ${rows.map((row: string[]) => `<tr style="border-bottom:1px solid rgba(0,0,0,0.06)">
        ${row.map((c: string) => `<td style="padding:8px 16px;color:rgba(10,10,10,0.65);font-size:13px">${c}</td>`).join('')}
      </tr>`).join('')}
    </tbody>`;

    return `<div style="margin:24px 0;overflow-x:auto;border-radius:8px;border:1px solid rgba(0,0,0,0.1)"><table style="min-width:100%;border-collapse:collapse;background:rgba(0,0,0,0.02)">${headerHtml}${bodyHtml}</table></div>`;
  });

  // 9. Paragraphs (split by double newline, skip elements that are already HTML tags)
  html = html.split(/\n\n+/).map(p => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<pre') || trimmed.startsWith('<ul') || trimmed.startsWith('<div') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<table')) {
      return trimmed;
    }
    return `<p style="line-height:1.7;color:rgba(10,10,10,0.7);margin:16px 0">${trimmed.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');

  return html;
}

// Fallback dummy data in case the directory is empty
const MOCK_CASE_STUDIES: Record<string, Omit<CaseStudyData, 'slug'>> = {
  'defi-dashboard-mvp': {
    title: 'DeFi Dashboard MVP: Building a high-performance Web3 Tracker',
    date: '2026-05-24',
    summary: 'A detailed walkthrough of building a Web3 portfolio tracker using Next.js 16 and ethers.js, optimized for UX and tracking WAU metric.',
    tags: ['Next.js', 'Web3', 'Ethers.js', 'Tailwind CSS v4'],
    content: `
# DeFi Dashboard MVP: Building a high-performance Web3 Tracker

This case study reviews the decisions, technical architecture, and impact of building the **DeFi Dashboard MVP**, aimed at acquiring **100+ Weekly Active Users (WAU)**.

## 🎯 Project Goals

- **Objective:** Create a lightweight, high-performance interface for tracking crypto assets and smart contract interactions.
- **Priority:** Ensure seamless metamask wallet connection and immediate token balance retrieval.
- **SEO & Performance:** Achieve 95+ lighthouse score.

> [!NOTE]
> This project is designed with a mobile-first philosophy because over 60% of crypto retail traders use mobile wallets like MetaMask Mobile or Trust Wallet.

## 🛠️ Tech Stack & Decisions

- **Framework:** Next.js (App Router) for Server-Side Rendering (SSR) and SEO.
- **Web3 Interface:** Ethers.js v6 with custom React Context for wallet connection.
- **Styling:** Tailwind CSS v4 for super-fast styling using the new engine.

## 🔧 Architecture & Challenges

During implementation, we encountered significant latency when querying ERC-20 balances individually. To solve this, we implemented a **Multicall contract integration**, reducing HTTP RPC roundtrips from 15 down to 1.

\`\`\`typescript
// Multicall fetch example
const multicallData = await multicallContract.aggregate(calls);
const balances = decodeBalances(multicallData);
\`\`\`

## ✅ Key Results

- **Lighthouse Performance:** 98/100
- **Page Load Time:** 0.6 seconds (loaded and ready to connect)
- **WAU Projection:** Anticipating 150 WAU based on alpha testers.
    `
  }
};

export async function getCaseStudies(): Promise<CaseStudyData[]> {
  // Ensure the directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  try {
    const filenames = fs.readdirSync(CONTENT_DIR);
    const fileStudies: CaseStudyData[] = [];

    for (const filename of filenames) {
      if (!filename.endsWith('.md')) continue;

      const filePath = path.join(CONTENT_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const slug = filename.replace(/\.md$/, '');

      // Parse basic YAML frontmatter manually to avoid installing dependency
      const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
      const match = fileContent.match(frontMatterRegex);

      if (match) {
        const [, yamlText, bodyText] = match;
        const metadata: Record<string, string | string[]> = {};
        
        yamlText.split('\n').forEach(line => {
          const colonIdx = line.indexOf(':');
          if (colonIdx === -1) return;
          const key = line.slice(0, colonIdx).trim();
          let val: string | string[] = line.slice(colonIdx + 1).trim();
          // Clean up quotes and arrays
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
          } else if (val.startsWith('[') && val.endsWith(']')) {
            val = val.slice(1, -1).split(',').map((x: string) => x.trim().replace(/['"]/g, ''));
          }
          metadata[key] = val;
        });

        const titleVal = metadata.title;
        const title = Array.isArray(titleVal) ? titleVal.join(' ') : (titleVal || slug);
        
        const dateVal = metadata.date;
        const date = Array.isArray(dateVal) ? dateVal[0] : (dateVal || '');
        
        const summaryVal = metadata.summary;
        const summary = Array.isArray(summaryVal) ? summaryVal.join(' ') : (summaryVal || '');

        const tagsVal = metadata.tags;
        const tags = Array.isArray(tagsVal) ? tagsVal : (tagsVal ? [tagsVal] : []);

        const orderVal = metadata.displayOrder;
        const displayOrder = orderVal ? parseInt(String(orderVal), 10) : undefined;

        fileStudies.push({
          slug,
          title,
          date,
          displayOrder,
          summary,
          tags,
          content: bodyText.trim(),
        });
      } else {
        // Fallback for markdown without frontmatter
        fileStudies.push({
          slug,
          title: slug.replace(/[-_]/g, ' '),
          date: new Date().toISOString().split('T')[0],
          summary: 'Case study details...',
          tags: [],
          content: fileContent,
        });
      }
    }

    // Merge in mock data if no files exist so the page has contents
    if (fileStudies.length === 0) {
      return Object.entries(MOCK_CASE_STUDIES).map(([slug, study]) => ({
        slug,
        ...study
      }));
    }

    return fileStudies.sort((a, b) => {
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      if (a.displayOrder !== undefined) return -1;
      if (b.displayOrder !== undefined) return 1;
      return b.date.localeCompare(a.date);
    });
  } catch (error) {
    console.error('Error reading case studies:', error);
    return Object.entries(MOCK_CASE_STUDIES).map(([slug, study]) => ({
      slug,
      ...study
    }));
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyData | null> {
  const all = await getCaseStudies();
  return all.find(study => study.slug === slug) || null;
}
