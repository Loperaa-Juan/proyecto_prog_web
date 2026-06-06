import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ChevronRight, Send, Bot, Code2, RotateCcw,
  SendHorizonal, FileText, Sparkles,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMarkdown } from '@/components/chat/ChatMarkdown';
import { Spinner } from '@/components/feedback/Spinner';
import { DifficultyBadge } from '@/components/feedback/Badge';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/hooks/useToast';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/classNames';
import { getJSON, setJSON, removeItem, STORAGE_KEYS } from '@/lib/storage';
import * as challengeService from '@/services/challenges';
import * as submissionService from '@/services/submissions';
import type { AuthSession, Challenge } from '@/types';

/* ── Constants ──────────────────────────────────────────────────── */

const MONO_FONT = "'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace";
const CODE_SIZE = '13px';
const CODE_LINE_H = '20px';
const CODE_PAD = '12px';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python',     label: 'Python'     },
  { value: 'java',       label: 'Java'        },
  { value: 'cpp',        label: 'C++'         },
  { value: 'go',         label: 'Go'          },
  { value: 'rust',       label: 'Rust'        },
];

/* ── Chat types ─────────────────────────────────────────────────── */

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  content: string;
}

function initialBotMessage(title: string): ChatMessage {
  return {
    id: 'init',
    role: 'bot',
    content: `¡Hola! Soy tu asistente para el desafío "${title}". Puedo ayudarte con pistas, explicar conceptos o revisar tu enfoque. ¿Por dónde quieres empezar?`,
  };
}


/* ── Component ──────────────────────────────────────────────────── */

