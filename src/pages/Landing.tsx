import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Calendar, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Mini Time Capsule Logo" className="w-24 h-24" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight">
              Send a message to
              <br />
              <span className="text-primary">your future self</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Lock it today, open it when the time is right.
              <br />A warm space for reflection and gentle reminders.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="rounded-full px-8 py-6 text-lg shadow-soft-lg hover:shadow-soft-md transition-all"
            >
              Create My Capsule ✧
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 pt-16 text-left">
            <div className="space-y-3 p-6 rounded-2xl bg-card shadow-soft hover:shadow-soft-md transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-xl">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your messages are locked away safely until you're ready to read them.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-2xl bg-card shadow-soft hover:shadow-soft-md transition-all">
              <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-xl">Choose Your Date</h3>
              <p className="text-muted-foreground">
                Set your message to unlock in days, weeks, or pick any future date.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-2xl bg-card shadow-soft hover:shadow-soft-md transition-all">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-serif font-semibold text-xl">Gentle Reminders</h3>
              <p className="text-muted-foreground">
                Reflect on your journey and be proud of your growth over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
