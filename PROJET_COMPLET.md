# 🐜 Fourmilière Royale - Projet Complet

## 📁 Structure du projet

```
fourmiliere-royale/
├── 📄 package.json                 # Scripts et dépendances principales
├── 📄 env.example                  # Variables d'environnement d'exemple
├── 📄 .env                        # Configuration (à créer)
├── 📄 .gitignore                  # Fichiers à ignorer
├── 📄 README.md                   # Documentation complète
├── 📄 install.sh                  # Script d'installation automatique
├── 📄 check-version.js            # Vérification de version Node.js
├── 📄 demo.js                     # Mode démonstration
├── 📄 test-config.js              # Configuration de test
├── 📄 PROJET_COMPLET.md           # Ce fichier
│
├── 📁 server/                     # Backend Node.js
│   ├── 📄 tsconfig.json           # Configuration TypeScript serveur
│   ├── 📄 server.ts               # Serveur principal
│   ├── 📄 state.ts                # Gestion d'état du jeu
│   ├── 📄 commands.ts             # Traitement des commandes Twitch
│   ├── 📄 ws.ts                   # Serveur WebSocket
│   └── 📄 types.ts                # Types TypeScript serveur
│
└── 📁 client/                     # Frontend Vite + Phaser
    ├── 📄 package.json            # Dépendances client
    ├── 📄 tsconfig.json           # Configuration TypeScript client
    ├── 📄 vite.config.ts          # Configuration Vite
    ├── 📄 index.html              # Page HTML principale
    │
    └── 📁 src/
        ├── 📄 main.ts             # Point d'entrée principal
        │
        ├── 📁 game/
        │   ├── 📄 types.ts         # Types TypeScript client
        │   ├── 📄 store.ts         # Store réactif
        │   └── 📄 AntColonyScene.ts # Scène Phaser
        │
        ├── 📁 ui/
        │   └── 📄 hud.ts           # Interface utilisateur
        │
        └── 📁 assets/
            └── 📁 placeholder/
                └── 📄 README.md    # Documentation des assets
```

## 🎯 Fonctionnalités implémentées

### ✅ Backend (Node.js + TypeScript)
- **Serveur Express** avec routes de santé et logs
- **Intégration Twitch** via tmi.js
- **WebSocket** pour communication temps réel
- **Gestion d'état** en mémoire avec persistance
- **Système de commandes** avec validation et cooldowns
- **Boucle jour/nuit** (60 secondes par phase)
- **Événements aléatoires** toutes les 20-30 secondes
- **Attaques nocturnes** avec système de défense

### ✅ Frontend (Vite + Phaser 3)
- **Interface web** responsive avec HUD complet
- **Scène 2D** avec chambres de fourmilière
- **Animations** de fourmis et événements
- **Contrôles de la Reine** (Pondre, Ordre, Boost)
- **Feed d'événements** en temps réel
- **Liste des joueurs** actifs
- **Système de connexion** WebSocket avec reconnexion

### ✅ Gameplay
- **4 rôles** : Ouvrière, Soldat, Exploratrice, Soigneuse
- **8 commandes** chat avec validation de rôle
- **Ressources** : Nourriture, Matériaux, Population, Santé
- **Système de priorités** et boosts
- **Cooldowns** et limitations par joueur
- **Événements visuels** et feedback

## 🚀 Scripts disponibles

```bash
# Installation et vérification
npm run check          # Vérifier la version Node.js
./install.sh          # Installation automatique

# Développement
npm run dev           # Lancement complet (serveur + client)
npm run server        # Serveur seul
npm run client:dev    # Client seul

# Démonstration
npm run demo          # Mode démonstration (sans Twitch)

# Production
npm run build         # Build du client
npm run serve         # Servir le build
npm run start         # Production complète
```

## 🔧 Configuration requise

### Variables d'environnement (.env)
```bash
TWITCH_USERNAME=your_twitch_username
TWITCH_OAUTH_TOKEN=oauth:your_oauth_token_from_twitchapps.com/tmi/
TWITCH_CHANNEL=your_channel_name
PORT=5173
WS_PORT=8080
```

### Dépendances système
- **Node.js 16+** (vérifié automatiquement)
- **npm** ou **yarn**

## 🎮 Commandes de jeu

### Commandes universelles
- `!role` - Voir votre rôle actuel
- `!stats` - Voir les statistiques de la fourmilière

### Ouvrière 🛠️
- `!creuser` - Creuser de nouveaux tunnels
- `!ramener` - Ramener de la nourriture ou des matériaux
- `!construire` - Construire des défenses

### Soldat ⚔️
- `!patrouiller` - Patrouiller pour détecter les menaces
- `!attaquer` - Attaquer les ennemis (nuit uniquement)

### Exploratrice 🔍
- `!scouter` - Explorer de nouvelles zones
- `!signaler` - Signaler des ressources

### Soigneuse 💊
- `!soigner` - Soigner les fourmis blessées
- `!nourrir` - Nourrir la colonie

## 👑 Actions de la Reine

Interface web disponible sur `http://localhost:5173`:

- **Pondre** - Créer de nouvelles fourmis (Ouvrière/Soldat/Exploratrice/Soigneuse)
- **Ordre** - Définir les priorités (Food/Build/Defense)
- **Boost** - Activer un boost temporaire (+25% vitesse)

## 🔌 API Endpoints

- `GET /healthz` - État du serveur
- `GET /logs` - Logs récents
- `GET /help` - Aide et commandes
- `POST /queen/action` - Actions de la Reine

## 🎨 Extensions possibles

- [ ] Système de niveaux et progression
- [ ] Événements spéciaux et boss
- [ ] Interface d'administration avancée
- [ ] Sauvegarde automatique
- [ ] Statistiques détaillées
- [ ] Système de récompenses
- [ ] Mode multijoueur avancé

## 🐛 Dépannage

### Erreurs courantes
- **Node.js version** : Utiliser `npm run check`
- **Dépendances** : Relancer `npm install`
- **Ports occupés** : Modifier les ports dans `.env`
- **WebSocket déconnecté** : Reconnexion automatique

### Logs utiles
```bash
# Vérifier l'état du serveur
curl http://localhost:5173/healthz

# Voir les logs récents
curl http://localhost:5173/logs

# Tester les actions de la Reine
curl -X POST http://localhost:5173/queen/action \
  -H "Content-Type: application/json" \
  -d '{"type":"boost","data":{}}'
```

## 📊 Métriques et monitoring

Le serveur expose des métriques via l'API :
- Nombre de joueurs actifs
- État des ressources
- Phase jour/nuit
- Événements récents
- Connexions WebSocket

## 🎯 Prochaines étapes

1. **Configurer Twitch** : Obtenir le token OAuth
2. **Tester localement** : `npm run dev`
3. **Déployer** : Build et serveur de production
4. **Personnaliser** : Modifier les couleurs et assets
5. **Étendre** : Ajouter de nouvelles fonctionnalités

---

**🎉 Projet complet et fonctionnel ! Prêt pour le streaming interactif !**
