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

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-light px-4">
          <div className="max-w-md w-full text-center p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {isChunkError ? 'Update Available' : 'Something went wrong'}
            </h1>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {isChunkError
                ? "A new version of the website is available. We need to refresh your page to apply the latest updates."
                : "We're sorry, but something unexpected happened. A quick refresh usually fixes this glitch."}
            </p>

            <Button
              onClick={() => {
                // Clear retry flag so lazyWithRetry can try again if needed after reload
                window.sessionStorage.removeItem('chunk_retry_occurred');
                window.location.reload();
              }}
              size="lg"
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="h-5 w-5 mr-3" />
              {isChunkError ? 'Update Now' : 'Refresh Page'}
            </Button>

            <p className="mt-6 text-xs text-gray-400">
              If the problem persists, please contact our technical support.
            </p>

            {(process.env.NODE_ENV === 'development' || window.location.hostname.includes('lovable')) && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-[10px] text-gray-300 hover:text-gray-500 uppercase tracking-widest font-bold">
                  Technical Diagnostics
                </summary>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-40 overflow-auto">
                  <pre className="text-[10px] font-mono text-gray-500 whitespace-pre-wrap">
                    {this.state.error.name}: {this.state.error.message}
                    {"\n\n"}
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
