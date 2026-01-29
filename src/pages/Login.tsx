import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Rocket, Github, Mail } from "lucide-react";
import { useState } from "react";
import { login } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email.trim() || !password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await login({ email, password });
      const payload = response?.data ?? {};
      const token = payload.token ?? response?.data?.token;
      const user = payload.user ?? response?.data?.user;

      if (token && user != null) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to dashboard...",
        });
        setTimeout(() => navigate("/dashboard"), 300);
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid response from server. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMessage =
        err?.response?.data?.message ?? err?.message ?? "Failed to login. Please check your credentials.";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center p-6">
      <AnimatedBackground />
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-down">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="p-3 rounded-xl bg-primary/10">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your DeployTrack account</p>
        </div>

        <GlassCard className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="bg-muted/50 border-border/50 focus:border-primary transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <Button 
              type="submit" 
              className="w-full btn-glow bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <Button 
              variant="outline" 
              className="w-full gap-2 border-border/50 hover:bg-muted/50"
              disabled={loading}
            >
              <Github className="w-4 h-4" />
              Continue with GitHub
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </GlassCard>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-foreground">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
