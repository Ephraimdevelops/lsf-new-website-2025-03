import { useLanguage } from "@/providers/LanguageProvider";
import * as Sentry from "@sentry/react";
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // =====================================================
    // SENTRY: Capture error with full context
    // =====================================================
    Sentry.withScope((scope) => {
      scope.setExtras({
        componentStack: errorInfo.componentStack,
      });
      Sentry.captureException(error);
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes('Loading chunk') ||
        this.state.error?.message?.includes('ChunkLoadError');

      return <ErrorFallback chunk={Boolean(isChunkError)} error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({chunk,error}:{chunk:boolean;error:Error|null}) {
 const {locale}=useLanguage();const sw=locale==='sw';
 return <main role="alert" className="flex min-h-screen items-center justify-center bg-neutral-50 p-6"><div className="max-w-md space-y-5 rounded-3xl bg-white p-8 text-center shadow-sm"><AlertTriangle aria-hidden="true" className="mx-auto h-10 w-10 text-primary"/><h1 className="text-2xl font-semibold">{sw?'Ukurasa haujafunguka':'This page did not open'}</h1><p>{sw?(chunk?'Fungua ukurasa tena ili kupata taarifa za sasa.':'Jaribu kufungua ukurasa tena. Ikiwa tatizo linaendelea, wasiliana na LSF.'):(chunk?'Open the page again to get the current version.':'Try opening the page again. If the problem continues, contact LSF.')}</p><Button onClick={()=>{try{window.sessionStorage.removeItem('chunk_retry_occurred');}catch{/* Retry still works without storage. */}window.location.reload();}}><RefreshCw aria-hidden="true" className="mr-2 h-4 w-4"/>{sw?'Fungua tena':'Open again'}</Button><a href="mailto:info@lsftz.org" className="block text-primary underline">info@lsftz.org</a>{import.meta.env.DEV&&error&&<details className="text-left text-xs"><summary>Development diagnostics</summary><pre className="whitespace-pre-wrap">{error.message}</pre></details>}</div></main>;
}

export default ErrorBoundary;
