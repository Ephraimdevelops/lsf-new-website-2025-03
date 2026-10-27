import { SaadaActionCard } from "@/components/haki-yangu/SaadaActionCard";
import { SaadaSpeechPlayer } from "@/components/haki-yangu/SaadaSpeechPlayer";
import { SaadaDocumentInput, type SelectedChatDocument } from "@/components/haki-yangu/SaadaDocumentInput";
import { SaadaVoiceInput } from "@/components/haki-yangu/SaadaVoiceInput";
import { LanguageSwitch } from "@/providers/LanguageProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { useCopy } from "@/i18n/useCopy";
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { SignInButton, useUser, UserButton } from '@clerk/clerk-react';
import { useAction, useMutation, usePaginatedQuery, useQuery } from 'convex/react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUp, ArrowDown, BookOpen, ChevronRight, Home, Menu, MessageCircle, Plus, ThumbsDown, ThumbsUp, X, Phone, Volume2 } from 'lucide-react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import type { ReplyLanguage } from '../../convex/lib/saadaLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type Thread = Id<'sara_conversations'> | 'legacy' | null;
const activityCopy: Record<string, string> = {
  intent_detected: 'Reading your message', risk_check_started: 'Understanding your situation',
  risk_check_completed: 'Considering the next step', knowledge_search_started: 'Looking through legal sources',
  knowledge_search_completed: 'Reviewing what is available', service_search_started: 'Looking for support',
  service_search_completed: 'Checking the matching services', tool_execution_started: 'Working on your question',
  tool_execution_completed: 'Bringing the details together', human_review_requested: 'Checking options for human help',
};
const swActivity: Record<string, string> = {
  intent_detected: 'Ninasoma ujumbe wako', risk_check_started: 'Ninaelewa hali yako',
  knowledge_search_started: 'Ninapitia vyanzo vya kisheria', service_search_started: 'Ninatafuta msaada',
};
const prompts = {
  en: ['I haven’t been paid. Where do I start?', 'Help me find a paralegal near me', 'Help me understand my rights as a tenant'],
  sw: ['Sijalipwa mshahara. Nianzie wapi?', 'Nipate msaidizi wa kisheria karibu nami', 'Nielewe haki zangu kama mpangaji'],
};

function SaadaAvatar({ large = false }: { large?: boolean }) {
  return <img src="/sara-avatar-v2.png" alt="Haki Yangu AI" className={`${large ? 'h-16 w-16' : 'h-9 w-9'} shrink-0 rounded-full object-cover ring-1 ring-black/5`} />;
}

