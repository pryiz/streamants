# Fourmilière Royale 🐜👑

Jeu 2D interactif où le streamer est la Reine et les viewers sont des fourmis qui agissent via le chat Twitch.

## 🚀 Installation

### Méthode rapide (recommandée)
```bash
# Cloner et installer automatiquement
git clone <repository>
cd fourmiliere-royale
chmod +x install.sh
./install.sh
```

### Méthode manuelle
1. **Cloner le projet**
```bash
git clone <repository>
cd fourmiliere-royale
```

2. **Installer les dépendances**
```bash
npm install
cd client && npm install
```

3. **Configuration Twitch**
- Copier `env.example` vers `.env`
- Obtenir un token OAuth depuis https://twitchapps.com/tmi/
- Remplir les variables dans `.env`:
  - `TWITCH_USERNAME`: votre nom d'utilisateur Twitch
  - `TWITCH_OAUTH_TOKEN`: token au format `oauth:xxxx`
  - `TWITCH_CHANNEL`: nom de la chaîne à surveiller

### Vérification de l'installation
```bash
npm run check
```

## 🎮 Lancement

### 🌐 Interface Web (Recommandé)
```bash
./start-web.sh
```
Lance l'interface web complète pour le streamer.
Ouvrir **http://localhost:5173** dans le navigateur.

### Développement
```bash
npm run dev
```
Lance le serveur backend et le client frontend en mode développement.

### Démonstration (sans Twitch)
```bash
npm run demo
```
Simule des commandes Twitch pour tester le jeu sans configuration Twitch.

### Production
```bash
npm run build
npm run serve
```

## 🎯 Commandes Chat

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

## 🏗️ Architecture

- **Frontend**: Vite + TypeScript + Phaser 3
- **Backend**: Node.js + TypeScript + tmi.js + WebSocket
- **Communication**: WebSocket en temps réel
- **État**: Store en mémoire avec persistance

## 📁 Structure

```
fourmiliere-royale/
├── server/          # Backend Node.js
├── client/          # Frontend Vite + Phaser
├── package.json     # Scripts et dépendances
└── .env            # Configuration (à créer)
```

## 🐛 Dépannage

- **Erreur de connexion Twitch**: Vérifier le token OAuth et les permissions
- **WebSocket déconnecté**: Le client se reconnecte automatiquement
- **Ports occupés**: Modifier les ports dans `.env`

## 🎨 Extensions possibles

- [ ] Système de niveaux et progression
- [ ] Événements spéciaux et boss
- [ ] Interface d'administration avancée
- [ ] Sauvegarde automatique
- [ ] Statistiques détaillées