export default function SolvePage() {
  const { id } = useParams<{ id: string }>();
  const chatKey = `complexitylab-chat-${id}`;
  const navigate  = useNavigate();
  const location  = useLocation();
  const { showToast } = useToast();
  const { isDark }    = useTheme();

  const initialCode = (location.state as { initialCode?: string } | null)?.initialCode;

  /* page state */
  const [challenge,    setChallenge]    = useState<Challenge | null>(null);
  const [pageLoading,  setPageLoading]  = useState(true);

  /* desktop left panel tab */
  const [leftTab, setLeftTab] = useState<'description' | 'editor'>('description');
  /* mobile active tab */
  const [mobileTab, setMobileTab] = useState<'description' | 'editor' | 'chat'>('description');

  /* editor state */
  const [language,     setLanguage]     = useState('javascript');
  const [code,         setCode]         = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* chat state */
  const [messages,     setMessages]     = useState<ChatMessage[]>([]);
  const [chatInput,    setChatInput]    = useState('');
  const [isBotTyping,  setIsBotTyping]  = useState(false);

  /* refs for scroll sync */
  const codeRef        = useRef<HTMLTextAreaElement>(null);
  const lineNumsRef    = useRef<HTMLDivElement>(null);
  const hlWrapperRef   = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useDocumentTitle(challenge ? `Resolver: ${challenge.title}` : 'Resolver desafío');

  /* load challenge */
  useEffect(() => {
    if (!id) return;
    setPageLoading(true);
    challengeService
      .getById(id)
      .then((c) => {
        setChallenge(c);
        setCode(initialCode ?? c.codeTemplate ?? '// Escribe tu solución aquí\n');
        const saved = getJSON<ChatMessage[]>(chatKey);
        setMessages(saved && saved.length > 0 ? saved : [initialBotMessage(c.title)]);
      })
      .catch(() => {
        showToast('No se encontró el desafío', 'error');
        navigate('/challenges');
      })
      .finally(() => setPageLoading(false));
  }, [id, navigate, showToast]);

  /* auto-scroll chat */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  /* persist chat to localStorage */
  useEffect(() => {
    if (!id || !messages.length) return;
    setJSON(chatKey, messages);
  }, [messages]);

  /* sync line numbers + syntax highlight with textarea scroll */
  const syncEditorScroll = useCallback(() => {
    const ta = codeRef.current;
    if (!ta) return;
    if (lineNumsRef.current) {
      lineNumsRef.current.scrollTop = ta.scrollTop;
    }
    if (hlWrapperRef.current) {
      const pre = hlWrapperRef.current.querySelector('pre');
      if (pre) {
        (pre as HTMLElement).style.transform =
          `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
      }
    }
  }, []);

  /* Tab key → 2 spaces */
  const handleCodeKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el    = e.currentTarget;
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    setCode((prev) => prev.substring(0, start) + '  ' + prev.substring(end));
    requestAnimationFrame(() => {
      if (codeRef.current) {
        codeRef.current.selectionStart = start + 2;
        codeRef.current.selectionEnd   = start + 2;
      }
    });
  }, []);

  /* submit solution */
  const handleSubmit = useCallback(async () => {
    if (isSubmitting || !code.trim() || !challenge) return;
    setIsSubmitting(true);
    try {
      await submissionService.create(challenge.id, code);
      removeItem(chatKey);
      showToast('Solución enviada. El creador del challenge recibirá una notificación por correo.', 'success');
      navigate('/challenges');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al enviar la solución', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [challenge, code, isSubmitting, showToast, navigate]);

  /* chat send */
  const sendToChat = useCallback(async (displayText: string, apiText: string) => {
    if (isBotTyping) return;

    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: displayText };
    const apiMessages = [
      ...messages,
      { ...userMessage, content: apiText },
    ];
    setMessages((prev) => [...prev, userMessage]);
    setIsBotTyping(true);

    const botId = `b-${Date.now()}`;

    try {
      const session = getJSON<AuthSession>(STORAGE_KEYS.USER);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.token) headers['Authorization'] = `Bearer ${session.token}`;

      const res = await fetch('/api/chatbot/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: apiMessages.map((m) => ({
            role: m.role === 'bot' ? 'assistant' : 'user',
            content: m.content,
          })),
        }),
      });

      if (!res.ok || !res.body) throw new Error('Error al contactar el asistente');

      setIsBotTyping(false);
      setMessages((prev) => [...prev, { id: botId, role: 'bot', content: '' }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, content: m.content + chunk } : m)),
        );
      }
    } catch {
      setIsBotTyping(false);
      showToast('Error al conectar con el asistente', 'error');
    }
  }, [isBotTyping, messages, showToast]);

  const handleSend = useCallback(async () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput('');
    await sendToChat(text, text);
  }, [chatInput, sendToChat]);

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) return;
    const apiText = `Analiza mi solución y guíame con el método socrático:\n\`\`\`${language}\n${code}\n\`\`\``;
    await sendToChat('Analiza mi solución', apiText);
  }, [code, language, sendToChat]);

  const handleChatKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── Loading ──────────────────────────────────────────────────── */

  if (pageLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={32} className="border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!challenge) return null;

  const lineCount = code.split('\n').length;
  const hlStyle   = isDark ? vscDarkPlus : vs;
  const editorBg  = isDark ? '#1e1e1e' : '#ffffff';

  /* ── Panel render functions (shared by mobile and desktop) ────── */

  const renderDescriptionPanel = () => (
    <div className="flex-1 overflow-y-auto px-6 py-5 bg-white dark:bg-dark-800">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
          {challenge.title}
        </h2>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>
      {challenge.tags && challenge.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {challenge.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
        {challenge.description}
      </p>
    </div>
  );

  const renderEditorPanel = () => (
    <>
      {/* Toolbar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-dark-700 border-b border-zinc-200 dark:border-dark-600">
        <div className="flex items-center gap-2">
          <Code2 size={15} className="text-zinc-500 dark:text-zinc-400" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Editor</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-1 px-2 py-0.5 rounded text-xs bg-zinc-200 dark:bg-dark-600 text-zinc-600 dark:text-zinc-300 border-0 outline-none cursor-pointer hover:bg-zinc-300 dark:hover:bg-dark-500 transition-colors"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setCode(challenge.codeTemplate ?? '// Escribe tu solución aquí\n')}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          <RotateCcw size={12} />
          Reiniciar
        </button>
      </div>

      {/* Editor area */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ backgroundColor: editorBg, fontFamily: MONO_FONT, fontSize: CODE_SIZE }}
      >
        <div
          ref={lineNumsRef}
          className="select-none overflow-hidden shrink-0 w-11 py-3 pr-3 text-right text-xs leading-5 bg-zinc-100 dark:bg-dark-800 border-r border-zinc-200 dark:border-dark-600 text-zinc-400 dark:text-zinc-600"
          style={{ lineHeight: CODE_LINE_H }}
          aria-hidden
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={hlWrapperRef}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <SyntaxHighlighter
              language={language}
              style={hlStyle}
              showLineNumbers={false}
              customStyle={{
                margin: 0, padding: CODE_PAD, fontSize: CODE_SIZE,
                lineHeight: CODE_LINE_H, fontFamily: MONO_FONT,
                background: 'transparent', overflow: 'visible',
                whiteSpace: 'pre', minWidth: '100%',
              }}
              codeTagProps={{ style: { fontFamily: MONO_FONT, fontSize: CODE_SIZE, lineHeight: CODE_LINE_H } }}
            >
              {code || ' '}
            </SyntaxHighlighter>
          </div>
          <textarea
            ref={codeRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={syncEditorScroll}
            onKeyDown={handleCodeKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full resize-none border-0 outline-none overflow-auto"
            style={{
              fontFamily: MONO_FONT, fontSize: CODE_SIZE, lineHeight: CODE_LINE_H,
              padding: CODE_PAD, color: 'transparent',
              caretColor: isDark ? '#e5e7eb' : '#1f2937',
              background: 'transparent', whiteSpace: 'pre',
              overflowWrap: 'normal', zIndex: 1,
            }}
          />
        </div>
      </div>

      {/* Footer: analyze + submit */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-t border-zinc-200 dark:border-dark-600 bg-white dark:bg-dark-800">
        <span className="text-xs text-zinc-400">
          {lineCount} {lineCount === 1 ? 'línea' : 'líneas'}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleAnalyze}
            disabled={isBotTyping || !code.trim()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-primary-500 border border-primary-500 hover:bg-primary-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">Analiza mi solución</span>
            <span className="sm:hidden">Analizar</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !code.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Spinner size={14} /> : <SendHorizonal size={14} />}
            {isSubmitting ? 'Enviando…' : 'Entregar'}
          </button>
        </div>
      </div>
    </>
  );

  const renderChatPanel = () => (
    <>
      {/* Chat header */}
      <div className="shrink-0 flex items-center gap-2.5 px-4 py-2 bg-zinc-100 dark:bg-dark-700 border-b border-zinc-200 dark:border-dark-600">
        <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
          <Bot size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-white leading-tight">
            Complex
          </p>
          <p className="text-xs text-emerald-500 leading-tight">En línea</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
          >
            {msg.role === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={13} className="text-white" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                msg.role === 'bot'
                  ? 'bg-zinc-100 dark:bg-dark-700 text-zinc-800 dark:text-zinc-200 rounded-tl-sm'
                  : 'bg-primary-500 text-white rounded-tr-sm leading-relaxed',
              )}
            >
              {msg.role === 'bot' ? (
                <ChatMarkdown content={msg.content} isDark={isDark} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isBotTyping && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
              <Bot size={13} className="text-white" />
            </div>
            <div className="bg-zinc-100 dark:bg-dark-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="shrink-0 px-4 py-3 border-t border-zinc-200 dark:border-dark-600">
        <div className="flex items-end gap-2 rounded-xl border border-zinc-200 dark:border-dark-500 bg-zinc-50 dark:bg-dark-700 px-3 py-2 focus-within:border-primary-500 transition-colors">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleChatKey}
            placeholder="Pregúntale al asistente… (Enter para enviar)"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none leading-relaxed max-h-28"
          />
          <button
            onClick={handleSend}
            disabled={!chatInput.trim() || isBotTyping}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-primary-500 hover:bg-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Enviar mensaje"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
        <p className="text-xs text-zinc-400 mt-1.5 text-center">
          Shift+Enter para nueva línea
        </p>
      </div>
    </>
  );

  /* ── Render ───────────────────────────────────────────────────── */

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-zinc-200 dark:border-dark-600 bg-white dark:bg-dark-800">
        <nav className="flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500">
          <Link to="/challenges" className="hover:text-primary-400 transition-colors">
            Desafíos
          </Link>
          <ChevronRight size={13} />
          <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[28rem]">
            {challenge.title}
          </span>
        </nav>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>

      {/* ── Mobile tab bar (hidden on md+) ─────────────────────── */}
      <div className="md:hidden shrink-0 flex border-b border-zinc-200 dark:border-dark-600 bg-zinc-50 dark:bg-dark-700">
        {(
          [
            ['description', FileText, 'Descripción'],
            ['editor',      Code2,    'Editor'],
            ['chat',        Bot,      'Chat'],
          ] as const
        ).map(([tab, Icon, label]) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border-b-2 transition-colors',
              mobileTab === tab
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200',
            )}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── Mobile single-panel view (hidden on md+) ───────────── */}
      <div className="md:hidden flex flex-col flex-1 overflow-hidden">
        {mobileTab === 'description' && renderDescriptionPanel()}
        {mobileTab === 'editor'      && renderEditorPanel()}
        {mobileTab === 'chat'        && renderChatPanel()}
      </div>

      {/* ── Desktop split panels (hidden on < md) ──────────────── */}
      <div className="hidden md:flex flex-1 overflow-hidden">

        {/* LEFT: Descripción + Editor */}
        <div className="flex flex-col w-1/2 border-r border-zinc-200 dark:border-dark-600">

          {/* Tab bar */}
          <div className="shrink-0 flex border-b border-zinc-200 dark:border-dark-600 bg-zinc-50 dark:bg-dark-700">
            {([ ['description', FileText, 'Descripción'], ['editor', Code2, 'Editor'] ] as const).map(
              ([tab, Icon, label]) => (
                <button
                  key={tab}
                  onClick={() => setLeftTab(tab)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors',
                    leftTab === tab
                      ? 'border-primary-500 text-primary-500'
                      : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200',
                  )}
                >
                  <Icon size={13} />
                  {label}
                </button>
              )
            )}
          </div>

          {leftTab === 'description' ? renderDescriptionPanel() : renderEditorPanel()}
        </div>

        {/* RIGHT: Chatbot */}
        <div className="flex flex-col w-1/2 bg-white dark:bg-dark-800">
          {renderChatPanel()}
        </div>
      </div>

    </div>
  );
}
