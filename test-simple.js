#!/usr/bin/env node

const http = require('http');

console.log('🧪 Test simple - Fourmilière Royale');
console.log('====================================');

// Test du serveur HTTP
const testServer = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5173,
      path: '/healthz',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('✅ Serveur HTTP accessible');
        console.log('📊 Status:', res.statusCode);
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Serveur HTTP non accessible:', err.message);
      reject(err);
    });
    
    req.on('timeout', () => {
      console.log('⏰ Timeout - Serveur en cours de démarrage...');
      req.destroy();
      reject(new Error('Timeout'));
    });
    
    req.end();
  });
};

// Test du WebSocket
const testWebSocket = () => {
  return new Promise((resolve, reject) => {
    const WebSocket = require('ws');
    const ws = new WebSocket('ws://localhost:8080');
    
    ws.on('open', () => {
      console.log('✅ WebSocket connecté');
      ws.close();
      resolve();
    });
    
    ws.on('error', (err) => {
      console.log('❌ WebSocket non accessible:', err.message);
      reject(err);
    });
    
    setTimeout(() => {
      console.log('⏰ Timeout WebSocket - Serveur en cours de démarrage...');
      ws.close();
      reject(new Error('Timeout'));
    }, 5000);
  });
};

// Tests
const runTests = async () => {
  console.log('🔍 Vérification des services...');
  
  try {
    await testServer();
  } catch (err) {
    console.log('⚠️  Serveur HTTP non disponible (normal si pas encore démarré)');
  }
  
  try {
    await testWebSocket();
  } catch (err) {
    console.log('⚠️  WebSocket non disponible (normal si pas encore démarré)');
  }
  
  console.log('');
  console.log('📋 Instructions:');
  console.log('1. Lancer: ./start-web.sh');
  console.log('2. Attendre 10-15 secondes');
  console.log('3. Ouvrir: http://localhost:5173');
  console.log('4. Relancer ce test: node test-simple.js');
};

runTests();
