import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

const ContactPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [other, setOther] = useState(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Sujet : ${topic}\nEmail : ${email}\nMessage : ${message}`);
    setEmail("");
    setOther(null);
    setMessage("");
    setTopic("");
  };

  const onTopicChanged = (value) => {
    setTopic(value);
    if (value != "other") {
        setOther(null);
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
              <SelectTrigger className="h-12">
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
                    onChange={(e) => onTopicChanged(e.target.value)}
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

          <Button type="submit" className="w-full h-12 text-base">
            Envoyer
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;