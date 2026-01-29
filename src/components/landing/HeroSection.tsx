import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap, Shield, Activity } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Hero Content */}
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in-down">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Real-Time Monitoring Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            Monitor. Detect.{" "}
            <span className="gradient-text">Deploy with Confidence.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            Track deployments, manage incidents, and gain real-time insights into your 
            infrastructure. Built for developers who demand precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            <Link to="/dashboard">
              <Button size="lg" className="btn-glow bg-primary hover:bg-primary/90 text-lg px-8 h-14 gap-2 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14 gap-2 border-border/50 hover:bg-muted/50">
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl opacity-50" />
            <GlassCard className="relative p-2 md:p-4">
              <div className="rounded-xl overflow-hidden bg-background/50">
                {/* Mock Dashboard */}
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <div className="w-3 h-3 rounded-full bg-warning" />
                      <div className="w-3 h-3 rounded-full bg-success" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Activity className="w-3 h-3 text-success" />
                      <span>Live</span>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatPreview label="Deployments" value="2,847" trend="+12%" />
                    <StatPreview label="Success Rate" value="99.9%" trend="+0.2%" />
                    <StatPreview label="Avg. Duration" value="2m 34s" trend="-8%" />
                    <StatPreview label="Active" value="12" trend="0" />
                  </div>

                  {/* Timeline Preview */}
                  <div className="space-y-2 pt-4">
                    <DeploymentRow status="success" name="v2.4.1 - Production" time="2 min ago" />
                    <DeploymentRow status="success" name="v2.4.0 - Staging" time="15 min ago" />
                    <DeploymentRow status="pending" name="v2.5.0-beta - Preview" time="In progress" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatPreview({ label, value, trend }: { label: string; value: string; trend: string }) {
  const isPositive = trend.startsWith('+');
  const isNegative = trend.startsWith('-');
  
  return (
    <div className="p-4 rounded-xl bg-muted/30">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      <p className={`text-xs ${isPositive ? 'text-success' : isNegative ? 'text-primary' : 'text-muted-foreground'}`}>
        {trend}
      </p>
    </div>
  );
}

function DeploymentRow({ status, name, time }: { status: 'success' | 'pending' | 'failed'; name: string; time: string }) {
  const statusColors = {
    success: 'bg-success',
    pending: 'bg-warning animate-pulse',
    failed: 'bg-destructive',
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
      <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
      <span className="text-sm font-medium flex-1">{name}</span>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}
