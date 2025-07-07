import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { generateClientToken } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth"

const ContactPage = () => {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [other, setOther] = useState("");
  const [message, setMessage] = useState("");
  const { user, register } = useAuth();
  const [isSending, setIsSending] = useState(false);
  
  const cleanForm = () => {
    setEmail("");
    setOther("");
    setMessage("");
    setTopic("");   
  };

  if (!user || user.id == null) {
    register("guest@user.com", "tmp", "tmp")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      userId: user.id,
      email,
      topic,
      other: other === "" ? null : other,
      message
    }
    setIsSending(true)
    const response = await fetch("http://127.0.0.1:4000/api/contact", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "X-Craft-Auth": generateClientToken()
      },
      body: JSON.stringify(payload)
    });
    let result = null;
    try {
      result = await response.json(); // essaye de parser le corps, même s’il y a une erreur serveur
    } catch (jsonError) {
      console.warn("Impossible de parser le corps JSON :", jsonError);
    } finally {
      setIsSending(false)
    }

    if (response.ok) {
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
        variant: "success"
      });
      cleanForm();
    } else {
      toast({
        title: result.title || "Errur",
        description: result.error || "Une erreur est survenue, veuillez réessayer plus tard",
        variant: result.critical ? "destructive" : "success"
      });
      
      console.error("Erreur API :", response.status, result.error);
      throw new Error(`Erreur serveur : ${response.status}`);
    }
  
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Contact</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="email">Votre email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="topic">Sujet</Label>
            <Select value={topic} onValueChange={setTopic} required>
              <SelectTrigger className="h-12" tabIndex={0}>
                <SelectValue placeholder="Choisissez un sujet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Signaler un bug</SelectItem>
                <SelectItem value="feature">Suggérer une amélioration</SelectItem>
                <SelectItem value="support">Demande de support</SelectItem>
                <SelectItem value="partner">Demande de partenariat</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
            {topic === "other" &&
                <Input
                    id="topic_other"
                    type="text"
                    placeholder="Précisez..."
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                />
            }
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Votre message</Label>
            <Textarea
              id="message"
              placeholder="Décrivez votre demande..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base"
            disabled={isSending}>
            Envoyer
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;