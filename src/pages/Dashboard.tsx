import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Activity,
  GitBranch,
  Server,
  Plus,
  Loader,
  ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { getProjects, createProject } from "@/api/projects";
import { getDeployments } from "@/api/deployments";
import { getIncidents } from "@/api/incidents";
import { getCurrentUser } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

interface Project {
  _id: string;
  name: string;
  description?: string;
  owner?: string;
  createdAt?: string;
  deployments?: number;
  status?: string;
}

interface Deployment {
  _id: string;
  name: string;
  project?: string;
  status: "success" | "pending" | "failed";
  createdAt: string;
  commit?: string;
}

interface Incident {
  _id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  createdAt: string;
}

const Dashboard = () => {
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const { toast } = useToast();

  // Fetch user data from localStorage
  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
  }, []);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch projects
        const projectsRes = await getProjects();
        setProjects(projectsRes.data);

        // Fetch incidents
        const incidentsRes = await getIncidents();
        setIncidents(Array.isArray(incidentsRes.data) ? incidentsRes.data : []);

        // If projects exist, fetch deployments for the first project
        if (projectsRes.data.length > 0) {
          try {
            const deploymentsRes = await getDeployments(projectsRes.data[0]._id);
            setDeployments(Array.isArray(deploymentsRes.data) ? deploymentsRes.data : []);
          } catch (error) {
            // Deployments might not exist yet, that's ok
            setDeployments([]);
          }
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch dashboard data";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle creating a new project
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Missing Field",
        description: "Please enter a project name.",
        variant: "destructive",
      });
      return;
    }

    setCreatingProject(true);

    try {
      const response = await createProject({
        name: newProjectName,
        description: newProjectDesc,
      });

      setProjects([...projects, response.data]);

      toast({
        title: "Project Created",
        description: `${newProjectName} has been created successfully.`,
      });

      // Reset form
      setNewProjectName("");
      setNewProjectDesc("");
      setShowCreateModal(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create project";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setCreatingProject(false);
    }
  };

  // Calculate stats from fetched data
  const stats = {
    totalDeployments: deployments.length,
    successRate: deployments.length > 0 
      ? ((deployments.filter(d => d.status === "success").length / deployments.length) * 100).toFixed(1)
      : 0,
    failedDeployments: deployments.filter(d => d.status === "failed").length,
    activeIncidents: incidents.length,
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
        <div className="container mx-auto max-w-7xl">
          {/* Header with User Info */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name?.split(" ")[0] || "User"}
              </h1>
              <p className="text-muted-foreground">
                Monitor your {projects.length} project{projects.length !== 1 ? "s" : ""} and infrastructure in real-time.
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Deployments"
                  value={stats.totalDeployments.toString()}
                  change={deployments.length > 0 ? "Latest deployments tracked" : "No deployments yet"}
                  changeType={deployments.length > 0 ? "positive" : "neutral"}
                  icon={Rocket}
                  delay={0}
                />
                <StatCard
                  title="Success Rate"
                  value={`${stats.successRate}%`}
                  change={deployments.length > 0 ? "This period" : "N/A"}
                  changeType={parseFloat(stats.successRate as string) > 95 ? "positive" : "negative"}
                  icon={CheckCircle}
                  iconColor="text-success"
                  delay={100}
                />
                <StatCard
                  title="Failed Deployments"
                  value={stats.failedDeployments.toString()}
                  change={stats.failedDeployments === 0 ? "All systems running" : "Needs attention"}
                  changeType={stats.failedDeployments === 0 ? "positive" : "negative"}
                  icon={XCircle}
                  iconColor="text-destructive"
                  delay={200}
                />
                <StatCard
                  title="Active Incidents"
                  value={stats.activeIncidents.toString()}
                  change={stats.activeIncidents === 0 ? "No issues" : "Pending review"}
                  changeType={stats.activeIncidents === 0 ? "positive" : "negative"}
                  icon={AlertTriangle}
                  iconColor="text-warning"
                  delay={300}
                />
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Projects List */}
                <GlassCard className="lg:col-span-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Server className="w-5 h-5 text-primary" />
                      Your Projects
                    </h2>
                    <span className="text-sm text-muted-foreground">{projects.length} total</span>
                  </div>

                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <Server className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground mb-4">No projects yet</p>
                      <Button 
                        onClick={() => setShowCreateModal(true)} 
                        variant="outline"
                        size="sm"
                      >
                        Create your first project
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.slice(0, 5).map((project) => (
                        <div 
                          key={project._id}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{project.name}</span>
                              {project.status && (
                                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
                                  {project.status}
                                </span>
                              )}
                            </div>
                            {project.description && (
                              <span className="text-xs text-muted-foreground">{project.description}</span>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Success Rate Ring */}
                  <GlassCard className="opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      Deployment Health
                    </h3>
                    <div className="flex justify-center py-4">
                      <ProgressRing 
                        value={parseFloat(stats.successRate as string)} 
                        color="success" 
                        size={140} 
                        label="Success Rate" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success">
                          {deployments.filter(d => d.status === "success").length}
                        </p>
                        <p className="text-xs text-muted-foreground">Successful</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-destructive">
                          {stats.failedDeployments}
                        </p>
                        <p className="text-xs text-muted-foreground">Failed</p>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Recent Deployments */}
                  <GlassCard className="opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-primary" />
                      Recent Deployments
                    </h3>
                    {deployments.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No deployments yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {deployments.slice(0, 3).map((deployment) => (
                          <div 
                            key={deployment._id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              deployment.status === 'success' ? 'bg-success' :
                              deployment.status === 'pending' ? 'bg-warning animate-pulse' :
                              'bg-destructive'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{deployment.name}</p>
                              <p className="text-xs text-muted-foreground">{timeAgo(deployment.createdAt)}</p>
                            </div>
                            <span className={`text-xs font-medium capitalize ${
                              deployment.status === 'success' ? 'text-success' :
                              deployment.status === 'pending' ? 'text-warning' :
                              'text-destructive'
                            }`}>
                              {deployment.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>

                  {/* Active Incidents */}
                  <GlassCard className="opacity-0 animate-fade-in-up" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      Active Incidents
                    </h3>
                    {incidents.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        All systems operational
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {incidents.slice(0, 3).map((incident) => (
                          <div 
                            key={incident._id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              incident.severity === 'critical' 
                                ? 'border-destructive/50 bg-destructive/10 hover:bg-destructive/20' 
                                : 'border-warning/50 bg-warning/10 hover:bg-warning/20'
                            }`}
                          >
                            <p className="font-medium text-sm">{incident.title}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground">{timeAgo(incident.createdAt)}</p>
                              <span className={`text-xs font-medium uppercase px-2 py-0.5 rounded ${
                                incident.severity === 'critical' 
                                  ? 'bg-destructive/20 text-destructive' 
                                  : 'bg-warning/20 text-warning'
                              }`}>
                                {incident.severity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create New Project</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name *</label>
                <Input
                  placeholder="my-awesome-project"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  disabled={creatingProject}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  placeholder="Brief description of your project"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  disabled={creatingProject}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewProjectName("");
                    setNewProjectDesc("");
                  }}
                  disabled={creatingProject}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleCreateProject}
                  disabled={creatingProject}
                >
                  {creatingProject ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
