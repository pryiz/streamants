# 🎮 Guide Streamer - Fourmilière Royale

## 🚀 Démarrage en 3 étapes

### 1. Lancer l'interface
```bash
./start-web.sh
```

### 2. Ouvrir le navigateur
🌐 **http://localhost:5173**

### 3. Configurer OBS
- Source : "Capture de navigateur"
- URL : `http://localhost:5173`
- Largeur : 1920, Hauteur : 1080

## 🎮 Contrôles de la Reine

### 🥚 Pondre (Créer des fourmis)
1. Cliquer sur "🥚 Pondre"
2. Choisir le type :
   - 🛠️ **Ouvrière** - Collecte de ressources
   - ⚔️ **Soldat** - Défense
   - 🔍 **Exploratrice** - Découverte
   - 💊 **Soigneuse** - Soins

### 📢 Ordre (Définir les priorités)
1. Cliquer sur "📢 Ordre"
2. Choisir la priorité :
   - 🍎 **Nourriture** - +50% gains nourriture
   - 🔨 **Construction** - +50% gains matériaux
   - 🛡️ **Défense** - +50% efficacité défense

### ⚡ Boost (Accélération)
- Cliquer sur "⚡ Boost"
- Effet : +25% vitesse pendant 30s
- Cooldown : 60s

## 💬 Commandes pour les viewers

### 📋 Universelles
- `!role` - Voir son rôle
- `!stats` - Voir les statistiques

### 🛠️ Ouvrière
- `!creuser` - Creuser des tunnels
- `!ramener` - Ramener des ressources (jour)
- `!construire` - Construire des défenses

### ⚔️ Soldat
- `!patrouiller` - Patrouiller
- `!attaquer` - Attaquer (nuit)

### 🔍 Exploratrice
- `!scouter` - Explorer (jour)
- `!signaler` - Signaler des ressources

### 💊 Soigneuse
- `!soigner` - Soigner la colonie
- `!nourrir` - Nourrir la colonie

## 📊 Interface Web

### HUD Principal (Haut-gauche)
- 🍎 Nourriture
- 🔨 Matériaux
- 👥 Population
- ❤️ Santé (barre)
- 🌅 Jour/Nuit + chronomètre

### Feed d'événements (Bas-gauche)
- 📰 Événements en temps réel
- 💬 Commandes des viewers
- 🎯 Actions de la Reine

### Liste des joueurs (Bas-droite)
- 👥 Joueurs actifs
- 🏷️ Rôles assignés
- ⏰ Dernière activité

### Visualisation 2D (Centre)
- 🏗️ Chambres de fourmilière
- 🐜 Fourmis animées
- 🚇 Tunnels
- 🎭 Effets visuels

## ⚙️ Configuration Twitch

### 1. Obtenir un token OAuth
- Aller sur https://twitchapps.com/tmi/
- Se connecter avec votre compte Twitch
- Copier le token généré

### 2. Configurer le fichier .env
```bash
TWITCH_USERNAME=votre_nom_utilisateur
TWITCH_OAUTH_TOKEN=oauth:votre_token
TWITCH_CHANNEL=nom_de_votre_chaine
```

### 3. Redémarrer l'application
```bash
./start-web.sh
```

## 🎯 Conseils de streaming

### 🎮 Engagement
- **Interagir** avec les contrôles de la Reine
- **Réagir** aux événements aléatoires
- **Commenter** les actions des viewers
- **Stratégiser** avec la communauté

### 📈 Croissance
- **Pondre** régulièrement pour augmenter la population
- **Utiliser** les ordres pour optimiser les gains
- **Booster** lors des moments critiques
- **Équilibrer** les rôles dans la colonie

### 🎨 Personnalisation
- **Modifier** les couleurs dans `client/index.html`
- **Ajouter** des assets personnalisés
- **Ajuster** les paramètres de jeu
- **Créer** des événements spéciaux

## 🐛 Dépannage rapide

### ❌ Interface ne se charge pas
```bash
# Vérifier les ports
curl http://localhost:5173/healthz

# Redémarrer
./start-web.sh
```

### ❌ WebSocket déconnecté
- Reconnexion automatique après 5s
- Vérifier le port 8080

### ❌ Commandes chat ne fonctionnent pas
- Vérifier la configuration Twitch dans `.env`
- Tester avec `npm run demo`

## 🎉 Avantages pour le streaming

✅ **Interface web** - Aucune installation requise  
✅ **Temps réel** - Mises à jour instantanées  
✅ **Interactif** - Engagement communautaire  
✅ **Visuel** - Graphiques 2D attrayants  
✅ **Flexible** - Personnalisable  
✅ **Stable** - Reconnexion automatique  

---

**🎮 Prêt à streamer ! Lancez `./start-web.sh` et ouvrez http://localhost:5173**
