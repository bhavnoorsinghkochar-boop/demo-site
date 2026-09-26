import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFBFB] text-[#1E2522] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-red-200 shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#DC2626] flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle className="w-8 h-8 text-[#DC2626]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#DC2626] uppercase tracking-tight">
                Laa Mamma Mia!
              </h2>
              <p className="text-sm font-semibold text-[#143627]">
                Taste Of Singapore · Rajguru Nagar, Ludhiana
              </p>
              {this.state.error && (
                <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg font-mono text-left break-words">
                  {this.state.error.message}
                </p>
              )}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3.5 px-4 rounded-xl bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <RotateCcw className="w-4 h-4 text-white" />
              <span>Reset & Reload App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
