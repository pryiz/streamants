import dotenv from 'dotenv';
import express from 'express';
import tmi from 'tmi.js';
import { GameStateManager } from './state';
import { CommandManager } from './commands';
import { WebSocketManager } from './ws';

// Charger les variables d'environnement
dotenv.config();

// Configuration
const TWITCH_USERNAME = process.env.TWITCH_USERNAME;
const TWITCH_OAUTH_TOKEN = process.env.TWITCH_OAUTH_TOKEN;
const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL;
const PORT = parseInt(process.env.PORT || '5173');
const WS_PORT = parseInt(process.env.WS_PORT || '8080');

// Validation de la configuration
if (!TWITCH_USERNAME || !TWITCH_OAUTH_TOKEN || !TWITCH_CHANNEL) {
  console.error('❌ Variables d\'environnement manquantes. Vérifiez votre fichier .env');
  process.exit(1);
}

// Initialiser les composants
const gameState = new GameStateManager();
const commandManager = new CommandManager(gameState);
const wsManager = new WebSocketManager(gameState, WS_PORT);

// Configuration Twitch
const twitchClient = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: TWITCH_USERNAME,
    password: TWITCH_OAUTH_TOKEN
  },
  channels: [TWITCH_CHANNEL]
});

// Gestionnaires d'événements Twitch
twitchClient.on('message', (channel, tags, message, self) => {
  if (self) return; // Ignorer nos propres messages
  
  const username = tags.username || 'unknown';
  console.log(`💬 ${username}: ${message}`);
  
  // Traiter la commande
  commandManager.processMessage({
    username,
    message,
    channel
  });
});

twitchClient.on('connected', (addr, port) => {
  console.log(`🔗 Connecté à Twitch: ${addr}:${port}`);
  console.log(`📺 Surveillance du canal: ${TWITCH_CHANNEL}`);
});

twitchClient.on('disconnected', (reason) => {
  console.log(`🔌 Déconnecté de Twitch: ${reason}`);
});

// Serveur Express pour les routes de santé
const app = express();
app.use(express.json());

// Route de santé
app.get('/healthz', (req, res) => {
  const state = gameState.getState();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    twitch: {
      connected: twitchClient.readyState() === 'OPEN',
      channel: TWITCH_CHANNEL
    },
    websocket: {
      clients: wsManager.getConnectedClientsCount()
    },
    game: {
      food: state.food,
      materials: state.materials,
      population: state.population,
      health: state.health,
      dayNight: state.dayNight
    }
  });
});

// Route pour les logs
app.get('/logs', (req, res) => {
  const events = gameState.getRecentEvents();
  res.json({
    events: events.slice(-20), // 20 derniers événements
    activePlayers: gameState.getActivePlayers()
  });
});

// Route pour les actions de la Reine (admin)
app.post('/queen/action', (req, res) => {
  const { type, data } = req.body;
  
  if (!type) {
    return res.status(400).json({ error: 'Type d\'action requis' });
  }
  
  const result = commandManager.processQueenAction({ type, data });
  
  if (result.success) {
    res.json({ success: true, message: result.message });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
});

// Route d'aide
app.get('/help', (req, res) => {
  res.json({
    commands: commandManager.getHelpMessage(),
    queen_actions: [
      'pondre - Créer une nouvelle fourmi',
      'ordre - Définir les priorités',
      'boost - Activer un boost temporaire'
    ]
  });
});

// Démarrer le serveur Express
app.listen(PORT, () => {
  console.log(`🌐 Serveur Express démarré sur le port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/healthz`);
  console.log(`📋 Aide: http://localhost:${PORT}/help`);
});

// Se connecter à Twitch
twitchClient.connect().catch(console.error);

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  twitchClient.disconnect();
  wsManager.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  twitchClient.disconnect();
  wsManager.close();
  process.exit(0);
});

// Log de démarrage
console.log('🐜 Fourmilière Royale - Serveur démarré');
console.log(`📺 Canal Twitch: ${TWITCH_CHANNEL}`);
console.log(`🔌 WebSocket: ws://localhost:${WS_PORT}`);
console.log(`🌐 HTTP: http://localhost:${PORT}`);
