import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [pastedMessages, setPastedMessages] = useState("");
  const [formalityStyle, setFormalityStyle] = useState("");
  const [lengthStyle, setLengthStyle] = useState("");
  const [toneStyle, setToneStyle] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const quizQuestions = [
    {
      question: "Comment terminez-vous généralement vos emails professionnels ?",
      options: [
        { id: "formal", text: "Cordialement, [Nom]" },
        { id: "friendly", text: "Bonne journée, [Nom]" },
        { id: "casual", text: "À bientôt !" }
      ]
    },
    {
      question: "Quand vous demandez quelque chose, vous dites plutôt :",
      options: [
        { id: "formal", text: "Pourriez-vous avoir l'amabilité de..." },
        { id: "friendly", text: "Est-ce que tu pourrais..." },
        { id: "direct", text: "J'ai besoin que tu..." }
      ]
    },
    {
      question: "Votre style de communication est plutôt :",
      options: [
        { id: "detailed", text: "Détaillé avec du contexte" },
        { id: "concise", text: "Concis et direct" },
        { id: "balanced", text: "Équilibré entre les deux" }
      ]
    }
  ];

  const handleQuizAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answer;
    setQuizAnswers(newAnswers);
  };

  const completeSetup = async () => {
    // Simulate saving profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Profil configuré !",
      description: "Votre style de communication a été analysé. Vous pouvez maintenant générer des messages personnalisés.",
    });
    
    navigate("/app");
  };

  const setupMethods = [
    {
      id: "messages",
      title: "Analyser vos messages",
      description: "Collez quelques-uns de vos messages récents",
      icon: "📝"
    },
    {
      id: "style",
      title: "Définir votre style",
      description: "Choisissez vos préférences de communication",
      icon: "🎨"
    },
    {
      id: "quiz",
      title: "Quiz rapide",
      description: "Répondez à quelques questions",
      icon: "🎯"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MessageCraft</span>
          </Link>
          
          <Button variant="outline" asChild>
            <Link to="/app">Passer cette étape</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Configurons votre style</h1>
          <p className="text-muted-foreground">
            Plus nous comprenons votre façon de communiquer, plus les messages générés seront personnalisés.
          </p>
        </div>

        <Tabs defaultValue="style" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyser vos messages existants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="messages">
                    Collez 2-3 de vos messages récents (emails, Slack, etc.)
                  </Label>
                  <Textarea
                    id="messages"
                    placeholder="Collez vos messages ici... Nous analyserons votre style pour personnaliser les futures générations."
                    value={pastedMessages}
                    onChange={(e) => setPastedMessages(e.target.value)}
                    rows={8}
                  />
                </div>
                
                <Button 
                  onClick={completeSetup}
                  disabled={!pastedMessages.trim()}
                  className="w-full"
                >
                  Analyser et terminer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Définissez vos préférences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Niveau de formalité</Label>
                  <RadioGroup value={formalityStyle} onValueChange={setFormalityStyle}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="casual" id="casual" />
                      <Label htmlFor="casual">Décontracté (Hey, À+)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professional" id="professional" />
                      <Label htmlFor="professional">Professionnel (Bonjour, Cordialement)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="formal" id="formal" />
                      <Label htmlFor="formal">Formel (Madame/Monsieur, Respectueusement)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Longueur des messages</Label>
                  <RadioGroup value={lengthStyle} onValueChange={setLengthStyle}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="short" id="short" />
                      <Label htmlFor="short">Court et concis</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Équilibré</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="long" id="long" />
                      <Label htmlFor="long">Détaillé avec contexte</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Ton général</Label>
                  <RadioGroup value={toneStyle} onValueChange={setToneStyle}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="friendly" id="friendly" />
                      <Label htmlFor="friendly">Amical et chaleureux</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="neutral" id="neutral" />
                      <Label htmlFor="neutral">Neutre et professionnel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="direct" id="direct" />
                      <Label htmlFor="direct">Direct et efficace</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  onClick={completeSetup}
                  disabled={!formalityStyle || !lengthStyle || !toneStyle}
                  className="w-full"
                >
                  Enregistrer mes préférences
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz de style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {quizQuestions.map((question, index) => (
                  <div key={index} className="space-y-3">
                    <Label>{question.question}</Label>
                    <RadioGroup 
                      value={quizAnswers[index] || ""} 
                      onValueChange={(value) => handleQuizAnswer(index, value)}
                    >
                      {question.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`${index}-${option.id}`} />
                          <Label htmlFor={`${index}-${option.id}`}>{option.text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <Button 
                  onClick={completeSetup}
                  disabled={quizAnswers.length < quizQuestions.length}
                  className="w-full"
                >
                  Terminer le quiz
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileSetup;