import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown, Mail, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">MessageCraft</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link to="/login">Se connecter</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Créer un compte</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            L'IA qui adapte vos messages à chaque plateforme
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Générez des messages personnalisés pour Slack, email, LinkedIn, SMS et plus encore. 
            Votre style, adapté au contexte parfait.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/app">Essayer gratuitement</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/register">Créer un compte</Link>
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 inline-block">
            <p className="text-sm font-medium">
              ✨ Essai gratuit : 10 générations sans compte requis
            </p>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Comment ça marche</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">1. Décrivez votre intention</h4>
              <p className="text-muted-foreground">
                "Email de démission", "Message LinkedIn au recruteur", "Rappel Slack"
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowDown className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">2. Choisissez la plateforme</h4>
              <p className="text-muted-foreground">
                Slack, Email, SMS, LinkedIn, Instagram, Blog...
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">3. Ajustez et copiez</h4>
              <p className="text-muted-foreground">
                Plus formel, plus court, plus amical... Le message parfait en un clic.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-12">Pourquoi MessageCraft ?</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">🎯 Adapté à chaque contexte</h4>
                  <p className="text-muted-foreground">
                    Chaque plateforme a ses codes. Notre IA adapte automatiquement le ton, 
                    la longueur et le style selon le contexte.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">🧠 Apprend votre style</h4>
                  <p className="text-muted-foreground">
                    Plus vous utilisez MessageCraft, plus l'IA comprend votre façon unique 
                    de communiquer.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">⚡ Rapide et efficace</h4>
                  <p className="text-muted-foreground">
                    Fini le syndrome de la page blanche. Générez des messages parfaits 
                    en quelques secondes.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">🔒 Sécurisé et privé</h4>
                  <p className="text-muted-foreground">
                    Vos données restent privées. Nous ne stockons pas vos messages 
                    personnels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">Prêt à transformer votre communication ?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Commencez dès maintenant avec 10 générations gratuites, sans inscription.
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <Link to="/app">Commencer maintenant</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">MessageCraft</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Confidentialité</a>
              <a href="#" className="hover:text-foreground">Conditions</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;