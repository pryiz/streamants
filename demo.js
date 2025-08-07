#!/usr/bin/env node

const WebSocket = require('ws');
const http = require('http');

console.log('🎭 Mode démonstration - Fourmilière Royale');
console.log('📝 Ce mode simule des commandes Twitch pour tester le jeu');

// Créer un serveur HTTP simple pour simuler les événements
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'demo', message: 'Serveur de démonstration actif' }));
});

server.listen(8081, () => {
  console.log('🌐 Serveur de démonstration sur le port 8081');
});

// Simuler des commandes Twitch
const demoCommands = [
  { username: 'Alice', command: '!role' },
  { username: 'Bob', command: '!ramener' },
  { username: 'Charlie', command: '!construire' },
  { username: 'Diana', command: '!patrouiller' },
  { username: 'Eve', command: '!scouter' },
  { username: 'Frank', command: '!soigner' },
  { username: 'Grace', command: '!attaquer' },
  { username: 'Henry', command: '!nourrir' }
];

let commandIndex = 0;

// Simuler des commandes toutes les 5 secondes
setInterval(() => {
  const demoCommand = demoCommands[commandIndex % demoCommands.length];
  console.log(`💬 ${demoCommand.username}: ${demoCommand.command}`);
  
  // Ici vous pourriez envoyer la commande au serveur réel
  // Pour l'instant, on affiche juste la simulation
  
  commandIndex++;
}, 5000);

console.log('📋 Commandes de démonstration:');
demoCommands.forEach((cmd, index) => {
  console.log(`  ${index + 1}. ${cmd.username}: ${cmd.command}`);
});

console.log('');
console.log('🎮 Pour tester le jeu complet:');
console.log('1. Configurez votre fichier .env avec vos informations Twitch');
console.log('2. Lancez: npm run dev');
console.log('3. Ouvrez: http://localhost:5173');
console.log('');
console.log('⏹️  Appuyez sur Ctrl+C pour arrêter la démonstration');
