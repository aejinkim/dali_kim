'use client';

import React, { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  text: string;
  isHtml?: boolean;
}

const AVAILABLE_COMMANDS = [
  { name: 'about', desc: 'Get to know who I am' },
  { name: 'experience', desc: 'Browse my professional journey' },
  { name: 'skills', desc: 'See my technical & design capabilities' },
  { name: 'contact', desc: 'Find my professional links & email' },
  { name: 'help', desc: 'List all available shell commands' },
  { name: 'clear', desc: 'Clear the terminal screen' },
];

export default function TerminalWidget() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', text: "Welcome to Dali Kim's Interactive Terminal Portfolio." },
    { type: 'output', text: 'Type "help" to see available commands or click the buttons below.' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus terminal input when clicking the terminal body
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;

    const newHistory: TerminalLine[] = [...history, { type: 'input', text: `guest@dali-portfolio:~$ ${cmd}` }];
    
    // Add to history stack
    setCmdHistory((prev) => [cmd, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);

    switch (trimmedCmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: AVAILABLE_COMMANDS.map(c => `  <span class="text-brand-cyan font-bold">${c.name.padEnd(12)}</span> - ${c.desc}`).join('\n'),
          isHtml: true,
        });
        break;

      case 'about':
        newHistory.push({
          type: 'output',
          text: `
<span class="text-brand-purple font-bold">Dali Kim — Head of Design & Product Designer</span>
--------------------------------------------------
• <span class="text-brand-cyan">Profile:</span> 15+ years designing where complexity meets consequence.
• <span class="text-brand-cyan">Sectors:</span> Mission-critical satellite control systems to multi-billion dollar DeFi protocols.
• <span class="text-brand-cyan">Motto:</span> "Designing products end-to-end from wireframe to production-ready spec."
• <span class="text-brand-cyan">Status:</span> Based in Seoul, South Korea — open to relocation worldwide.
          `,
          isHtml: true,
        });
        break;

      case 'experience':
        newHistory.push({
          type: 'output',
          text: `
<span class="text-brand-emerald font-bold">Professional Experience:</span>
--------------------------------------------------
1. <span class="text-brand-cyan font-bold">Initia (23Labs)</span> — Head of Design (2023 - 2026)
   • Led brand and visual system for ecosystem from 0 to launch (Binance, $25M+ raised).
   • Shipped Initia Wallet, DEX, Bridge, Portfolio Dashboard, and Analytics.
2. <span class="text-brand-cyan font-bold">Terraform Labs</span> — Senior Product Designer (2021 - 2023)
   • Lead designer for Anchor Protocol ($16B+ TVL at peak).
   • Shipped Terra Bridge, wallet products, and marketing brand identity.
3. <span class="text-brand-cyan font-bold">Fount Inc.</span> — Lead Product Designer (2020 - 2021)
   • Head of Design for South Korea's #1 Robo-Advisor platform (1.5T KRW AUM).
4. <span class="text-brand-cyan font-bold">Satrec Initiative</span> — Product Designer (2013 - 2018)
   • Led UI/UX for ground segment control systems across 10+ space missions.
          `,
          isHtml: true,
        });
        break;

      case 'skills':
        newHistory.push({
          type: 'output',
          text: `
<span class="text-brand-cyan font-bold">Capabilities & Tools:</span>
--------------------------------------------------
• <span class="text-brand-purple">Design:</span> Product Design, Brand Identity, Design Systems, DeFi & Web3 UX
• <span class="text-brand-purple">Tools:</span> Figma, Motion Graphics, Vibe Coding, Prototyping
• <span class="text-brand-purple">Domain:</span> L1 Blockchain / DeFi, Satellite Systems, FinTech, E-Commerce
• <span class="text-brand-purple">Languages:</span> Korean (Native), English (Professional)
          `,
          isHtml: true,
        });
        break;

      case 'contact':
        newHistory.push({
          type: 'output',
          text: `
<span class="text-brand-cyan font-bold">Professional Contacts:</span>
--------------------------------------------------
• <span class="text-brand-purple">Figma Deck:</span> <a href="https://www.figma.com/slides/GRCv7A7mLb9gel06gePy2i/Dali-Kim_Portfolio" target="_blank" rel="noopener noreferrer" class="underline text-brand-cyan hover:text-white transition">figma.com/slides/dali-portfolio</a>
• <span class="text-brand-purple">LinkedIn:</span> <a href="https://www.linkedin.com/in/dali-k-50780379/" target="_blank" rel="noopener noreferrer" class="underline text-brand-cyan hover:text-white transition">linkedin.com/in/dali-k-50780379</a>
• <span class="text-brand-purple">Twitter:</span> <a href="https://x.com/dali__design" target="_blank" rel="noopener noreferrer" class="underline text-brand-cyan hover:text-white transition">@dali__design</a>
• <span class="text-brand-purple">Email:</span> <a href="mailto:jiny0410@gmail.com" class="underline text-brand-cyan hover:text-white transition">jiny0410@gmail.com</a>
          `,
          isHtml: true,
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({
          type: 'error',
          text: `shell: command not found: "${cmd}". Type "help" for a list of commands.`,
        });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex < cmdHistory.length) {
        setHistoryIndex(nextIndex);
        setInputVal(cmdHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const prevIndex = historyIndex - 1;
      if (prevIndex >= 0) {
        setHistoryIndex(prevIndex);
        setInputVal(cmdHistory[prevIndex]);
      } else {
        setHistoryIndex(-1);
        setInputVal('');
      }
    }
  };

  return (
    <div 
      className="glass-panel w-full max-w-2xl rounded-xl shadow-2xl border border-brand-border overflow-hidden flex flex-col font-mono text-sm leading-relaxed"
      onClick={focusInput}
    >
      {/* Terminal Title Bar */}
      <div className="bg-gray-900/80 px-4 py-3 flex items-center justify-between border-b border-brand-border select-none">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-gray-400 text-xs font-semibold select-none">guest@dali-portfolio:~</div>
        <div className="w-12" /> {/* spacer */}
      </div>

      {/* Terminal Content Screen */}
      <div className="p-4 h-80 overflow-y-auto bg-gray-950/45 scrollbar flex flex-col space-y-2 text-left cursor-text">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            {line.type === 'input' ? (
              <span className="text-brand-purple">{line.text}</span>
            ) : line.type === 'error' ? (
              <span className="text-red-400">{line.text}</span>
            ) : line.isHtml ? (
              <div dangerouslySetInnerHTML={{ __html: line.text }} />
            ) : (
              <span className="text-gray-300">{line.text}</span>
            )}
          </div>
        ))}
        
        {/* Terminal Input Line */}
        <div className="flex items-center text-brand-purple">
          <span className="mr-2 shrink-0">guest@dali-portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="bg-transparent border-none outline-none flex-grow text-gray-200 caret-brand-cyan focus:ring-0 p-0 text-sm font-mono w-full"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Command Suggestion Panel */}
      <div className="bg-gray-950/70 border-t border-brand-border p-3 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-brand-text-secondary select-none font-semibold mr-1">Quick Run:</span>
        {AVAILABLE_COMMANDS.filter(cmd => cmd.name !== 'clear').map((cmd) => (
          <button
            key={cmd.name}
            type="button"
            className="px-2.5 py-1 text-xs rounded-md bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan hover:text-black transition-all duration-200 cursor-pointer font-bold font-mono"
            onClick={(e) => {
              e.stopPropagation();
              handleCommand(cmd.name);
            }}
          >
            {cmd.name}
          </button>
        ))}
      </div>
    </div>
  );
}
