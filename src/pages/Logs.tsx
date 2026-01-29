import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Terminal, 
  Search, 
  Download, 
  Pause, 
  Play,
  Filter,
  ChevronDown
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
}

const generateLogs = (): LogEntry[] => [
  { id: 1, timestamp: "2024-01-15 14:32:45.123", level: "info", service: "api-gateway", message: "Request processed successfully: POST /api/v1/deployments" },
  { id: 2, timestamp: "2024-01-15 14:32:44.892", level: "debug", service: "auth-service", message: "Token validated for user: usr_a3f2b1c" },
  { id: 3, timestamp: "2024-01-15 14:32:44.654", level: "info", service: "api-gateway", message: "Incoming request: POST /api/v1/deployments from 192.168.1.100" },
  { id: 4, timestamp: "2024-01-15 14:32:43.321", level: "warn", service: "database", message: "Connection pool nearing capacity: 85/100 connections in use" },
  { id: 5, timestamp: "2024-01-15 14:32:42.987", level: "error", service: "payment-service", message: "Failed to process payment: timeout after 30000ms" },
  { id: 6, timestamp: "2024-01-15 14:32:42.654", level: "info", service: "auth-service", message: "User authentication successful: usr_b4e2d1a" },
  { id: 7, timestamp: "2024-01-15 14:32:41.432", level: "debug", service: "api-gateway", message: "Rate limit check passed for IP: 192.168.1.100" },
  { id: 8, timestamp: "2024-01-15 14:32:40.210", level: "info", service: "deployment-service", message: "Build completed successfully: build_c5f3e2b" },
  { id: 9, timestamp: "2024-01-15 14:32:39.876", level: "warn", service: "cache-service", message: "Cache miss for key: user_preferences_usr_a3f2b1c" },
  { id: 10, timestamp: "2024-01-15 14:32:38.543", level: "error", service: "notification-service", message: "Failed to send email notification: SMTP connection refused" },
  { id: 11, timestamp: "2024-01-15 14:32:37.321", level: "info", service: "api-gateway", message: "Health check passed: all services healthy" },
  { id: 12, timestamp: "2024-01-15 14:32:36.098", level: "debug", service: "database", message: "Query executed in 23ms: SELECT * FROM deployments WHERE status = 'active'" },
];

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>(generateLogs());
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [levelFilter, setLevelFilter] = useState<"all" | LogLevel>("all");
  const logsEndRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "error": return "text-destructive";
      case "warn": return "text-warning";
      case "info": return "text-primary";
      case "debug": return "text-muted-foreground";
    }
  };

  const getLevelBg = (level: LogLevel) => {
    switch (level) {
      case "error": return "bg-destructive/10";
      case "warn": return "bg-warning/10";
      case "info": return "bg-primary/10";
      case "debug": return "bg-muted";
    }
  };

  return (
    <div className="dark min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Terminal className="w-8 h-8 text-primary" />
                Logs Viewer
              </h1>
              <p className="text-muted-foreground">Real-time logs from all services.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant={isPaused ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="gap-2"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
            <div className="flex items-center gap-2">
              {(["all", "error", "warn", "info", "debug"] as const).map((level) => (
                <Button
                  key={level}
                  variant={levelFilter === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLevelFilter(level)}
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Logs Terminal */}
          <GlassCard className="p-0 overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-warning' : 'bg-success animate-pulse'}`} />
                <span>{isPaused ? 'Paused' : 'Live'}</span>
              </div>
            </div>

            {/* Logs Content */}
            <div className="h-[600px] overflow-y-auto scrollbar-thin terminal font-mono text-sm">
              <div className="p-4 space-y-1">
                {filteredLogs.map((log, index) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 py-2 px-3 rounded hover:bg-muted/30 transition-colors opacity-0 animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
                  >
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {log.timestamp}
                    </span>
                    <span className={`uppercase text-xs font-bold shrink-0 px-2 py-0.5 rounded ${getLevelBg(log.level)} ${getLevelColor(log.level)}`}>
                      {log.level.padEnd(5)}
                    </span>
                    <span className="text-accent shrink-0">
                      [{log.service}]
                    </span>
                    <span className="text-foreground break-all">
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

            {/* Terminal Footer */}
            <div className="px-4 py-2 border-t border-border/50 bg-muted/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Showing {filteredLogs.length} of {logs.length} entries
              </span>
              <span className="text-xs text-muted-foreground">
                Last updated: just now
              </span>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default Logs;
