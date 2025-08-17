import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recipients, setRecipients] = useState("");

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      toast.error("Please enter a transcript");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-summary", {
        body: {
          transcript: transcript.trim(),
          prompt: prompt.trim() || "Provide a clear and structured summary"
        }
      });

      if (error) throw error;

      setSummary(data.summary);
      toast.success("Summary generated successfully!");
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!summary.trim()) {
      toast.error("Please generate a summary first");
      return;
    }

    if (!recipients.trim()) {
      toast.error("Please enter recipient email addresses");
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-summary", {
        body: {
          summary: summary.trim(),
          recipients: recipients.split(",").map(email => email.trim()).filter(Boolean)
        }
      });

      if (error) throw error;

      toast.success("Summary sent successfully!");
      setRecipients("");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">AI Meeting Notes Summarizer</h1>
          <p className="text-xl text-muted-foreground">
            Transform your meeting transcripts into structured summaries and share them easily
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Input</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="transcript" className="text-sm font-medium">
                  Meeting Transcript *
                </Label>
                <Textarea
                  id="transcript"
                  placeholder="Paste your meeting transcript or call notes here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  rows={8}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="prompt" className="text-sm font-medium">
                  Custom Instructions (Optional)
                </Label>
                <Input
                  id="prompt"
                  placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button 
                onClick={handleGenerateSummary}
                disabled={isGenerating || !transcript.trim()}
                className="w-full"
              >
                {isGenerating ? "Generating Summary..." : "Generate Summary"}
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Summary</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="summary" className="text-sm font-medium">
                  Generated Summary (Editable)
                </Label>
                <Textarea
                  id="summary"
                  placeholder="Your AI-generated summary will appear here..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={10}
                  className="mt-2"
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="recipients" className="text-sm font-medium">
                  Email Recipients
                </Label>
                <Input
                  id="recipients"
                  placeholder="Enter email addresses separated by commas"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button 
                onClick={handleSendEmail}
                disabled={isSending || !summary.trim() || !recipients.trim()}
                className="w-full"
                variant="secondary"
              >
                {isSending ? "Sending Email..." : "Share via Email"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
