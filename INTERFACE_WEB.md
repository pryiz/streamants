# 🌐 Interface Web - Fourmilière Royale

## 🎮 Interface Streamer dans le Navigateur

Le projet Fourmilière Royale est conçu comme une **application web complète** que le streamer peut utiliser directement dans son navigateur.

### 🚀 Démarrage rapide

```bash
# Méthode simple
./start-web.sh

# Ou manuellement
npm run dev
```

Puis ouvrir **http://localhost:5173** dans votre navigateur.

### 🖥️ Interface Web Complète

#### 📱 Éléments de l'interface

1. **HUD Principal** (en haut à gauche)
   - 🍎 Nourriture
   - 🔨 Matériaux  
   - 👥 Population
   - ❤️ Santé (avec barre de progression)
   - 🌅 Phase jour/nuit avec chronomètre

2. **Contrôles de la Reine** (en haut à droite)
   - 🥚 **Pondre** - Créer de nouvelles fourmis
   - 📢 **Ordre** - Définir les priorités
   - ⚡ **Boost** - Activer un boost temporaire

3. **Feed d'événements** (en bas à gauche)
   - 📰 Événements récents en temps réel
   - 💬 Commandes des viewers
   - 🎯 Actions de la Reine
   - 🌟 Événements aléatoires

4. **Liste des joueurs** (en bas à droite)
   - 👥 Joueurs actifs
   - 🏷️ Rôles assignés
   - ⏰ Dernière activité

5. **Visualisation 2D** (centre)
   - 🏗️ Chambres de la fourmilière
   - 🐜 Fourmis animées
   - 🚇 Tunnels entre les chambres
   - 🎭 Effets visuels pour les événements

### 🎮 Contrôles de la Reine

#### 🥚 Pondre
- Cliquer sur "Pondre" → Menu déroulant
- Choisir le type de fourmi :
  - 🛠️ **Ouvrière** - Collecte et construction
  - ⚔️ **Soldat** - Défense et patrouille
  - 🔍 **Exploratrice** - Découverte de ressources
  - 💊 **Soigneuse** - Soins et nourriture

#### 📢 Ordre
- Cliquer sur "Ordre" → Menu déroulant
- Définir la priorité :
  - 🍎 **Nourriture** - +50% gains de nourriture
  - 🔨 **Construction** - +50% gains de matériaux
  - 🛡️ **Défense** - +50% efficacité défensive

#### ⚡ Boost
- Cliquer sur "Boost" → Activation immédiate
- Effet : +25% vitesse globale pendant 30 secondes
- Cooldown : 60 secondes

### 💬 Commandes Chat (pour les viewers)

Les viewers peuvent utiliser ces commandes dans le chat Twitch :

#### 📋 Universelles
- `!role` - Voir son rôle actuel
- `!stats` - Voir les statistiques de la fourmilière

#### 🛠️ Ouvrière
- `!creuser` - Creuser de nouveaux tunnels
- `!ramener` - Ramener des ressources (jour uniquement)
- `!construire` - Construire des défenses

#### ⚔️ Soldat
- `!patrouiller` - Patrouiller pour détecter les menaces
- `!attaquer` - Attaquer les ennemis (nuit uniquement)

#### 🔍 Exploratrice
- `!scouter` - Explorer de nouvelles zones (jour uniquement)
- `!signaler` - Signaler des ressources

#### 💊 Soigneuse
- `!soigner` - Soigner la colonie
- `!nourrir` - Nourrir la colonie

### 🌟 Fonctionnalités Web

#### 🔄 Temps réel
- **WebSocket** pour les mises à jour instantanées
- **Reconnexion automatique** en cas de déconnexion
- **Synchronisation** entre tous les clients

#### 🎨 Interface responsive
- **Adaptatif** à toutes les tailles d'écran
- **Thème sombre** optimisé pour le streaming
- **Animations fluides** et effets visuels

#### 📊 Monitoring
- **Dashboard** accessible sur `/healthz`
- **Logs** en temps réel
- **Métriques** de performance

### 🔧 Configuration

#### Variables d'environnement (.env)
```bash
# Configuration Twitch (optionnel pour la démo)
TWITCH_USERNAME=your_twitch_username
TWITCH_OAUTH_TOKEN=oauth:your_oauth_token
TWITCH_CHANNEL=your_channel_name

# Configuration serveur
PORT=5173          # Port de l'interface web
WS_PORT=8080       # Port WebSocket
```

#### Mode démonstration (sans Twitch)
```bash
npm run demo
```

### 🎯 Utilisation en streaming

1. **Lancer l'interface** : `./start-web.sh`
2. **Ouvrir le navigateur** : http://localhost:5173
3. **Configurer OBS** :
   - Source : "Capture de navigateur"
   - URL : http://localhost:5173
   - Largeur : 1920, Hauteur : 1080
4. **Partager l'écran** ou utiliser la capture de navigateur
5. **Interagir** avec les contrôles de la Reine

### 🎨 Personnalisation

#### Couleurs et thème
- Modifier `client/index.html` pour changer les couleurs
- Ajuster `client/src/game/AntColonyScene.ts` pour les assets
- Personnaliser `client/src/ui/hud.ts` pour l'interface

#### Assets visuels
- Remplacer les placeholders par de vrais sprites
- Ajouter des animations personnalisées
- Intégrer des effets sonores

### 🐛 Dépannage

#### Problèmes courants
- **Port occupé** : Changer le port dans `.env`
- **WebSocket déconnecté** : Reconnexion automatique
- **Interface lente** : Vérifier les ressources système

#### Logs utiles
```bash
# Vérifier l'état
curl http://localhost:5173/healthz

# Voir les logs
curl http://localhost:5173/logs

# Tester l'API
curl -X POST http://localhost:5173/queen/action \
  -H "Content-Type: application/json" \
  -d '{"type":"boost","data":{}}'
```

### 🎉 Avantages de l'interface web

✅ **Accessible partout** - Fonctionne sur tous les navigateurs  
✅ **Pas d'installation** - Aucun logiciel à installer  
✅ **Mise à jour facile** - Refresh de la page  
✅ **Multi-plateforme** - Windows, Mac, Linux  
✅ **Intégration OBS** - Capture de navigateur native  
✅ **Responsive** - S'adapte à toutes les tailles d'écran  
✅ **Temps réel** - WebSocket pour les mises à jour instantanées  

---

**🎮 Prêt pour le streaming interactif ! Ouvrez http://localhost:5173 et commencez à jouer !**
