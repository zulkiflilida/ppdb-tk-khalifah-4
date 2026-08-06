import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in Component:', error, errorInfo);
  }

  private handleReload = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-[#FFF9F2]">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full border border-rose-200 shadow-2xl text-center space-y-5 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">
                {this.props.fallbackTitle || 'Terjadi Kendala Saat Memuat Panel Admin'}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Terdapat data yang tidak valid atau masalah pemuatan komponen. Sistem telah mengisolasi error ini agar tidak merusak aplikasi.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] text-left overflow-x-auto max-h-28 border border-slate-800">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Panel Admin</span>
              </button>

              {this.props.onReset && (
                <button
                  type="button"
                  onClick={this.props.onReset}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
