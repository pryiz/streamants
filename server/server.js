const dotenv = require('dotenv');
const express = require('express');
const tmi = require('tmi.js');
const { WebSocketServer } = require('ws');

// Charger les variables d'environnement
dotenv.config();

// Configuration
const TWITCH_USERNAME = process.env.TWITCH_USERNAME || 'test_user';
const TWITCH_OAUTH_TOKEN = process.env.TWITCH_OAUTH_TOKEN || 'oauth:test_token';
const TWITCH_CHANNEL = process.env.TWITCH_CHANNEL || 'test_channel';
const PORT = parseInt(process.env.PORT || '3000');
const WS_PORT = parseInt(process.env.WS_PORT || '8080');

console.log('🐜 Fourmilière Royale - Serveur JavaScript');
console.log(`📺 Canal Twitch: ${TWITCH_CHANNEL}`);
console.log(`🔌 WebSocket: ws://localhost:${WS_PORT}`);
console.log(`🌐 HTTP: http://localhost:${PORT}`);

// État du jeu simplifié
const gameState = {
  food: 50,
  materials: 20,
  population: 10,
  health: 100,
  dayNight: {
    isDay: true,
    timeRemaining: 60,
    dayCount: 1
  },
  players: new Map(),
  recentEvents: []
};

// Serveur Express
const app = express();
app.use(express.json());

// Route de santé
app.get('/healthz', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    game: {
      food: gameState.food,
      materials: gameState.materials,
      population: gameState.population,
      health: gameState.health,
      dayNight: gameState.dayNight
    }
  });
});

// Route pour les logs
app.get('/logs', (req, res) => {
  res.json({
    events: gameState.recentEvents.slice(-20),
    activePlayers: Array.from(gameState.players.values())
  });
});

// Route d'aide
app.get('/help', (req, res) => {
  res.json({
    commands: [
      '!role - Voir votre rôle',
      '!stats - Voir les statistiques',
      '!ramener - Ramener des ressources',
      '!construire - Construire des défenses',
      '!patrouiller - Patrouiller',
      '!attaquer - Attaquer (nuit)',
      '!scouter - Explorer',
      '!soigner - Soigner la colonie'
    ]
  });
});

// Démarrer le serveur Express
app.listen(PORT, () => {
  console.log(`🌐 Serveur Express démarré sur le port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/healthz`);
});

// Serveur WebSocket
const wss = new WebSocketServer({ port: WS_PORT });
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('🔌 Nouveau client WebSocket connecté');
  clients.add(ws);

  // Envoyer l'état initial
  ws.send(JSON.stringify({
    type: 'state',
    data: {
      ...gameState,
      players: Array.from(gameState.players.entries()).map(([name, data]) => ({
        name,
        role: data.role,
        lastCommandTs: data.lastCommandTs
      }))
    }
  }));

  ws.on('close', () => {
    console.log('🔌 Client WebSocket déconnecté');
    clients.delete(ws);
  });
});

console.log(`🔌 Serveur WebSocket démarré sur le port ${WS_PORT}`);

// Configuration Twitch (optionnel)
if (TWITCH_USERNAME !== 'test_user') {
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

  twitchClient.on('message', (channel, tags, message, self) => {
    if (self) return;
    
    const username = tags.username || 'unknown';
    console.log(`💬 ${username}: ${message}`);
    
    if (message.startsWith('!')) {
      processCommand(username, message.toLowerCase().trim());
    }
  });

  twitchClient.on('connected', (addr, port) => {
    console.log(`🔗 Connecté à Twitch: ${addr}:${port}`);
  });

  twitchClient.connect().catch(console.error);
} else {
  console.log('📝 Mode démonstration - Pas de connexion Twitch');
}

