#!/bin/bash

echo "🌐 Fourmilière Royale - Page d'Accueil"
echo "======================================"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Créer .env si nécessaire
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp env.example .env
    echo "✅ Fichier .env créé"
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances serveur..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installation des dépendances client..."
    cd client && npm install && cd ..
fi

echo ""
echo "🚀 Démarrage avec page d'accueil..."
echo "📱 Interface web: http://localhost:5173"
echo "🔌 WebSocket: ws://localhost:8080"
echo "📊 Dashboard: http://localhost:3000/healthz"
echo ""
echo "🎮 Nouvelle page d'accueil avec configuration Twitch"
echo "💡 Configurez votre chaîne et démarrez le jeu !"
echo ""
echo "⏳ Attendez 10-15 secondes que les services démarrent..."
echo "⏹️  Appuyez sur Ctrl+C pour arrêter"
echo ""

# Démarrer le serveur JavaScript
echo "🔧 Démarrage du serveur backend (JavaScript)..."
node server/server.js &
SERVER_PID=$!

# Attendre un peu
sleep 3

# Démarrer le client
echo "🎮 Démarrage du client frontend..."
cd client && npm run dev &
CLIENT_PID=$!

# Attendre que les processus se terminent
wait $SERVER_PID $CLIENT_PID
