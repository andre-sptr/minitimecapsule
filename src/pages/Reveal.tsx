import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Capsule {
  id: string;
  message: string;
  created_at: string;
  open_date: string;
  status: string;
  reflection: string | null;
}

const reflectionOptions = [
  "This helps.",
  "I needed this today.",
  "This made me smile.",
  "Proud of past me.",
];

const Reveal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    fetchCapsule();
  }, [id]);

  const fetchCapsule = async () => {
    try {
      const { data, error } = await supabase
        .from("capsules")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      if (!data) {
        toast.error("Capsule not found");
        navigate("/dashboard");
        return;
      }

      setCapsule(data);
      
      // Show reveal animation
      setTimeout(() => setRevealed(true), 300);
    } catch (error: any) {
      toast.error(error.message);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleReflection = async (reflection: string) => {
    if (!capsule) return;

    try {
      const { error } = await supabase
        .from("capsules")
        .update({
          status: "opened",
          reflection,
        })
        .eq("id", capsule.id);

      if (error) throw error;

      toast.success("Reflection saved ✨");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading || !capsule) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Opening your capsule...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className={`space-y-8 transition-all duration-700 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-capsule-glow/20 rounded-full animate-pulse">
                <Sparkles className="w-12 h-12 text-capsule-glow" />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold">
              Your Capsule is Open
            </h1>
            <p className="text-muted-foreground">
              A message from your past self
            </p>
          </div>

          {/* Message Card */}
          <Card className="shadow-soft-lg bg-capsule-ready/30 backdrop-blur">
            <CardContent className="p-8">
              <p className="text-xl leading-relaxed text-center font-serif">
                "{capsule.message}"
              </p>
            </CardContent>
          </Card>

          {/* Reflection Section */}
          {capsule.status === "locked" && (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                How does this make you feel?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reflectionOptions.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    onClick={() => handleReflection(option)}
                    className="rounded-full py-6 text-base hover:bg-primary/10 transition-all"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => navigate("/create")}
              className="w-full rounded-xl py-6"
            >
              Create Another Capsule
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="w-full rounded-xl"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reveal;
