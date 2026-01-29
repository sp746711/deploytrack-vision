import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Activity,
  Clock,
  GitBranch,
  Server
} from "lucide-react";

const recentDeployments = [
  { id: 1, name: "v2.4.1", project: "api-gateway", status: "success", time: "2 min ago", commit: "a3f2b1c" },
  { id: 2, name: "v1.8.0", project: "auth-service", status: "success", time: "15 min ago", commit: "b4e2d1a" },
  { id: 3, name: "v3.0.0-beta", project: "dashboard-ui", status: "pending", time: "In progress", commit: "c5f3e2b" },
  { id: 4, name: "v2.3.9", project: "api-gateway", status: "failed", time: "1 hour ago", commit: "d6g4f3c" },
  { id: 5, name: "v1.7.9", project: "auth-service", status: "success", time: "2 hours ago", commit: "e7h5g4d" },
];

const activeIncidents = [
  { id: 1, title: "High CPU Usage - Production", severity: "warning", time: "10 min ago" },
  { id: 2, title: "Database Connection Timeout", severity: "critical", time: "25 min ago" },
];

const Dashboard = () => {
  return (
    <div className="dark min-h-screen">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your deployments and infrastructure in real-time.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Deployments"
              value="2,847"
              change="+12.5% from last month"
              changeType="positive"
              icon={Rocket}
              delay={0}
            />
            <StatCard
              title="Success Rate"
              value="99.2%"
              change="+0.8% from last week"
              changeType="positive"
              icon={CheckCircle}
              iconColor="text-success"
              delay={100}
            />
            <StatCard
              title="Failed Deployments"
              value="24"
              change="-5 from last week"
              changeType="positive"
              icon={XCircle}
              iconColor="text-destructive"
              delay={200}
            />
            <StatCard
              title="Active Incidents"
              value="2"
              change="2 critical pending"
              changeType="negative"
              icon={AlertTriangle}
              iconColor="text-warning"
              delay={300}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Deployments */}
            <GlassCard className="lg:col-span-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-primary" />
                  Recent Deployments
                </h2>
                <span className="text-sm text-muted-foreground">Last 24 hours</span>
              </div>
              <div className="space-y-3">
                {recentDeployments.map((deployment, index) => (
                  <div 
                    key={deployment.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      deployment.status === 'success' ? 'bg-success' :
                      deployment.status === 'pending' ? 'bg-warning animate-pulse' :
                      'bg-destructive'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{deployment.name}</span>
                        <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-muted">
                          {deployment.project}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{deployment.commit}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium capitalize ${
                        deployment.status === 'success' ? 'text-success' :
                        deployment.status === 'pending' ? 'text-warning' :
                        'text-destructive'
                      }`}>
                        {deployment.status}
                      </span>
                      <p className="text-xs text-muted-foreground">{deployment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Success Rate Ring */}
              <GlassCard className="opacity-0 animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Success Rate
                </h3>
                <div className="flex justify-center py-4">
                  <ProgressRing value={99.2} color="success" size={140} label="This Month" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">2,823</p>
                    <p className="text-xs text-muted-foreground">Successful</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-destructive">24</p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                </div>
              </GlassCard>

              {/* Active Incidents */}
              <GlassCard className="opacity-0 animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Active Incidents
                </h3>
                <div className="space-y-3">
                  {activeIncidents.map((incident) => (
                    <div 
                      key={incident.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                        incident.severity === 'critical' 
                          ? 'border-destructive/50 bg-destructive/10 hover:bg-destructive/20' 
                          : 'border-warning/50 bg-warning/10 hover:bg-warning/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{incident.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{incident.time}</p>
                        </div>
                        <span className={`text-xs font-medium uppercase px-2 py-1 rounded ${
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
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
