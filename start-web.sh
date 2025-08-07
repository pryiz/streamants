#!/bin/bash

echo "🌐 Lancement de Fourmilière Royale - Interface Web"
echo "=================================================="

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo "📝 Création d'un fichier .env de démonstration..."
    cp env.example .env
    echo "✅ Fichier .env créé"
    echo "💡 Configurez vos informations Twitch dans .env pour une expérience complète"
fi

# Vérifier les dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installation des dépendances client..."
    cd client && npm install && cd ..
fi

echo ""
echo "🚀 Démarrage de l'interface web..."
echo "📱 Interface streamer: http://localhost:5173"
echo "🔌 WebSocket: ws://localhost:8080"
echo "📊 Dashboard: http://localhost:5173/healthz"
echo ""
echo "🎮 Contrôles de la Reine disponibles dans le navigateur"
echo "💬 Commandes chat: !role, !ramener, !construire, etc."
echo ""
echo "⏹️  Appuyez sur Ctrl+C pour arrêter"

# Lancer le projet
npm run dev
