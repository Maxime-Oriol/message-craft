import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ArrowLeft, Plus, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const mockHistory = [
    {
      id: 1,
      intention: "Email de démission",
      platform: "Email",
      timestamp: "Il y a 2 heures",
      generated: "Objet : Démission\n\nMadame, Monsieur,\n\nJe vous informe par la présente de ma décision de démissionner...",
    },
    {
      id: 2,
      intention: "Message LinkedIn au recruteur",
      platform: "LinkedIn",
      timestamp: "Hier",
      generated: "Bonjour [Nom],\n\nJe suis très intéressé(e) par les opportunités dans votre entreprise...",
    },
    {
      id: 3,
      intention: "Rappel Slack",
      platform: "Slack",
      timestamp: "Il y a 3 jours",
      generated: "👋 Salut ! Petit rappel concernant le document. Tu pourrais jeter un œil quand tu as un moment ?",
    },
  ];

  const copyMessage = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/app" className="inline-flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold hidden sm:inline">MessageCraft</span>
          </Link>
          
          <Button variant="outline" size="sm" onClick={logout} className="text-sm">
            Se déconnecter
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Profile Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mon profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Générations aujourd'hui</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.generationsUsed >= user.maxGenerations ? "destructive" : "default"}>
                      {user.generationsUsed} / {user.maxGenerations}
                    </Badge>
                    {user.generationsUsed >= user.maxGenerations && (
                      <span className="text-sm text-muted-foreground">Revenez demain</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Style de communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.communicationStyle ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Formalité</p>
                      <Badge variant="outline">{user.communicationStyle.formality}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Longueur</p>
                      <Badge variant="outline">{user.communicationStyle.length}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ton</p>
                      <Badge variant="outline">{user.communicationStyle.tone}</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      Votre style n'est pas encore configuré
                    </p>
                    <Button asChild>
                      <Link to="/profile/setup">Configurer mon style</Link>
                    </Button>
                  </div>
                )}
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/profile/setup">Affiner mon style</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Premium</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Passez au premium</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    <li>• Générations illimitées</li>
                    <li>• Style avancé personnalisé</li>
                    <li>• Historique complet</li>
                    <li>• Support prioritaire</li>
                  </ul>
                  <Button className="w-full">
                    Passer au Premium - 9€/mois
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message History */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Historique des messages</CardTitle>
                  <Button size="sm" asChild>
                    <Link to="/app">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockHistory.map((item) => (
                    <Card key={item.id} className="border-muted">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-sm">{item.intention}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {item.platform}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {item.timestamp}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyMessage(item.generated)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.generated.split('\n')[0]}...
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;