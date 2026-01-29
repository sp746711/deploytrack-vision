import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Plus,
  Clock,
  Copy,
  Check,
  Users,
  Globe,
  Settings,
  Loader,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getProjects } from "@/api/projects";
import { asList } from "@/api/helpers";
import { useToast } from "@/hooks/use-toast";

interface Project {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  webhookUrl?: string;
  deployments?: number;
  successRate?: number;
  lastDeployment?: string;
  team?: { name: string; avatar: string }[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await getProjects();
        setProjects(asList(res));
      } catch (err: unknown) {
        const e = err as { message?: string };
        toast({
          title: "Error",
          description: e?.message ?? "Failed to load projects",
          variant: "destructive",
        });
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [toast]);

  const copyToClipboard = (text: string, projectId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(projectId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "active":
        return "bg-success";
      case "deploying":
        return "bg-warning animate-pulse";
      case "unhealthy":
      case "archived":
        return "bg-destructive";
      default:
        return "bg-muted";
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
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <GlassCard className="text-center py-12">
              <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No projects yet</p>
              <p className="text-sm text-muted-foreground mt-2">Create one from the Dashboard.</p>
            </GlassCard>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => {
                const team = Array.isArray(project.team) ? project.team : [];
                const deployments = typeof project.deployments === "number" ? project.deployments : 0;
                const successRate = typeof project.successRate === "number" ? project.successRate : 0;
                const lastDeploy = project.lastDeployment ?? "No deployments yet";
                const status = project.status ?? "active";
                const webhookUrl = project.webhookUrl ?? "";
                return (
                  <GlassCard
                    key={project._id}
                    hover3D
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" } as React.CSSProperties}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                          <h3 className="text-xl font-semibold">{project.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.description || "—"}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground">Deployments</p>
                        <p className="text-lg font-bold">{deployments}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                        <p
                          className={cn(
                            "text-lg font-bold",
                            successRate >= 99 ? "text-success" : successRate >= 97 ? "text-warning" : "text-destructive"
                          )}
                        >
                          {successRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Deploy</p>
                        <p className="text-lg font-bold flex items-center gap-1">
                          {status === "deploying" ? <Clock className="w-4 h-4 text-warning" /> : null}
                          <span className="text-sm">{lastDeploy}</span>
                        </p>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div className="flex -space-x-2">
                          {team.map((member, i) => (
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
                    {webhookUrl ? (
                      <div className="mt-4 p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="text-xs font-mono text-muted-foreground truncate">
                              {webhookUrl}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 h-8 w-8"
                            onClick={() => copyToClipboard(webhookUrl, project._id)}
                          >
                            {copiedId === project._id ? (
                              <Check className="w-4 h-4 text-success" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;