// Render structured results outside Markdown paragraphs. Never show partial JSON
// or mark a provider as verified merely because a model supplied a marker.
function Answer({ text, sw }: { text: string; sw:boolean }) {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  const markdown = (content: string, key: string) => <div key={key} className="prose prose-sm max-w-none text-[15px] leading-7 text-stone-700 [overflow-wrap:anywhere] prose-p:my-3 prose-p:first:mt-0 prose-p:last:mb-0 prose-headings:text-stone-900 prose-a:text-primary prose-pre:overflow-x-auto prose-pre:max-w-full prose-img:hidden"><ReactMarkdown components={{ a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> }}>{content}</ReactMarkdown></div>;
  for (const match of text.matchAll(/::(PARALEGAL_CARD|SERVICE_CARD|ACTION_CARD):(\{.*?\})::/gs)) {
    if (match.index! > cursor) parts.push(markdown(text.slice(cursor, match.index), 'text-' + cursor));
    try {
      const data = JSON.parse(match[2]);
      if (match[1] === 'ACTION_CARD' && typeof data.id === 'string') parts.push(<SaadaActionCard key={'action-'+cursor} id={data.id} sw={sw}/>);
      else if (typeof data.name === 'string') parts.push(<div key={'card-' + cursor} className="my-4 rounded-2xl border border-stone-200 bg-white p-4"><div className="font-semibold text-stone-900">{data.name}</div><p className="mt-1 text-sm text-stone-500">{[data.district, data.region].filter(value => typeof value === 'string').join(', ')}</p>{typeof data.intake === 'string' && <p className="mt-2 text-sm text-stone-600">{data.intake}</p>}{typeof data.phone === 'string' && /^[+\d ()-]{6,30}$/.test(data.phone) && <a className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary" href={'tel:' + data.phone}><Phone size={15} />{data.phone}</a>}</div>);
    } catch { /* Incomplete cards are hidden, not rendered as model claims. */ }
    cursor = match.index! + match[0].length;
  }
  const tail = text.slice(cursor).replace(/::(?:PARALEGAL|SERVICE|ACTION)(?:_CARD)?[\s\S]*$/, '');
  if (tail.trim()) parts.push(markdown(tail, 'text-' + cursor));
  return <>{parts}</>;
}

export default function SaraAIPage() {
  const c = useCopy();
  const { isSignedIn, isLoaded, user } = useUser();
  const [params] = useSearchParams();
  const [thread, setThread] = useState<Thread>('legacy');
  const [drawer, setDrawer] = useState(false);
  const [profile, setProfile] = useState(false);
  const [input, setInput] = useState(() => params.get('evaluationQuestion')?.slice(0, 1200) || '');
  const [pending, setPending] = useState(false);
  const [selectedDocument,setSelectedDocument] = useState<SelectedChatDocument|null>(null);
  const [requestId, setRequestId] = useState<string>();
  const [error, setError] = useState('');
  const [atBottom, setAtBottom] = useState(true);
  const [speechId, setSpeechId] = useState<Id<'sara_chats'> | null>(null);
  useEffect(() => { setSpeechId(null); }, [user?.id, thread, pending]);
  const [rated, setRated] = useState<Record<string, string>>({});
  const [replyLanguage, setReplyLanguage] = useState<ReplyLanguage>(() => {
    try { const value = localStorage.getItem('haki-yangu:ai-reply-language'); return value === 'en' || value === 'sw' ? value : 'sw'; } catch { return 'sw'; }
  });
  const { locale } = useLanguage();
  const sw = locale === 'sw';
  const ask = useAction(api.sara_actions.ask);
  const save = useMutation(api.sara_chat.sendMessage);
  const create = useMutation(api.sara_chat.createConversation);
  const feedback = useMutation(api.sara_chat.submitFeedback);
  const me = useQuery(api.users.current, isSignedIn ? {} : 'skip');
  const threads = usePaginatedQuery(api.sara_chat.listConversations, isSignedIn ? {} : 'skip', { initialNumItems: 30 });
  const legacy = useQuery(api.sara_chat.getLegacyConversation, isSignedIn ? {} : 'skip');
  const history = usePaginatedQuery(api.sara_chat.getConversationMessages, isSignedIn && thread ? { conversationId: thread === 'legacy' ? undefined : thread } : 'skip', { initialNumItems: 40 });
  const messages = thread ? [...history.results].reverse().filter(row => row.content.trim()) : [];
  const events = useQuery(api.sara_chat.getActivityEvents, pending && requestId ? { requestId, limit: 1 } : 'skip');
  const event = events?.at(-1);
  const activity = sw ? swActivity[event?.type || 'intent_detected'] || 'Ninaandaa jibu lako' : activityCopy[event?.type || 'intent_detected'] || 'Preparing your reply';
  const scroller = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const sending = useRef(false);
  const owner = useRef(user?.id);
  owner.current = user?.id;
  const previousOwner = useRef(user?.id);
  useEffect(() => { if(previousOwner.current !== user?.id){setSelectedDocument(null);setInput('');setThread('legacy');setPending(false);sending.current=false;previousOwner.current=user?.id;} },[user?.id]);
  const following = useRef(true);
  const last = messages.at(-1);
  useEffect(() => { document.title = 'Haki Yangu AI'; }, []);
  useEffect(() => {
    if (following.current && scroller.current) scroller.current.scrollTo({ top: last || pending ? scroller.current.scrollHeight : 0, behavior: 'auto' });
  }, [last?._id, last?.content, pending, activity]);
  useEffect(() => {
    if (textarea.current) { textarea.current.style.height = 'auto'; textarea.current.style.height = Math.min(textarea.current.scrollHeight, 160) + 'px'; }
  }, [input]);

  function select(id: Thread) {
    if (sending.current) return;
    setThread(id); setSelectedDocument(null); setDrawer(false); setInput(''); setError(''); setRated({});
    following.current = true; setAtBottom(true);
  }
  async function send() {
    const body = input.trim();
    if (!body || sending.current || !isSignedIn) return;
    sending.current = true; setPending(true); setError(''); setInput(''); following.current = true;
    const id = crypto.randomUUID(); setRequestId(id);
    const requestOwner = owner.current;
    try {
      let target = thread;
      if (!target) { target = await create({ title: body }); if(owner.current !== requestOwner) return; setThread(target); }
      if(owner.current !== requestOwner) return;
      await save({ content: body, conversationId: target === 'legacy' ? undefined : target });
      if(owner.current !== requestOwner) return;
      await ask({ message: body, documentId:selectedDocument?.id, source: "web", clientRequestId: id, responseLanguage: replyLanguage, conversationId: target === 'legacy' ? undefined : target });
    } catch {
      if(owner.current !== requestOwner) return;
      setError(sw ? 'Jibu halijakamilika. Ujumbe wako uko hapa, unaweza kujaribu tena.' : 'The reply did not finish. Your message is here so you can try again.');
      setInput(body);
    } finally { if(owner.current === requestOwner){sending.current = false; setPending(false);} }
  }
  async function rate(id: Id<'sara_chats'>, rating: 'positive' | 'negative') {
    try { await feedback({ messageId: id, rating }); setRated(current => ({...current, [id]: rating})); }
    catch { toast.error(sw ? 'Maoni hayakuhifadhiwa. Jaribu tena.' : 'Could not save feedback. Please try again.'); }
  }

  const threadNavigation = <>
    <button onClick={() => select(null)} disabled={pending} className="mb-7 flex min-h-11 w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white disabled:opacity-40"><span>{sw ? 'Mazungumzo mapya' : c("New conversation")}</span><Plus size={17} /></button>
    <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400">{sw ? 'Mazungumzo yako' : c("Your conversations")}</p>
    <div className="min-h-0 flex-1 space-y-1 overflow-y-auto">
      {threads.results.map(row => <button key={row._id} disabled={pending} onClick={() => select(row._id)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm disabled:opacity-40 ${thread === row._id ? 'bg-white text-primary shadow-sm' : 'text-stone-600 hover:bg-white/70'}`}><MessageCircle size={15} className="shrink-0" /><span className="truncate">{row.title}</span></button>)}
      {legacy && <button disabled={pending} onClick={() => select('legacy')} className={`w-full rounded-lg px-3 py-3 text-left text-sm ${thread === 'legacy' ? 'bg-white text-primary shadow-sm' : 'text-stone-600'}`}>{sw ? 'Mazungumzo ya awali' : c("Earlier conversation")}</button>}
      {threads.status === 'CanLoadMore' && <button onClick={() => threads.loadMore(30)} className="p-3 text-xs text-primary">{sw ? 'Zaidi' : 'Load more'}</button>}
    </div>
    <button onClick={() => setProfile(true)} className="mt-4 flex items-center gap-3 border-t border-stone-200 pt-5 text-left"><SaadaAvatar /><span><span className="block text-sm font-semibold text-stone-800">{sw ? 'Kuhusu Haki Yangu AI' : c("Meet Haki Yangu AI")}</span><span className="text-xs text-stone-500">Kiswahili · English</span></span><ChevronRight size={16} className="ml-auto text-stone-400" /></button>
    <Link to="/" className="mt-5 flex items-center gap-2 text-xs text-stone-500"><Home size={14} />{sw ? 'Rudi LSF' : c("Back to LSF")}</Link>
  </>;

  return <div className="flex h-[100dvh] min-h-0 overflow-hidden bg-white text-stone-900">
    {isSignedIn && <aside className="hidden w-64 shrink-0 flex-col border-r border-stone-200/70 bg-[#F7F5F3] p-5 lg:flex">{threadNavigation}</aside>}
    {drawer && <div className="fixed inset-0 z-40 lg:hidden"><button aria-label={c("Close conversations")} onClick={() => setDrawer(false)} className="absolute inset-0 bg-stone-900/25" /><aside aria-label={c("Conversations")} className="absolute inset-y-0 left-0 flex w-72 flex-col bg-[#F7F5F3] p-5"><button onClick={() => setDrawer(false)} aria-label={c("Close conversations")} className="mb-5 self-end p-2"><X size={20}/></button>{threadNavigation}</aside></div>}
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-3 sm:px-8">
        <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">{isSignedIn && <button onClick={() => setDrawer(true)} aria-label={c("Open conversations")} className="p-2 lg:hidden"><Menu size={21} /></button>}<button onClick={() => setProfile(true)} aria-label={c("About Haki Yangu AI")} className="flex min-w-0 items-center gap-3 text-left"><SaadaAvatar /><span><span className="block font-semibold">Haki Yangu <span className="ml-1 text-xs font-normal text-primary">AI</span></span><span className="block text-xs text-stone-500">{sw ? 'Msaidizi wako wa haki' : c("Your rights companion")}</span></span></button></div>
        <div className="flex w-full shrink-0 items-center justify-end gap-3 sm:w-auto"><LanguageSwitch />{me?.role === 'admin' && <Link to="/sara/train" title={c("Manage knowledge")} className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"><BookOpen size={18} /></Link>}{isSignedIn ? <UserButton /> : <Link to="/" aria-label={c("Back to LSF")} className="p-2"><Home size={19}/></Link>}</div>
      </header>
      <main ref={scroller} onScroll={event => { const el = event.currentTarget; const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100; following.current = bottom; setAtBottom(bottom); }} className="min-h-0 flex-1 overflow-y-auto overscroll-contain" aria-label={c("Conversation")} aria-busy={pending}>
        <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-10 sm:py-10">
          {thread && history.status === 'CanLoadMore' && <button onClick={() => { following.current = false; history.loadMore(40); }} className="mb-6 text-sm text-primary">{sw ? 'Ujumbe wa awali' : c("Earlier messages")}</button>}
          {isLoaded && !pending && (!thread || (history.status !== 'LoadingFirstPage' && messages.length === 0)) && <div className="mx-auto max-w-xl py-8 sm:py-16"><SaadaAvatar large /><p className="mb-2 mt-6 text-sm font-medium text-primary">{sw ? 'Karibu Haki Yangu AI.' : c("How can I help?")}</p><h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{sw ? 'Tuanze na kinachokusumbua.' : 'Let’s work through it together.'}</h1><p className="mt-4 max-w-md text-[15px] leading-7 text-stone-500">{sw ? 'Msaidizi wako wa Haki Yangu AI wa LSF. Niambie kinachoendelea kwa Kiswahili au Kiingereza, tutafute hatua inayofuata.' : c("I’m LSF’s Haki Yangu AI assistant. Tell me what’s happening in English or Kiswahili, and we’ll look for a useful next step.")}</p><div className="mt-8 space-y-2">{prompts[sw ? 'sw' : 'en'].map(text => <button key={text} onClick={() => {setInput(text); textarea.current?.focus();}} className="flex w-full items-center justify-between gap-4 rounded-xl border border-stone-200 px-4 py-4 text-left text-sm text-stone-600 transition hover:border-primary/30 hover:bg-[#FAF7F8]">{text}<ChevronRight size={16} className="shrink-0 text-stone-400" /></button>)}</div></div>}
          {thread && history.status === 'LoadingFirstPage' && <p className="py-10 text-center text-sm text-stone-400">{sw ? 'Inafungua mazungumzo…' : 'Opening conversation…'}</p>}
          <div className="space-y-9">{messages.map(message => <article key={message._id} aria-label={message.role === 'user' ? 'Your message' : 'Haki Yangu AI reply'} className={message.role === 'user' ? 'ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-[#F4EFF1] px-5 py-3.5' : 'min-w-0'}>{message.role === 'user' ? <p className="whitespace-pre-wrap text-[15px] leading-7 text-stone-800 [overflow-wrap:anywhere]">{message.content}</p> : <><button onClick={() => setProfile(true)} className="mb-3 flex items-center gap-2.5 text-xs font-semibold text-primary"><SaadaAvatar />Haki Yangu <span className="font-normal text-stone-400">AI</span></button><div className="min-w-0 sm:pl-[46px]"><Answer text={message.content} sw={sw}/>{isSignedIn && !pending && message.metadata?.completedAt && !message.metadata?.failureCode && <>{speechId === message._id ? <SaadaSpeechPlayer key={`${user?.id}:${thread}:${message._id}`} messageId={message._id} sw={sw} onClose={() => setSpeechId(null)}/> : <button type="button" onClick={() => setSpeechId(message._id)} className="mt-3 flex min-h-11 items-center gap-2 text-xs font-medium text-primary" aria-label={sw ? 'Sikiliza jibu' : 'Listen to answer'}><Volume2 size={16}/>{sw ? 'Sikiliza · Sauti ya AI (OpenAI)' : 'Listen · AI voice (OpenAI)'}</button>}</>}<div className="mt-3 flex items-center gap-1"><button title={c("Helpful")} aria-label={c("Helpful")} aria-pressed={rated[message._id] === 'positive'} onClick={() => void rate(message._id, 'positive')} className={`rounded-lg p-2 ${rated[message._id] === 'positive' ? 'bg-green-50 text-green-700' : 'text-stone-400 hover:bg-stone-50'}`}><ThumbsUp size={14}/></button><button title={c("Not helpful")} aria-label={c("Not helpful")} aria-pressed={rated[message._id] === 'negative'} onClick={() => void rate(message._id, 'negative')} className={`rounded-lg p-2 ${rated[message._id] === 'negative' ? 'bg-red-50 text-primary' : 'text-stone-400 hover:bg-stone-50'}`}><ThumbsDown size={14}/></button>{rated[message._id] && <span className="ml-2 text-xs text-stone-400">{sw ? 'Asante' : c("Thank you")}</span>}</div></div></>}</article>)}
          {pending && <div role="status" aria-label={c("Haki Yangu AI activity")} aria-live="polite" data-testid="saada-working" className="flex min-h-12 items-center gap-3 text-sm text-stone-500"><SaadaAvatar /><span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary motion-reduce:animate-none"/><span>{activity}</span></div>}
          </div>
          {error && <p role="alert" className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-primary">{error}</p>}
        </div>
      </main>
      <footer className="relative max-h-[60dvh] shrink-0 overflow-y-auto border-t border-stone-100 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:px-8">
        {!atBottom && <button aria-label={c("Latest message")} onClick={() => {following.current = true; scroller.current?.scrollTo({top:scroller.current.scrollHeight,behavior:'smooth'});}} className="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full border border-stone-200 bg-white p-2 shadow-sm"><ArrowDown size={18}/></button>}
        <div className="mx-auto max-w-3xl"><div className="mb-2 flex items-center justify-between gap-3"><label className="flex items-center gap-2 text-xs text-stone-500">{sw ? 'Majibu' : 'Reply in'}<select aria-label={c("Reply language")} disabled={pending} value={replyLanguage} onChange={event => { const value = event.target.value as ReplyLanguage; setReplyLanguage(value); try {localStorage.setItem('haki-yangu:ai-reply-language',value);} catch { /* Session preference still works. */ } }} className="max-w-44 rounded-md border-0 bg-stone-50 py-1.5 pl-2 pr-6 text-xs text-stone-600"><option value="auto">{sw ? 'Lugha ya swali lako' : 'Language of your question'}</option><option value="sw">Kiswahili</option><option value="en" lang="en">English</option></select></label><span className="hidden text-xs text-stone-400 sm:block">Kiswahili · English</span></div>
          {isSignedIn && <SaadaDocumentInput key={user?.id} sw={sw} disabled={pending} selected={selectedDocument} onSelect={setSelectedDocument} />}
          {isSignedIn && <SaadaVoiceInput key={user?.id} sw={sw} disabled={pending} onText={text => { setInput(current => [current.trim(), text].filter(Boolean).join("\n").slice(0,5000)); textarea.current?.focus(); }} />}
          {isLoaded && !isSignedIn ? <SignInButton mode="modal"><button className="w-full rounded-xl bg-primary px-4 py-4 text-sm font-medium text-white">{sw ? 'Ingia kuuliza Haki Yangu AI' : 'Sign in to ask Haki Yangu AI'}</button></SignInButton> : <form onSubmit={event => {event.preventDefault(); void send();}} className="flex items-end gap-2 rounded-2xl border border-stone-200 bg-[#FAF9F8] p-2 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/5"><textarea ref={textarea} value={input} onChange={event => setInput(event.target.value)} maxLength={5000} onKeyDown={event => {if(event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {event.preventDefault(); void send();}}} aria-label={sw ? "Ujumbe kwa Haki Yangu AI" : c("Message Haki Yangu AI")} placeholder={sw ? 'Niambie kinachoendelea…' : 'Tell me what’s going on…'} rows={1} className="max-h-40 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] leading-6 outline-none placeholder:text-stone-400"/><button type="submit" aria-label={c("Send message")} disabled={pending || !input.trim() || !isSignedIn} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition disabled:bg-stone-200 disabled:text-stone-400"><ArrowUp size={20}/></button></form>}
          <p className="mt-2 text-center text-[11px] leading-5 text-stone-400">{sw ? 'Majibu ya AI yanaweza kukosea. Hakiki taarifa muhimu. Si mbadala wa wakili.' : 'AI replies can be wrong. Check important information. They do not replace a lawyer.'}</p>
        </div>
      </footer>
    </div>
    <Dialog open={profile} onOpenChange={setProfile}><DialogContent className="max-w-sm rounded-3xl"><DialogHeader><SaadaAvatar large/><DialogTitle className="pt-3 text-2xl">{sw ? 'Kuhusu Haki Yangu AI' : c("About Haki Yangu AI")}</DialogTitle><DialogDescription className="pt-2 text-sm leading-6">{sw ? 'Msaidizi wako wa Haki Yangu AI wa LSF. Unaweza kuzungumza nami kwa Kiswahili au Kiingereza.' : c("Your Haki Yangu AI assistant at LSF. You can talk with me in English or Kiswahili.")}</DialogDescription></DialogHeader><p className="text-sm leading-6 text-stone-600">{sw ? 'Naweza kukusaidia kueleza hali yako, kutafuta mwongozo na mawasiliano ya msaada, na kuandaa rasimu ya ombi. Mimi ni AI; sipigi simu wala kutuma rufaa kupitia mazungumzo haya.' : c("I can help you talk through a situation, look for guidance and support contacts, and prepare a draft request. I’m an AI; I don’t make calls or send referrals through this chat.")}</p><button onClick={() => setProfile(false)} className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white">{sw ? 'Tuendelee' : c("Let’s talk")}</button></DialogContent></Dialog>
  </div>;
}
