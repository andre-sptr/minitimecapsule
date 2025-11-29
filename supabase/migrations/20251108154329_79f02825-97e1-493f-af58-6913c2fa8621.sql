-- Create capsules table for storing time capsule messages
CREATE TABLE public.capsules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) <= 180),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  open_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'opened')),
  reflection TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.capsules ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own capsules" 
ON public.capsules 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own capsules" 
ON public.capsules 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own capsules" 
ON public.capsules 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own capsules" 
ON public.capsules 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_capsules_updated_at
BEFORE UPDATE ON public.capsules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_capsules_user_id ON public.capsules(user_id);
CREATE INDEX idx_capsules_open_date ON public.capsules(open_date);
CREATE INDEX idx_capsules_status ON public.capsules(status);