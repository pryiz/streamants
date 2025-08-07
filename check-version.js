#!/usr/bin/env node

const { execSync } = require('child_process');

function checkNodeVersion() {
  try {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    console.log(`🐜 Vérification de la version Node.js...`);
    console.log(`📦 Version actuelle: ${version}`);
    
    if (majorVersion < 16) {
      console.error(`❌ Node.js 16+ requis. Version actuelle: ${version}`);
      console.error(`💡 Veuillez mettre à jour Node.js: https://nodejs.org/`);
      process.exit(1);
    }
    
    console.log(`✅ Version Node.js compatible (${version})`);
    console.log(`🚀 Prêt à lancer Fourmilière Royale !`);
    
  } catch (error) {
    console.error(`❌ Erreur lors de la vérification: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  checkNodeVersion();
}

module.exports = { checkNodeVersion };
