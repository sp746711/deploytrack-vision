import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Rocket, Github, Mail, User, Lock } from "lucide-react";
import { useState } from "react";
import { signup } from "@/api/auth";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle signup form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !email.trim() || !password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Call signup API
      const response = await signup({ name, email, password });

      // Store JWT token in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast({
          title: "Account Created",
          description: "Welcome to DeployTrack! Redirecting to dashboard...",
        });

        // Redirect to dashboard after short delay
        setTimeout(() => navigate("/dashboard"), 500);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create account. Please try again.";
      toast({
        title: "Signup Failed",
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
          <h1 className="text-2xl font-bold mt-4">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Join DeployTrack and start monitoring your deployments
          </p>
        </div>

        <GlassCard className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <form className="space-y-6" onSubmit={handleSignup}>
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "name" ? "scale-[1.02]" : ""
                }`}
              >
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "email" ? "scale-[1.02]" : ""
                }`}
              >
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "password" ? "scale-[1.02]" : ""
                }`}
              >
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "confirmPassword" ? "scale-[1.02]" : ""
                }`}
              >
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full btn-glow bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
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

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </GlassCard>

        {/* Terms */}
        <p
          className="text-center text-xs text-muted-foreground mt-6 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          By signing up, you agree to our{" "}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>
          {" and "}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
