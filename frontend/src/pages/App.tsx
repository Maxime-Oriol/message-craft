import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Copy, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { generateClientToken } from "@/lib/utils"

const platforms = [
  { value: "email", label: "Email" },
  { value: "corporate", label: "Slack - Teams" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter/ X" },
  { value: "blog", label: "Article de blog" },
  { value: "sms", label: "Whatsapp - SMS - Line - Telegram..." },
];

const adjustments = [
  { id: "formal", label: "Plus formel" },
  { id: "casual", label: "Plus décontracté" },
  { id: "shorter", label: "Plus court" },
  { id: "longer", label: "Plus long" },
  { id: "friendly", label: "Plus amical" },
  { id: "direct", label: "Plus direct" },
];

interface GeneratedMessage {
  content: string;
  platform: string;
  adjustments: string[];
}

const AppPage = () => {
  const [intention, setIntention] = useState("");
  const [platform, setPlatform] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState<GeneratedMessage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [variantA, setVariantA] = useState("");
  const [variantB, setVariantB] = useState("");
  
  const { user, isGuest, guestGenerationsUsed, canGenerate, register } = useAuth();
  const { toast } = useToast();

  if (!user || user.id == null) {
    register("guest@user.com", "tmp", "tmp")
  }

  const getGenerationsLeft = () => {
    if (user) {
      return user.maxGenerations - user.generationsUsed;
    }
    return 10 - guestGenerationsUsed;
  };

  const generateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowVariants(false);
    
    const payload = {
      user_id:user.id,
      platform,
      intent: intention,
      adjustments
    }

    const response = await fetch("http://127.0.0.1:4000/api/message", {
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
    }

    if (!response.ok) {
      setShowVariants(false);
      setIsGenerating(false)
      setGeneratedMessage({
      content: null,
      platform,
      adjustments: []
      })
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la rédaction du craft",
        variant: "destructive"
      });
    }

    setGeneratedMessage({
      
      content: result.message,
      platform,
      adjustments: []
    });
    /*
    if (intentionLower.includes("professionnel") && platform === "email") {
      setVariantA(message);
      setVariantB(message.replace("Madame, Monsieur,", "Bonjour,").replace("Cordialement,", "Bonne journée,"));
      setShowVariants(true);
    } else {
      setGeneratedMessage({
        content: message,
        platform,
        adjustments: []
      });
    }
    */
    setIsGenerating(false);
  };

  const selectVariant = (variant: 'A' | 'B') => {
    const selectedMessage = variant === 'A' ? variantA : variantB;
    setGeneratedMessage({
      content: selectedMessage,
      platform,
      adjustments: []
    });
    setShowVariants(false);
  };

  const adjustMessage = async (adjustmentId: string) => {
    if (!generatedMessage) return;

    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    let adjustedContent = generatedMessage.content;
    
    switch (adjustmentId) {
      case "formal":
        adjustedContent = adjustedContent
          .replace(/Salut|Hey/g, "Bonjour")
          .replace(/👋|🙏|✅/g, "");
        break;
      case "casual":
        adjustedContent = adjustedContent
          .replace("Madame, Monsieur,", "Salut,")
          .replace("Cordialement,", "À bientôt,");
        break;
      case "shorter":
        adjustedContent = adjustedContent.split('\n').slice(0, 3).join('\n');
        break;
      case "longer":
        adjustedContent += "\n\nJ'espère que ce message vous trouve en bonne santé. N'hésitez pas à me contacter si vous avez des questions.";
        break;
      case "friendly":
        adjustedContent = adjustedContent + " 😊";
        break;
      case "direct":
        adjustedContent = adjustedContent.replace(/J'aimerais|Seriez-vous/g, "Je veux").replace(/s'il vous plaît/g, "");
        break;
    }

    setGeneratedMessage({
      ...generatedMessage,
      content: adjustedContent,
      adjustments: [...generatedMessage.adjustments, adjustmentId]
    });
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    if (generatedMessage) {
      await navigator.clipboard.writeText(generatedMessage.content);
      toast({
        title: "Copié !",
        description: "Le message a été copié dans votre presse-papiers",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Générer un message</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="platform">Plateforme cible</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Choisissez une plateforme" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {platforms.map((p) => (
                      <SelectItem key={p.value} value={p.value} className="text-base py-3">
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intention">Décrivez votre intention</Label>
                <p className="text-sm text-muted-foreground">
                  Plus votre intention est détaillée, plus la rédaction sera précise et correspondra à votre besoin.
                </p>
                <Textarea
                  id="intention"
                  placeholder="Explique moi ce que je dois rédiger..."
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  rows={3}
                  className="min-h-[80px] text-base"
                />
              </div>


              <Button 
                onClick={generateMessage}
                disabled={!intention || !platform || isGenerating || !canGenerate()}
                className="w-full h-12 text-base"
              >
                {isGenerating ? "Génération..." : "Générer le message"}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Message généré</CardTitle>
            </CardHeader>
            <CardContent>
              {showVariants ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Quelle version préférez-vous ?
                  </p>
                  
                  <div className="space-y-3">
                    <Card className="cursor-pointer hover:ring-2 hover:ring-primary transition-all" onClick={() => selectVariant('A')}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge>Version A</Badge>
                          <Button size="sm" variant="outline" className="text-xs">Choisir</Button>
                        </div>
                        <p className="text-xs sm:text-sm whitespace-pre-wrap">{variantA}</p>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:ring-2 hover:ring-primary transition-all" onClick={() => selectVariant('B')}>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex justify-between items-start mb-2">
                          <Badge>Version B</Badge>
                          <Button size="sm" variant="outline" className="text-xs">Choisir</Button>
                        </div>
                        <p className="text-xs sm:text-sm whitespace-pre-wrap">{variantB}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : generatedMessage ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
                    <p className="whitespace-pre-wrap text-sm sm:text-base">{generatedMessage.content}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {adjustments.map((adj) => (
                      <Button
                        key={adj.id}
                        variant="outline"
                        size="sm"
                        onClick={() => adjustMessage(adj.id)}
                        disabled={isGenerating || generatedMessage.adjustments.includes(adj.id)}
                        className="text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                      >
                        {adj.label}
                      </Button>
                    ))}
                  </div>

                  <Button onClick={copyToClipboard} className="w-full h-12 text-base">
                    <Copy className="w-4 h-4 mr-2" />
                    Copier le message
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Votre message généré apparaîtra ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Card className="w-full">
              <CardHeader>
                <CardTitle>Exemples de prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium">Cas d'usage avancés :</p>
                  <ul className="space-y-1">
                    <li
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        setIntention("Proposer un rendez-vous à Camille dans nos locaux\n- Lundi 10h\n- Mercredi 16h\n- Vendredi 12h30 pour déjeuner");
                        setPlatform("email");
                      }}
                    >
                      📅 Proposer un rendez-vous selon 3 créneaux par e-mail
                    </li>
                    <li
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        setIntention("Demander à David où en est la validation du budget prévisionnel 2025");
                        setPlatform("slack");
                      }}
                    >
                      💬 Relancer un collègue sur Slack pour une tâche en cours
                    </li>
                    <li
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        setIntention("Envoyer une mise à jour aux clients sur les nouvelles fonctionnalités du produit lancées ce mois-ci");
                        setPlatform("linkedin");
                      }}
                    >
                      📣 Partager une mise à jour produit sur LinkedIn
                    </li>
                    <li
                      className="cursor-pointer hover:underline"
                      onClick={() => {
                        setIntention("Rédige un mail de résiliation pour la salle de sport Neoness");
                        setPlatform("email");
                      }}
                    >
                      ❌ Email de résiliation salle de sport
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppPage;