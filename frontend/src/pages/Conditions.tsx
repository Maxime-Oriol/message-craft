import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

const Conditions = () => {
  return (
    <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
        <Card>
            <CardHeader>
            <CardTitle>Conditions Générales d'Utilisation</CardTitle>
            <p className="text-sm text-muted-foreground">Dernière mise à jour : 3 juillet 2025</p>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-6">
            <section>
                <h2 className="font-semibold">1. Objet du service</h2>
                <p>
                MessageCraft permet de générer automatiquement des messages à partir d'une intention et d'une plateforme cible. Le service est proposé gratuitement et sans création de compte obligatoire.
                </p>
            </section>

            <section>
                <h2 className="font-semibold">2. Utilisation du service</h2>
                <ul className="list-disc list-inside">
                <li>Utilisation légale, respectueuse et non nuisible uniquement.</li>
                <li>L'utilisateur est seul responsable des messages générés.</li>
                <li>Tout usage malveillant ou illégal est strictement interdit.</li>
                </ul>
            </section>

            <section>
                <h2 className="font-semibold">3. Données et confidentialité</h2>
                <p>
                Aucun compte n'est requis pour la version actuelle. Un identifiant UUID est généré localement pour suivre les interactions. Les prompts et messages peuvent être enregistrés de manière anonyme pour améliorer le service. Aucune donnée personnelle n'est collectée sans consentement.
                </p>
            </section>

            <section>
                <h2 className="font-semibold">4. Propriété intellectuelle</h2>
                <p>
                L'application, son design et son code sont la propriété de leur auteur. Les textes générés sont libres d'utilisation pour l'utilisateur.
                </p>
            </section>

            <section>
                <h2 className="font-semibold">5. Responsabilité</h2>
                <p>
                MessageCraft est fourni "en l'état", sans garantie de performance ou de pertinence. L'auteur ne peut être tenu responsable des conséquences liées à l'utilisation des messages générés.
                </p>
            </section>

            <section>
                <p>
                Pour toute question, contactez-nous à : {" "}
                <a href="mailto:support@messagecraft.ai" className="text-primary hover:underline">
                    support@messagecraft.ai
                </a>
                </p>
                <p>
                <Link to="/" className="text-sm text-primary hover:underline">Retour à l'accueil</Link>
                </p>
            </section>
            </CardContent>
        </Card>
        </div>
        <Footer />
    </div>
  );
};

export default Conditions;