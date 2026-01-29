import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  GitBranch, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ChevronDown,
  ExternalLink,
  GitCommit,
  User,
  Filter
} from "lucide-react";
import { useState } from "react";

const deployments = [
  {
    id: 1,
    version: "v2.4.1",
    project: "api-gateway",
    environment: "Production",
    status: "success",
    time: "2024-01-15 14:32:00",
    duration: "2m 34s",
    commit: "a3f2b1c",
    author: "Sarah Chen",
    message: "Fix rate limiting edge case for high-traffic endpoints",
  },
  {
    id: 2,
    version: "v1.8.0",
    project: "auth-service",
    environment: "Production",
    status: "success",
    time: "2024-01-15 14:15:00",
    duration: "1m 48s",
    commit: "b4e2d1a",
    author: "Alex Rivera",
    message: "Add OAuth2 support for GitHub and GitLab providers",
  },
  {
    id: 3,
    version: "v3.0.0-beta",
    project: "dashboard-ui",
    environment: "Staging",
    status: "pending",
    time: "2024-01-15 14:30:00",
    duration: "In progress",
    commit: "c5f3e2b",
    author: "Jordan Kim",
    message: "Implement new dashboard design with real-time updates",
  },
  {
    id: 4,
    version: "v2.3.9",
    project: "api-gateway",
    environment: "Production",
    status: "failed",
    time: "2024-01-15 13:32:00",
    duration: "0m 45s",
    commit: "d6g4f3c",
    author: "Sarah Chen",
    message: "Update dependencies and migrate to Node 20",
  },
  {
    id: 5,
    version: "v1.7.9",
    project: "auth-service",
    environment: "Production",
    status: "success",
    time: "2024-01-15 12:15:00",
    duration: "1m 52s",
    commit: "e7h5g4d",
    author: "Morgan Lee",
    message: "Optimize token validation performance",
  },
  {
    id: 6,
    version: "v2.3.8",
    project: "api-gateway",
    environment: "Staging",
    status: "success",
    time: "2024-01-15 11:00:00",
    duration: "2m 15s",
    commit: "f8i6h5e",
    author: "Sarah Chen",
    message: "Add comprehensive API documentation",
  },
];

const Deployments = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="dark min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Deployment Timeline</h1>
              <p className="text-muted-foreground">Track all deployments across your projects.</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            {/* Deployment Items */}
            <div className="space-y-4">
              {deployments.map((deployment, index) => (
                <div 
                  key={deployment.id}
                  className="relative pl-16 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-4 w-5 h-5 rounded-full border-4 border-background ${
                    deployment.status === 'success' ? 'bg-success' :
                    deployment.status === 'pending' ? 'bg-warning animate-pulse' :
                    'bg-destructive'
                  }`} />

                  <GlassCard 
                    className="cursor-pointer transition-all"
                    onClick={() => setExpandedId(expandedId === deployment.id ? null : deployment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          deployment.status === 'success' ? 'bg-success/10' :
                          deployment.status === 'pending' ? 'bg-warning/10' :
                          'bg-destructive/10'
                        }`}>
                          {deployment.status === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : deployment.status === 'pending' ? (
                            <Clock className="w-5 h-5 text-warning" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{deployment.version}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              {deployment.project}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                              {deployment.environment}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{deployment.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{deployment.duration}</p>
                          <p className="text-xs text-muted-foreground">{deployment.time}</p>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${
                          expandedId === deployment.id ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedId === deployment.id && (
                      <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Commit</p>
                            <div className="flex items-center gap-2">
                              <GitCommit className="w-4 h-4 text-muted-foreground" />
                              <span className="font-mono text-sm">{deployment.commit}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Author</p>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{deployment.author}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                            <span className={`text-sm font-medium capitalize ${
                              deployment.status === 'success' ? 'text-success' :
                              deployment.status === 'pending' ? 'text-warning' :
                              'text-destructive'
                            }`}>
                              {deployment.status}
                            </span>
                          </div>
                          <div className="flex items-end justify-end">
                            <Button variant="outline" size="sm" className="gap-2">
                              <ExternalLink className="w-4 h-4" />
                              View Logs
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Deployments;
