# 🔧 Dépannage - Fourmilière Royale

## 🚀 Démarrage rapide

### Méthode 1 : Démarrage simple
```bash
./start-simple.sh
```

### Méthode 2 : Démarrage complet
```bash
./start-web.sh
```

### Méthode 3 : Manuel
```bash
# Terminal 1 - Serveur
npm run server

# Terminal 2 - Client
cd client && npm run dev
```

## 🐛 Problèmes courants

### ❌ Erreur TypeScript
```
error TS5109: Option 'moduleResolution' must be set to 'NodeNext'
```

**Solution :**
- Vérifier que `server/tsconfig.json` contient `"moduleResolution": "node"`
- Relancer avec `./start-simple.sh`

### ❌ Erreur Vite
```
TypeError: crypto$2.getRandomValues is not a function
```

**Solution :**
- Utiliser `./start-simple.sh` au lieu de `./start-web.sh`
- Ou mettre à jour vers Node.js 18+

### ❌ Ports occupés
```
Error: listen EADDRINUSE: address already in use
```

**Solution :**
```bash
# Trouver le processus
lsof -i :5173
lsof -i :8080

# Tuer le processus
kill -9 <PID>

# Ou changer les ports dans .env
PORT=5174
WS_PORT=8081
```

### ❌ Dépendances manquantes
```
Cannot find module 'phaser'
```

**Solution :**
```bash
# Réinstaller les dépendances
cd client && npm install
cd .. && npm install
```

## 🧪 Test de fonctionnement

### Test simple
```bash
node test-simple.js
```

### Test manuel
```bash
# Test serveur HTTP
curl http://localhost:5173/healthz

# Test WebSocket (avec wscat si installé)
wscat -c ws://localhost:8080
```

## 📊 Vérification des services

### ✅ Serveur HTTP
- URL : http://localhost:5173/healthz
- Réponse attendue : JSON avec statut "ok"

### ✅ WebSocket
- URL : ws://localhost:8080
- Connexion : Réception de l'état initial

### ✅ Interface web
- URL : http://localhost:5173
- Affichage : Interface avec HUD et contrôles

## 🔧 Configuration

### Variables d'environnement (.env)
```bash
# Configuration Twitch (optionnel)
TWITCH_USERNAME=your_username
TWITCH_OAUTH_TOKEN=oauth:your_token
TWITCH_CHANNEL=your_channel

# Configuration serveur
PORT=5173
WS_PORT=8080
```

### Mode démonstration (sans Twitch)
```bash
npm run demo
```

## 🎯 Solutions par problème

### Problème : Interface ne se charge pas
1. Vérifier que le serveur démarre : `npm run server`
2. Vérifier que le client démarre : `cd client && npm run dev`
3. Vérifier les ports : `lsof -i :5173`
4. Redémarrer : `./start-simple.sh`

### Problème : WebSocket déconnecté
1. Vérifier le port 8080 : `lsof -i :8080`
2. Redémarrer le serveur : `npm run server`
3. Vérifier la configuration dans `.env`

### Problème : Commandes chat ne fonctionnent pas
1. Vérifier la configuration Twitch dans `.env`
2. Tester en mode démo : `npm run demo`
3. Vérifier les logs du serveur

### Problème : Performance lente
1. Vérifier les ressources système
2. Réduire la complexité des animations
3. Utiliser un navigateur récent

## 📋 Checklist de démarrage

- [ ] Node.js 16+ installé
- [ ] Dépendances installées (`npm install`)
- [ ] Fichier `.env` créé
- [ ] Ports 5173 et 8080 libres
- [ ] Serveur démarre sans erreur
- [ ] Client démarre sans erreur
- [ ] Interface accessible sur http://localhost:5173
- [ ] WebSocket connecté
- [ ] Contrôles de la Reine fonctionnels

## 🆘 Support

### Logs utiles
```bash
# Logs serveur
npm run server

# Logs client
cd client && npm run dev

# Test de connectivité
node test-simple.js
```

### Redémarrage complet
```bash
# Arrêter tous les processus
pkill -f "node"
pkill -f "vite"

# Nettoyer et redémarrer
rm -rf node_modules client/node_modules
npm install
cd client && npm install && cd ..
./start-simple.sh
```

---

**🎮 Si rien ne fonctionne, utilisez `./start-simple.sh` qui est plus stable !**
