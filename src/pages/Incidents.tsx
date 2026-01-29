import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Clock,
  CheckCircle,
  User,
  Server,
  Filter,
  Loader
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getIncidents } from "@/api/incidents";
import { asList } from "@/api/helpers";
import { useToast } from "@/hooks/use-toast";

type Severity = "critical" | "warning" | "info";

interface Incident {
  _id: string;
  title: string;
  description?: string;
  severity: Severity;
  status?: "open" | "investigating" | "resolved";
  service?: string;
  createdAt: string;
  updatedAt?: string;
  assignee?: string;
  affectedUsers?: number;
}

const Incidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const res = await getIncidents();
        setIncidents(asList(res));
      } catch (err: unknown) {
        const e = err as { message?: string };
        toast({
          title: "Error",
          description: e?.message ?? "Failed to load incidents",
          variant: "destructive",
        });
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [toast]);

  const filteredIncidents = incidents.filter(
    (incident) => filter === "all" || incident.severity === filter
  );

  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case "critical":
        return AlertCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return Info;
    }
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case "critical":
        return "text-destructive bg-destructive/10 border-destructive/50";
      case "warning":
        return "text-warning bg-warning/10 border-warning/50";
      case "info":
        return "text-primary bg-primary/10 border-primary/50";
    }
  };

  // Format time ago
  const timeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="dark min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Incident Management</h1>
              <p className="text-muted-foreground">Track and resolve incidents across your infrastructure.</p>
            </div>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <AlertTriangle className="w-4 h-4" />
              Report Incident
            </Button>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground mr-2">Filter by severity:</span>
            {(["all", "critical", "warning", "info"] as const).map((severity) => (
              <Button
                key={severity}
                variant={filter === severity ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(severity)}
                className={cn(
                  "capitalize",
                  filter === severity && severity === "critical" && "bg-destructive hover:bg-destructive/90",
                  filter === severity && severity === "warning" && "bg-warning hover:bg-warning/90 text-warning-foreground",
                  filter === severity && severity === "info" && "bg-primary hover:bg-primary/90"
                )}
              >
                {severity}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredIncidents.length === 0 ? (
            <GlassCard className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {incidents.length === 0 ? "No incidents reported" : "No incidents match the selected severity filter"}
              </p>
            </GlassCard>
          ) : (
            <>
              {/* Incidents List */}
              <div className="space-y-4">
                {filteredIncidents.map((incident, index) => {
                  const SeverityIcon = getSeverityIcon(incident.severity);
                  return (
                    <GlassCard 
                      key={incident._id}
                      className={cn(
                        "opacity-0 animate-fade-in-up transition-all cursor-pointer hover:border-l-4",
                        incident.severity === 'critical' && "hover:border-l-destructive",
                        incident.severity === 'warning' && "hover:border-l-warning",
                        incident.severity === 'info' && "hover:border-l-primary"
                      )}
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-2 rounded-lg border flex-shrink-0",
                          getSeverityColor(incident.severity)
                        )}>
                          <SeverityIcon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{incident.title}</h3>
                            {incident.status && (
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full uppercase font-medium",
                                incident.status === 'open' && "bg-destructive/20 text-destructive",
                                incident.status === 'investigating' && "bg-warning/20 text-warning",
                                incident.status === 'resolved' && "bg-success/20 text-success"
                              )}>
                                {incident.status}
                              </span>
                            )}
                          </div>
                          {incident.description && (
                            <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                          )}
                          
                          <div className="flex items-center gap-6 mt-4 text-sm flex-wrap">
                            {incident.service && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Server className="w-4 h-4" />
                                <span>{incident.service}</span>
                              </div>
                            )}
                            {incident.assignee && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="w-4 h-4" />
                                <span>{incident.assignee}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{timeAgo(incident.createdAt)}</span>
                            </div>
                            {incident.affectedUsers && incident.affectedUsers > 0 && (
                              <div className="text-destructive font-medium">
                                {incident.affectedUsers.toLocaleString()} users affected
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {incident.status === 'resolved' ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Incidents;
