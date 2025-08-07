# 🏠 Page d'Accueil - Fourmilière Royale

## ✅ Nouvelle interface avec page d'accueil

Votre projet **Fourmilière Royale** a maintenant une **page d'accueil complète** qui explique le jeu et permet de configurer la connexion Twitch !

## 🚀 Démarrage

```bash
./start-with-welcome.sh
```

Puis ouvrir **http://localhost:5173** dans le navigateur.

## 🏠 Page d'Accueil

### 📋 Éléments de la page d'accueil

1. **Titre principal** - "🐜 Fourmilière Royale 👑"
2. **Description du jeu** - Explication complète du fonctionnement
3. **Formulaire de configuration** - Champs pour configurer Twitch
4. **Boutons d'action** - Démarrer ou mode démonstration
5. **Liens d'aide** - Lien vers twitchapps.com/tmi/

### 🎮 Explication du jeu

La page d'accueil explique clairement :
- **Vous êtes la Reine** - Contrôlez la fourmilière depuis votre navigateur
- **Vos viewers sont des fourmis** - Ils utilisent des commandes chat
- **4 rôles disponibles** - Ouvrière, Soldat, Exploratrice, Soigneuse
- **Cycle jour/nuit** - 60 secondes par phase
- **Ressources à gérer** - Nourriture, Matériaux, Population, Santé

### ⚙️ Configuration Twitch

#### Champs du formulaire
- **📺 Nom de votre chaîne Twitch** - ex: votre_nom
- **👤 Votre nom d'utilisateur Twitch** - ex: votre_username
- **🔑 Token OAuth (optionnel)** - oauth:xxxx depuis twitchapps.com/tmi/

#### Options de démarrage
- **🚀 Démarrer la Fourmilière** - Avec configuration Twitch
- **🎭 Mode Démonstration** - Sans Twitch, pour tester

## 🌐 Interface de jeu

### 📱 Visualisation améliorée

Une fois le jeu démarré, vous verrez :
- **Titre animé** - "🏗️ Fourmilière Royale"
- **Sous-titre** - "Vos viewers sont des fourmis qui construisent ensemble !"
- **Instructions** - Commandes chat en bas d'écran
- **Chambres de fourmilière** - Visualisation 2D avec Phaser
- **Fourmis animées** - Mouvement et interactions
- **HUD complet** - Ressources, contrôles, événements

### 🎮 Contrôles de la Reine

- **🥚 Pondre** - Créer de nouvelles fourmis
- **📢 Ordre** - Définir les priorités
- **⚡ Boost** - Activer un boost temporaire

### 📊 HUD et informations

- **HUD Principal** (haut-gauche) : Ressources, santé, phase jour/nuit
- **Contrôles Reine** (haut-droite) : Boutons d'action
- **Feed d'événements** (bas-gauche) : Événements en temps réel
- **Liste des joueurs** (bas-droite) : Joueurs actifs

## 💬 Commandes Chat

### 📋 Universelles
- `!role` - Voir son rôle
- `!stats` - Voir les statistiques

### 🛠️ Ouvrière
- `!ramener` - Ramener des ressources (jour)
- `!construire` - Construire des défenses

### ⚔️ Soldat
- `!patrouiller` - Patrouiller
- `!attaquer` - Attaquer (nuit)

### 🔍 Exploratrice
- `!scouter` - Explorer (jour)

### 💊 Soigneuse
- `!soigner` - Soigner la colonie

## 🎯 Utilisation en streaming

### 1. Lancer l'interface
```bash
./start-with-welcome.sh
```

### 2. Ouvrir le navigateur
🌐 **http://localhost:5173**

### 3. Configurer Twitch
- Remplir le formulaire avec vos informations
- Ou cliquer sur "Mode Démonstration" pour tester

### 4. Démarrer le jeu
- Cliquer sur "🚀 Démarrer la Fourmilière"
- L'interface de jeu s'affiche

### 5. Configurer OBS
- Source : "Capture de navigateur"
- URL : `http://localhost:5173`
- Largeur : 1920, Hauteur : 1080

### 6. Streamer
- Interface visible aux viewers
- Contrôles de la Reine interactifs
- Événements en temps réel

## 🔧 Configuration

### Sauvegarde automatique
La configuration est automatiquement sauvegardée dans le navigateur et sera pré-remplie lors de la prochaine visite.

### Mode démonstration
Si vous n'avez pas de token OAuth, le jeu fonctionne en mode démonstration avec des événements simulés.

### Obtenir un token OAuth
1. Aller sur https://twitchapps.com/tmi/
2. Se connecter avec votre compte Twitch
3. Copier le token généré
4. Le coller dans le champ "Token OAuth"

## 🎨 Améliorations visuelles

### Page d'accueil
- **Design moderne** - Gradient et animations
- **Explication claire** - Comment le jeu fonctionne
- **Configuration simple** - Formulaire intuitif
- **Liens d'aide** - Direct vers twitchapps.com/tmi/

### Interface de jeu
- **Titre animé** - "🏗️ Fourmilière Royale"
- **Instructions** - Commandes chat visibles
- **Visualisation 2D** - Chambres et fourmis
- **HUD complet** - Toutes les informations

## 🎉 Avantages de la nouvelle interface

✅ **Page d'accueil** - Explication claire du jeu  
✅ **Configuration simple** - Formulaire intuitif  
✅ **Sauvegarde automatique** - Configuration mémorisée  
✅ **Mode démonstration** - Test sans Twitch  
✅ **Visualisation améliorée** - Titre et instructions  
✅ **Interface responsive** - S'adapte à toutes les tailles  
✅ **Liens d'aide** - Direct vers les ressources  

## 🎯 Prochaines étapes

1. **Lancer** : `./start-with-welcome.sh`
2. **Ouvrir** : http://localhost:5173
3. **Configurer** : Remplir le formulaire Twitch
4. **Démarrer** : Cliquer sur "🚀 Démarrer la Fourmilière"
5. **Streamer** : Interface visible aux viewers
6. **Interagir** : Contrôles de la Reine

---

**🎮 Votre page d'accueil est prête ! Lancez `./start-with-welcome.sh` et ouvrez http://localhost:5173**