// Traitement des commandes
function processCommand(username, command) {
  const player = getOrCreatePlayer(username);
  const now = Date.now();
  
  if (now - player.lastCommandTs < 5000) {
    console.log(`❌ ${username}: ${command} - Trop rapide`);
    return;
  }
  
  player.lastCommandTs = now;
  
  let result = { success: false, message: 'Commande inconnue' };
  
  switch (command) {
    case '!role':
      result = { success: true, message: `Vous êtes ${player.role}` };
      break;
      
    case '!stats':
      result = { 
        success: true, 
        message: `Nourriture: ${gameState.food}, Matériaux: ${gameState.materials}, Population: ${gameState.population}, Santé: ${gameState.health}` 
      };
      break;
      
    case '!ramener':
      if (player.role !== 'ouvriere') {
        result = { success: false, message: 'Seules les ouvrières peuvent ramener des ressources' };
      } else if (!gameState.dayNight.isDay) {
        result = { success: false, message: 'Les ouvrières ne travaillent que le jour' };
      } else {
        const foodGain = Math.floor(Math.random() * 3) + 1;
        gameState.food += foodGain;
        result = { 
          success: true, 
          message: `Ouvrière ${username} ramène ${foodGain} nourriture`,
          effects: { food: foodGain }
        };
      }
      break;
      
    case '!construire':
      if (player.role !== 'ouvriere') {
        result = { success: false, message: 'Seules les ouvrières peuvent construire' };
      } else if (gameState.materials < 2) {
        result = { success: false, message: 'Pas assez de matériaux' };
      } else {
        gameState.materials -= 2;
        result = { 
          success: true, 
          message: `Ouvrière ${username} construit des défenses`,
          effects: { materials: -2 }
        };
      }
      break;
      
    case '!patrouiller':
      if (player.role !== 'soldat') {
        result = { success: false, message: 'Seuls les soldats peuvent patrouiller' };
      } else {
        result = { success: true, message: `Soldat ${username} patrouille` };
      }
      break;
      
    case '!attaquer':
      if (player.role !== 'soldat') {
        result = { success: false, message: 'Seuls les soldats peuvent attaquer' };
      } else if (gameState.dayNight.isDay) {
        result = { success: false, message: 'Les soldats n\'attaquent que la nuit' };
      } else {
        result = { success: true, message: `Soldat ${username} attaque les ennemis` };
      }
      break;
      
    case '!scouter':
      if (player.role !== 'exploratrice') {
        result = { success: false, message: 'Seules les exploratrices peuvent scouter' };
      } else if (!gameState.dayNight.isDay) {
        result = { success: false, message: 'Les exploratrices ne partent que le jour' };
      } else {
        if (Math.random() < 0.2) {
          const discovery = Math.random() < 0.5 ? { food: 3 } : { materials: 2 };
          Object.assign(gameState, discovery);
          result = { 
            success: true, 
            message: `Exploratrice ${username} découvre des ressources !`,
            effects: discovery
          };
        } else {
          result = { success: true, message: `Exploratrice ${username} explore sans rien trouver` };
        }
      }
      break;
      
    case '!soigner':
      if (player.role !== 'soigneuse') {
        result = { success: false, message: 'Seules les soigneuses peuvent soigner' };
      } else if (gameState.health >= 100) {
        result = { success: false, message: 'La colonie est déjà en parfaite santé' };
      } else {
        gameState.health = Math.min(100, gameState.health + 2);
        result = { 
          success: true, 
          message: `Soigneuse ${username} soigne la colonie`,
          effects: { health: 2 }
        };
      }
      break;
  }
  
  if (result.success) {
    console.log(`✅ ${username}: ${command} - ${result.message}`);
    
    // Ajouter l'événement
    const event = {
      id: `event_${Date.now()}`,
      timestamp: Date.now(),
      type: 'command',
      player: username,
      role: player.role,
      command: command,
      message: result.message,
      effects: result.effects || {}
    };
    
    gameState.recentEvents.push(event);
    if (gameState.recentEvents.length > 10) {
      gameState.recentEvents.shift();
    }
    
    // Broadcast aux clients WebSocket
    const message = JSON.stringify({
      type: 'event',
      data: [event]
    });
    
    clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  } else {
    console.log(`❌ ${username}: ${command} - ${result.message}`);
  }
}

function getOrCreatePlayer(username) {
  if (!gameState.players.has(username)) {
    const roles = ['ouvriere', 'soldat', 'exploratrice', 'soigneuse'];
    const role = roles[Math.floor(Math.random() * roles.length)];
    
    gameState.players.set(username, {
      name: username,
      role: role,
      lastCommandTs: 0
    });
  }
  
  return gameState.players.get(username);
}

// Boucle de jeu
setInterval(() => {
  gameState.dayNight.timeRemaining--;
  
  if (gameState.dayNight.timeRemaining <= 0) {
    gameState.dayNight.isDay = !gameState.dayNight.isDay;
    gameState.dayNight.timeRemaining = 60;
    
    if (gameState.dayNight.isDay) {
      gameState.dayNight.dayCount++;
    }
    
    const event = {
      id: `phase_${Date.now()}`,
      timestamp: Date.now(),
      type: 'phase',
      message: `${gameState.dayNight.isDay ? 'Jour' : 'Nuit'} ${gameState.dayNight.dayCount}`,
      effects: {}
    };
    
    gameState.recentEvents.push(event);
    if (gameState.recentEvents.length > 10) {
      gameState.recentEvents.shift();
    }
    
    // Broadcast phase change
    const message = JSON.stringify({
      type: 'phase',
      data: {
        isDay: gameState.dayNight.isDay,
        dayCount: gameState.dayNight.dayCount,
        message: event.message
      }
    });
    
    clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }
  
  // Broadcast state update
  const stateMessage = JSON.stringify({
    type: 'state',
    data: {
      ...gameState,
      players: Array.from(gameState.players.entries()).map(([name, data]) => ({
        name,
        role: data.role,
        lastCommandTs: data.lastCommandTs
      }))
    }
  });
  
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(stateMessage);
    }
  });
}, 1000);

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  wss.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  wss.close();
  process.exit(0);
});
