import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Plus, LogOut } from "lucide-react";
import { formatDistanceToNow, isPast } from "date-fns";
import { toast } from "sonner";

interface Capsule {
  id: string;
  message: string;
  created_at: string;
  open_date: string;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchCapsules();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const fetchCapsules = async () => {
    try {
      const { data, error } = await supabase
        .from("capsules")
        .select("*")
        .order("open_date", { ascending: true });

      if (error) throw error;
      setCapsules(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const isReady = (openDate: string) => {
    return isPast(new Date(openDate));
  };

  const getTimeUntil = (openDate: string) => {
    return formatDistanceToNow(new Date(openDate), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading your capsules...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">My Time Capsules</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Create New Button */}
        <Button
          onClick={() => navigate("/create")}
          className="w-full mb-8 rounded-xl py-6 text-lg shadow-soft-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Capsule
        </Button>

        {/* Capsules List */}
        <div className="space-y-4">
          {capsules.length === 0 ? (
            <Card className="shadow-soft-md">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  You haven't created any capsules yet.
                  <br />
                  <span className="text-sm">Start by creating your first message to your future self!</span>
                </p>
              </CardContent>
            </Card>
          ) : (
            capsules.map((capsule) => {
              const ready = isReady(capsule.open_date) && capsule.status === "locked";
              
              return (
                <Card
                  key={capsule.id}
                  className={cn(
                    "shadow-soft-md transition-all duration-300",
                    ready && "bg-capsule-ready shadow-soft-lg animate-pulse",
                    !ready && capsule.status === "locked" && "bg-capsule-locked opacity-80"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {capsule.status === "locked" && (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                          <p className="font-medium text-foreground">
                            {capsule.status === "opened"
                              ? "Opened capsule"
                              : ready
                              ? "Ready to open!"
                              : `Opens ${getTimeUntil(capsule.open_date)}`}
                          </p>
                        </div>
                        {capsule.status === "opened" && (
                          <p className="text-muted-foreground italic line-clamp-2">
                            {capsule.message}
                          </p>
                        )}
                      </div>
                      {ready && (
                        <Button
                          onClick={() => navigate(`/reveal/${capsule.id}`)}
                          className="rounded-xl"
                        >
                          Open Capsule
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

export default Dashboard;
