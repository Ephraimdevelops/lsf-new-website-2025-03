import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const modules={
 '@clerk/clerk-react':'export const useUser=()=>globalThis.__chatViewer; export const SignInButton="div",UserButton="div";',
 'convex/react':'export const useAction=()=>async()=>{},useMutation=()=>async()=>{},useQuery=()=>undefined,usePaginatedQuery=()=>globalThis.__chatHistory;',
 'react-router-dom':'export const Link="a",useSearchParams=()=>[new URLSearchParams()];',
 '@/providers/LanguageProvider':'export const useLanguage=()=>({locale:"en"}),LanguageSwitch="div";',
 '@/i18n/useCopy':'export const useCopy=()=>text=>text;',
 'lucide-react':'export const '+['ArrowUp','ArrowDown','BookOpen','ChevronRight','Home','Menu','MessageCircle','Plus','ThumbsDown','ThumbsUp','X','Phone','Volume2'].map(x=>x+'=()=>null').join(',')+';',
 'react-markdown':'export default function Markdown({children}){return children;}',
 'sonner':'export const toast={error(){}};',
 'api':'export const api=new Proxy({},{get:()=>new Proxy({},{get:()=>"query"})});',
 'ui':'export const '+['ConversationMemory','SaadaActionCard','SaadaSpeechPlayer','SaadaDocumentInput','SaadaVoiceInput','Dialog','DialogContent','DialogHeader','DialogTitle','DialogDescription'].map(x=>x+'="div"').join(',')+';'
};
const bundle=await build({entryPoints:['src/pages/SaraAI.tsx'],bundle:true,write:false,format:'cjs',jsx:'automatic',platform:'node',external:['react','react/jsx-runtime'],plugins:[{name:'controlled-chat-view',setup(b){b.onResolve({filter:/^@\/|^@clerk\/|^convex\/react$|^react-router-dom$|^lucide-react$|^react-markdown$|^sonner$|convex\/_generated\/api$/},args=>({path:modules[args.path]?args.path:args.path.endsWith('convex/_generated/api')?'api':'ui',namespace:'chat-test'}));b.onLoad({filter:/.*/,namespace:'chat-test'},args=>({contents:modules[args.path],loader:'js'}));}}]});
const compiled={exports:{}};
vm.runInThisContext('(function(require,module,exports){'+bundle.outputFiles[0].text+'\n})')(createRequire(import.meta.url),compiled,compiled.exports);
const Page=compiled.exports.default;
function view({loaded=true,signedIn=false,loading=true}={}){
 globalThis.__chatViewer={isLoaded:loaded,isSignedIn:signedIn,user:signedIn?{id:'fictional-owner'}:undefined};
 globalThis.__chatHistory={results:[{_id:'cached',role:'assistant',content:'STALE_CACHED_MESSAGE'}],status:loading?'LoadingFirstPage':'Exhausted'};
 return renderToStaticMarkup(React.createElement(Page));
}
test('signed-out chat shows a welcome and sign-in instead of loading a skipped conversation',()=>{const html=view();assert.match(html,/Let’s work through it together/);assert.match(html,/Sign in to ask Haki Yangu AI/);assert.doesNotMatch(html,/Opening conversation|STALE_CACHED_MESSAGE/);});
test('auth loading never exposes cached messages or a false welcome',()=>{const html=view({loaded:false});assert.doesNotMatch(html,/STALE_CACHED_MESSAGE|Let’s work through it together|Opening conversation/);});
test('a signed-in conversation being loaded hides cached rows from the previous query',()=>{const html=view({signedIn:true});assert.match(html,/Opening conversation/);assert.doesNotMatch(html,/STALE_CACHED_MESSAGE/);});
test('a signed-in completed conversation renders returned messages',()=>{const html=view({signedIn:true,loading:false});assert.match(html,/STALE_CACHED_MESSAGE/);assert.doesNotMatch(html,/Opening conversation/);});
