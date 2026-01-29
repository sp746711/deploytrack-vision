import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary: catches render errors in tree, prevents white screen.
 * Renders fallback UI instead of crashing.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="dark min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground text-sm mb-6">
              The app hit an error. Try refreshing or going back home.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
              <Button
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Go home
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
