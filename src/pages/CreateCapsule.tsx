import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CreateCapsule = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [dateOption, setDateOption] = useState("");
  const [customDate, setCustomDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const getOpenDate = () => {
    if (dateOption === "custom" && customDate) {
      return customDate;
    }
    
    const now = new Date();
    switch (dateOption) {
      case "3days":
        return addDays(now, 3);
      case "1week":
        return addWeeks(now, 1);
      case "2weeks":
        return addWeeks(now, 2);
      case "1month":
        return addMonths(now, 1);
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.length > 180) {
      toast.error("Message must be 180 characters or less");
      return;
    }

    const openDate = getOpenDate();
    if (!openDate) {
      toast.error("Please select when to open your capsule");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to create a capsule");
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("capsules").insert({
        user_id: user.id,
        message: message.trim(),
        open_date: openDate.toISOString(),
      });

      if (error) throw error;

      toast.success("Your capsule is locked! 🔒");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="shadow-soft-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-serif text-center">
              Create Your Time Capsule
            </CardTitle>
            <CardDescription className="text-center">
              Write a message to your future self
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="message" className="text-lg">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="What would you like to tell your future self?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={180}
                  rows={6}
                  className="rounded-2xl resize-none"
                />
                <p className="text-sm text-muted-foreground text-right">
                  {message.length}/180 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-lg">Open Date</Label>
                <Select value={dateOption} onValueChange={setDateOption}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="When should this open?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3days">3 days from now</SelectItem>
                    <SelectItem value="1week">1 week from now</SelectItem>
                    <SelectItem value="2weeks">2 weeks from now</SelectItem>
                    <SelectItem value="1month">1 month from now</SelectItem>
                    <SelectItem value="custom">Pick a date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateOption === "custom" && (
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full rounded-xl justify-start text-left font-normal",
                          !customDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDate ? format(customDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={customDate}
                        onSelect={setCustomDate}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                        className="rounded-xl pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl py-6 text-lg"
                disabled={loading || !message.trim() || !dateOption}
              >
                {loading ? "Locking..." : "Lock Capsule ✧"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="w-full rounded-xl"
              >
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCapsule;
