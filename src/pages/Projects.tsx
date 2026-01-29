import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { 
  FolderKanban, 
  Plus, 
  GitBranch, 
  CheckCircle,
  Clock,
  Copy,
  Check,
  Users,
  Globe,
  Settings
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: 1,
    name: "api-gateway",
    description: "Main API gateway handling all incoming requests",
    status: "healthy",
    lastDeployment: "2 min ago",
    deployments: 847,
    successRate: 99.8,
    webhookUrl: "https://api.deploytrack.io/hooks/a3f2b1c",
    team: [
      { name: "Sarah Chen", avatar: "SC" },
      { name: "Alex Rivera", avatar: "AR" },
    ],
  },
  {
    id: 2,
    name: "auth-service",
    description: "Authentication and authorization microservice",
    status: "healthy",
    lastDeployment: "15 min ago",
    deployments: 523,
    successRate: 99.5,
    webhookUrl: "https://api.deploytrack.io/hooks/b4e2d1a",
    team: [
      { name: "Alex Rivera", avatar: "AR" },
      { name: "Jordan Kim", avatar: "JK" },
    ],
  },
  {
    id: 3,
    name: "dashboard-ui",
    description: "Frontend dashboard application",
    status: "deploying",
    lastDeployment: "In progress",
    deployments: 312,
    successRate: 98.7,
    webhookUrl: "https://api.deploytrack.io/hooks/c5f3e2b",
    team: [
      { name: "Jordan Kim", avatar: "JK" },
      { name: "Morgan Lee", avatar: "ML" },
      { name: "Sarah Chen", avatar: "SC" },
    ],
  },
  {
    id: 4,
    name: "payment-service",
    description: "Payment processing and billing service",
    status: "unhealthy",
    lastDeployment: "1 hour ago",
    deployments: 198,
    successRate: 96.2,
    webhookUrl: "https://api.deploytrack.io/hooks/d6g4f3c",
    team: [
      { name: "Sarah Chen", avatar: "SC" },
    ],
  },
  {
    id: 5,
    name: "notification-service",
    description: "Email, SMS, and push notification service",
    status: "healthy",
    lastDeployment: "3 hours ago",
    deployments: 156,
    successRate: 99.1,
    webhookUrl: "https://api.deploytrack.io/hooks/e7h5g4d",
    team: [
      { name: "Morgan Lee", avatar: "ML" },
      { name: "Alex Rivera", avatar: "AR" },
    ],
  },
];

const Projects = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = (text: string, projectId: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(projectId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-success";
      case "deploying": return "bg-warning animate-pulse";
      case "unhealthy": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="dark min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <FolderKanban className="w-8 h-8 text-primary" />
                Projects
              </h1>
              <p className="text-muted-foreground">Manage your projects and deployment settings.</p>
            </div>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <GlassCard
                key={project.id}
                hover3D
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' } as React.CSSProperties}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                      <h3 className="text-xl font-semibold">{project.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
                  <div>
                    <p className="text-xs text-muted-foreground">Deployments</p>
                    <p className="text-lg font-bold">{project.deployments}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                    <p className={cn(
                      "text-lg font-bold",
                      project.successRate >= 99 ? "text-success" : 
                      project.successRate >= 97 ? "text-warning" : "text-destructive"
                    )}>
                      {project.successRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Deploy</p>
                    <p className="text-lg font-bold flex items-center gap-1">
                      {project.status === 'deploying' ? (
                        <Clock className="w-4 h-4 text-warning" />
                      ) : null}
                      <span className="text-sm">{project.lastDeployment}</span>
                    </p>
                  </div>
                </div>

                {/* Team */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="flex -space-x-2">
                      {project.team.map((member, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium"
                          title={member.name}
                        >
                          {member.avatar}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Webhook URL */}
                <div className="mt-4 p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-xs font-mono text-muted-foreground truncate">
                        {project.webhookUrl}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8"
                      onClick={() => copyToClipboard(project.webhookUrl, project.id)}
                    >
                      {copiedId === project.id ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;
