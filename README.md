# MessageCraft - Assistant IA de Communication

MessageCraft est une application web intelligente qui génère des messages personnalisés adaptés à différentes plateformes de communication (email, Slack, LinkedIn, SMS, etc.). L'IA analyse le style de communication de l'utilisateur pour créer des messages qui correspondent à sa personnalité et au contexte souhaité.

## 🏗️ Architecture de l'application

### Structure des pages

L'application est construite autour de 8 pages principales :

1. **Page d'accueil (`/`)** - Présentation de l'application et inscription
2. **Connexion (`/login`)** - Authentification des utilisateurs existants  
3. **Inscription (`/register`)** - Création de nouveaux comptes
4. **Mot de passe oublié (`/forgot-password`)** - Réinitialisation de mot de passe
5. **Interface principale (`/app`)** - Génération de messages IA
6. **Configuration du style (`/profile/setup`)** - Analyse du style de communication
7. **Profil utilisateur (`/profile`)** - Gestion du compte et historique
8. **Page d'erreur (`/error`)** - Gestion des erreurs système

### Navigation et flux utilisateur

```
/ (Landing) → /register → /profile/setup → /app
             ↓
           /login → /app
```

- **Visiteurs non-connectés** : Accès limité à 10 Crafts sur `/app`
- **Utilisateurs connectés** : 3 Crafts par jour + fonctionnalités avancées
- **Redirection automatique** : Après 10 Crafts → invitation à créer un compte

## ⚙️ Fonctionnement de l'application

### Génération de messages IA

1. **Saisie d'intention** : L'utilisateur décrit son besoin ("Email de démission", "Message LinkedIn")
2. **Sélection de plateforme** : Choix parmi 8 plateformes (Email, Slack, LinkedIn, SMS, etc.)
3. **Génération intelligente** : L'IA adapte le message au contexte et à la plateforme
4. **Variants ambigus** : Si l'intention est ambiguë, présentation de 2 options A/B
5. **Ajustements** : 6 boutons de modification (plus formel, plus court, plus amical, etc.)
6. **Copie et historique** : Sauvegarde automatique pour les utilisateurs connectés

### Personnalisation du style

Trois méthodes d'analyse du style de communication :

1. **Analyse de messages existants** : Copie de messages précédents pour extraction du style
2. **Sélection de préférences** : Configuration manuelle (formalité, longueur, ton)
3. **Quiz interactif** : 3 questions pour déterminer le style automatiquement

### Système de limitations

- **Invités** : 10 Crafts maximum (compteur localStorage)
- **Utilisateurs gratuits** : 3 Crafts/jour (reset quotidien)
- **Tracking d'usage** : Incrémentation automatique à chaque génération

## 📊 Jeu de données fictif

### Intentions types simulées

```javascript
const mockIntentions = [
  "Email de démission",
  "Message LinkedIn au recruteur", 
  "Rappel Slack équipe",
  "SMS rendez-vous médecin",
  "DM Instagram influenceur",
  "Tweet annonce produit",
  "Article de blog lancement",
  "Message WhatsApp famille"
];
```

### Plateformes supportées

```javascript
const platforms = [
  { value: "email", label: "Email", style: "formel, structuré" },
  { value: "slack", label: "Slack", style: "décontracté, emojis" },
  { value: "linkedin", label: "LinkedIn", style: "professionnel, networking" },
  { value: "sms", label: "SMS", style: "concis, familier" },
  { value: "instagram", label: "Instagram", style: "créatif, hashtags" },
  { value: "twitter", label: "Twitter/X", style: "bref, impactant" },
  { value: "blog", label: "Blog", style: "détaillé, storytelling" },
  { value: "whatsapp", label: "WhatsApp", style: "personnel, spontané" }
];
```

### Exemples de messages générés

**Email professionnel** :
```
Objet : Démission

Madame, Monsieur,

Je vous informe par la présente de ma décision de démissionner de mon poste de [votre poste] au sein de [nom de l'entreprise].

Ma dernière journée de travail sera le [date], respectant ainsi le préavis de [durée] requis par mon contrat.

Je vous remercie pour les opportunités de développement professionnel que vous m'avez offertes.

Cordialement,
[Votre nom]
```

**Message Slack** :
```
👋 Salut ! Petit rappel concernant [sujet]. Tu pourrais jeter un œil quand tu as un moment ? Merci ! 🙏
```

### Interactions utilisateur simulées

```javascript
const mockUserInteractions = [
  {
    intention: "Email démission",
    platform: "email", 
    generatedCount: 1,
    adjustments: ["plus_formel"],
    variantChosen: "A",
    copied: true,
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    intention: "Message recruteur", 
    platform: "linkedin",
    generatedCount: 2,
    adjustments: ["plus_court", "plus_amical"],
    copied: true,
    timestamp: "2024-01-14T15:45:00Z"
  }
];
```

### Profils utilisateur types

```javascript
const mockUserProfiles = [
  {
    id: "user_casual",
    style: {
      formality: "casual",
      length: "short", 
      tone: "friendly"
    },
    preferredPlatforms: ["slack", "sms", "whatsapp"],
    dailyUsage: 2.3
  },
  {
    id: "user_professional", 
    style: {
      formality: "professional",
      length: "medium",
      tone: "neutral"  
    },
    preferredPlatforms: ["email", "linkedin"],
    dailyUsage: 1.8
  }
];
```

## 🚀 Technologies utilisées

- **Frontend** : React 18, TypeScript, Vite
- **Styling** : Tailwind CSS, Shadcn/ui components  
- **Routing** : React Router v6
- **State Management** : React Context (authentification)
- **Notifications** : Toast notifications (sonner)
- **Icons** : Lucide React
- **Storage** : localStorage (données temporaires)

L'application est optimisée pour mobile-first avec un design moderne et épuré qui inspire confiance pour la gestion de communications professionnelles.