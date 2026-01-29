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
  Filter
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Severity = "critical" | "warning" | "info";

const incidents = [
  {
    id: 1,
    title: "Database Connection Timeout",
    description: "PostgreSQL primary instance experiencing connection timeouts during peak traffic",
    severity: "critical" as Severity,
    status: "open",
    service: "api-gateway",
    createdAt: "2024-01-15 14:25:00",
    updatedAt: "2024-01-15 14:30:00",
    assignee: "Sarah Chen",
    affectedUsers: 1250,
  },
  {
    id: 2,
    title: "High CPU Usage - Production",
    description: "Worker nodes showing sustained 95%+ CPU utilization",
    severity: "warning" as Severity,
    status: "investigating",
    service: "auth-service",
    createdAt: "2024-01-15 14:10:00",
    updatedAt: "2024-01-15 14:20:00",
    assignee: "Alex Rivera",
    affectedUsers: 500,
  },
  {
    id: 3,
    title: "SSL Certificate Expiring Soon",
    description: "Production SSL certificate expires in 7 days",
    severity: "info" as Severity,
    status: "open",
    service: "api-gateway",
    createdAt: "2024-01-15 10:00:00",
    updatedAt: "2024-01-15 10:00:00",
    assignee: "Jordan Kim",
    affectedUsers: 0,
  },
  {
    id: 4,
    title: "Memory Leak Detected",
    description: "Gradual memory increase detected in dashboard service pods",
    severity: "warning" as Severity,
    status: "resolved",
    service: "dashboard-ui",
    createdAt: "2024-01-14 16:00:00",
    updatedAt: "2024-01-15 09:30:00",
    assignee: "Morgan Lee",
    affectedUsers: 0,
  },
  {
    id: 5,
    title: "API Rate Limit Exceeded",
    description: "Third-party payment API rate limits hit during checkout surge",
    severity: "critical" as Severity,
    status: "resolved",
    service: "payment-service",
    createdAt: "2024-01-14 12:00:00",
    updatedAt: "2024-01-14 14:00:00",
    assignee: "Sarah Chen",
    affectedUsers: 850,
  },
];

const Incidents = () => {
  const [filter, setFilter] = useState<"all" | Severity>("all");

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

          {/* Incidents List */}
          <div className="space-y-4">
            {filteredIncidents.map((incident, index) => {
              const SeverityIcon = getSeverityIcon(incident.severity);
              return (
                <GlassCard 
                  key={incident.id}
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
                      "p-2 rounded-lg border",
                      getSeverityColor(incident.severity)
                    )}>
                      <SeverityIcon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{incident.title}</h3>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full uppercase font-medium",
                          incident.status === 'open' && "bg-destructive/20 text-destructive",
                          incident.status === 'investigating' && "bg-warning/20 text-warning",
                          incident.status === 'resolved' && "bg-success/20 text-success"
                        )}>
                          {incident.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                      
                      <div className="flex items-center gap-6 mt-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Server className="w-4 h-4" />
                          <span>{incident.service}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{incident.assignee}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{incident.createdAt}</span>
                        </div>
                        {incident.affectedUsers > 0 && (
                          <div className="text-destructive font-medium">
                            {incident.affectedUsers.toLocaleString()} users affected
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
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
        </div>
      </main>
    </div>
  );
};

export default Incidents;
