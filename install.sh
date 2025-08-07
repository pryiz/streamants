#!/bin/bash

echo "🐜 Installation de Fourmilière Royale..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 16+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js 16+ requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Installer les dépendances du serveur
echo "📦 Installation des dépendances serveur..."
npm install

# Installer les dépendances du client
echo "📦 Installation des dépendances client..."
cd client && npm install && cd ..

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp env.example .env
    echo "⚠️  Veuillez configurer votre fichier .env avec vos informations Twitch"
    echo "   - TWITCH_USERNAME: votre nom d'utilisateur Twitch"
    echo "   - TWITCH_OAUTH_TOKEN: token depuis https://twitchapps.com/tmi/"
    echo "   - TWITCH_CHANNEL: nom de la chaîne à surveiller"
else
    echo "✅ Fichier .env déjà présent"
fi

echo ""
echo "🎉 Installation terminée !"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurer le fichier .env avec vos informations Twitch"
echo "2. Lancer le jeu avec: npm run dev"
echo "3. Ouvrir http://localhost:5173 dans votre navigateur"
echo ""
echo "📚 Documentation: README.md"
