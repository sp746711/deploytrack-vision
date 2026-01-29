import { 
  Rocket, 
  Shield, 
  Activity, 
  Clock, 
  Bell, 
  GitBranch,
  Zap,
  LineChart
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const features = [
  {
    icon: Rocket,
    title: "Instant Deployments",
    description: "Deploy with confidence using our automated pipeline monitoring and instant rollback capabilities.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    title: "Incident Management",
    description: "Track, triage, and resolve incidents with severity-based prioritization and team notifications.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Activity,
    title: "Real-Time Metrics",
    description: "Monitor CPU, memory, and custom metrics with live updating dashboards and alerts.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Clock,
    title: "Deployment History",
    description: "Full audit trail of every deployment with commit hashes, timestamps, and rollback options.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified through Slack, Discord, or email when deployments fail or incidents occur.",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: GitBranch,
    title: "Branch Previews",
    description: "Automatically deploy preview environments for every pull request in your workflow.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Everything you need to{" "}
            <span className="gradient-text">ship with confidence</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From deployment automation to incident response, DeployTrack provides 
            the tools modern DevOps teams need.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <GlassCard
              key={feature.title}
              hover3D
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' } as React.CSSProperties}
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem value="99.99%" label="Uptime SLA" />
          <StatItem value="<50ms" label="Avg. Latency" />
          <StatItem value="10M+" label="Deployments Tracked" />
          <StatItem value="5,000+" label="Active Teams" />
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
