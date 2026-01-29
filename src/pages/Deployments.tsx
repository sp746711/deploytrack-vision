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
  Filter,
  Loader
} from "lucide-react";
import { useState, useEffect } from "react";
import { getDeployments } from "@/api/deployments";
import { getProjects } from "@/api/projects";
import { useToast } from "@/hooks/use-toast";

interface Deployment {
  _id: string;
  name: string;
  project?: string;
  environment?: string;
  status: "success" | "pending" | "failed";
  createdAt: string;
  duration?: string;
  commit?: string;
  author?: string;
  message?: string;
}

const Deployments = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data);
        // Select first project by default
        if (res.data.length > 0) {
          setSelectedProject(res.data[0]._id);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
      }
    };

    fetchProjects();
  }, [toast]);

  // Fetch deployments when selected project changes
  useEffect(() => {
    if (!selectedProject) return;

    const fetchDeployments = async () => {
      try {
        setLoading(true);
        const res = await getDeployments(selectedProject);
        setDeployments(Array.isArray(res.data) ? res.data : []);
      } catch (error: any) {
        // Handle error gracefully - might not have deployments yet
        setDeployments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeployments();
  }, [selectedProject]);

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
              <h1 className="text-3xl font-bold mb-2">Deployment Timeline</h1>
              <p className="text-muted-foreground">Track all deployments across your projects.</p>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Project Selector */}
          {projects.length > 0 && (
            <div className="mb-8 flex gap-2 flex-wrap">
              {projects.map((project) => (
                <button
                  key={project._id}
                  onClick={() => setSelectedProject(project._id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedProject === project._id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : deployments.length === 0 ? (
            <GlassCard className="text-center py-12">
              <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No deployments yet for this project</p>
            </GlassCard>
          ) : (
            <>
              {/* Timeline */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

                {/* Deployment Items */}
                <div className="space-y-4">
                  {deployments.map((deployment, index) => (
                    <div 
                      key={deployment._id}
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
                        onClick={() => setExpandedId(expandedId === deployment._id ? null : deployment._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg flex-shrink-0 ${
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
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold">{deployment.name}</span>
                                {deployment.environment && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                    {deployment.environment}
                                  </span>
                                )}
                              </div>
                              {deployment.message && (
                                <p className="text-sm text-muted-foreground mt-1 truncate">{deployment.message}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                            <div className="text-right">
                              {deployment.duration && (
                                <p className="text-sm font-medium">{deployment.duration}</p>
                              )}
                              <p className="text-xs text-muted-foreground">{timeAgo(deployment.createdAt)}</p>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                              expandedId === deployment._id ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedId === deployment._id && (
                          <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {deployment.commit && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Commit</p>
                                  <div className="flex items-center gap-2">
                                    <GitCommit className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-mono text-sm truncate">{deployment.commit}</span>
                                  </div>
                                </div>
                              )}
                              {deployment.author && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Author</p>
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">{deployment.author}</span>
                                  </div>
                                </div>
                              )}
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Deployments;
