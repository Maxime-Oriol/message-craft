import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const Error = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MessageCraft</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😔</span>
            </div>
            <CardTitle>Oups ! Une erreur s'est produite</CardTitle>
            <CardDescription>
              Nous sommes désolés, quelque chose ne s'est pas passé comme prévu. 
              Notre équipe a été automatiquement notifiée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser la page
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à l'accueil
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Si le problème persiste, contactez-nous à{" "}
                <a 
                  href="mailto:support@messagecraft.ai" 
                  className="text-primary hover:underline"
                >
                  support@messagecraft.ai
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Error;