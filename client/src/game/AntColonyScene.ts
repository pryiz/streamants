import Phaser from 'phaser';
import { AntColonyRoom, Ant } from './types';

export class AntColonyScene extends Phaser.Scene {
  private rooms: AntColonyRoom[] = [];
  private ants: Ant[] = [];
  private antSprites: Phaser.GameObjects.Graphics[] = [];
  private roomGraphics: Phaser.GameObjects.Graphics[] = [];
  private eventTexts: Phaser.GameObjects.Text[] = [];
  private tunnels: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super({ key: 'AntColonyScene' });
  }

  create(): void {
    // Configuration de la scène
    this.cameras.main.setBackgroundColor('#2d4a3e');
    
    // Créer les chambres de la fourmilière
    this.createRooms();
    this.drawRooms();
    this.drawTunnels();
    this.createAnts();
    
    // Ajouter des effets de particules pour l'ambiance
    this.createAmbientParticles();
    
    // Ajouter un titre et des instructions
    this.addInstructions();
  }

  private createRooms(): void {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    
    this.rooms = [
      {
        name: 'reine',
        x: centerX,
        y: centerY - 100,
        width: 120,
        height: 80,
        color: 0x9c27b0,
        label: '👑 Reine'
      },
      {
        name: 'ponte',
        x: centerX - 150,
        y: centerY - 50,
        width: 100,
        height: 60,
        color: 0xff9800,
        label: '🥚 Ponte'
      },
      {
        name: 'reserves',
        x: centerX + 150,
        y: centerY - 50,
        width: 100,
        height: 60,
        color: 0x4caf50,
        label: '🍎 Réserves'
      },
      {
        name: 'construction',
        x: centerX - 100,
        y: centerY + 50,
        width: 100,
        height: 60,
        color: 0x2196f3,
        label: '🔨 Construction'
      },
      {
        name: 'defense',
        x: centerX + 100,
        y: centerY + 50,
        width: 100,
        height: 60,
        color: 0xf44336,
        label: '🛡️ Défense'
      }
    ];
  }

  private drawRooms(): void {
    this.rooms.forEach(room => {
      const graphics = this.add.graphics();
      
      // Dessiner la chambre
      graphics.fillStyle(room.color, 0.8);
      graphics.fillRoundedRect(room.x - room.width/2, room.y - room.height/2, room.width, room.height, 10);
      
      // Bordure
      graphics.lineStyle(2, 0xffffff, 0.5);
      graphics.strokeRoundedRect(room.x - room.width/2, room.y - room.height/2, room.width, room.height, 10);
      
      // Label
      const text = this.add.text(room.x, room.y, room.label, {
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: 'bold'
      });
      text.setOrigin(0.5);
      
      this.roomGraphics.push(graphics);
    });
  }

  private drawTunnels(): void {
    // Dessiner des tunnels simples entre les chambres
    const tunnelPaths = [
      { from: 'reine', to: 'ponte' },
      { from: 'reine', to: 'reserves' },
      { from: 'reine', to: 'construction' },
      { from: 'reine', to: 'defense' },
      { from: 'ponte', to: 'construction' },
      { from: 'reserves', to: 'defense' }
    ];
    
    tunnelPaths.forEach(path => {
      const fromRoom = this.rooms.find(r => r.name === path.from);
      const toRoom = this.rooms.find(r => r.name === path.to);
      
      if (fromRoom && toRoom) {
        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0x8d6e63, 0.6);
        
        // Créer une courbe simple
        const startX = fromRoom.x;
        const startY = fromRoom.y;
        const endX = toRoom.x;
        const endY = toRoom.y;
        
        const controlX = (startX + endX) / 2;
        const controlY = (startY + endY) / 2 + (Math.random() - 0.5) * 50;
        
        graphics.beginPath();
        graphics.moveTo(startX, startY);
        graphics.quadraticCurveTo(controlX, controlY, endX, endY);
        graphics.strokePath();
        
        this.tunnels.push(graphics);
      }
    });
  }

  private createAnts(): void {
    // Créer quelques fourmis de base
    for (let i = 0; i < 8; i++) {
      const ant: Ant = {
        id: `ant_${i}`,
        x: Math.random() * this.cameras.main.width,
        y: Math.random() * this.cameras.main.height,
        role: ['ouvriere', 'soldat', 'exploratrice', 'soigneuse'][i % 4] as any,
        isMoving: false
      };
      
      this.ants.push(ant);
      this.createAntSprite(ant);
    }
  }

  private createAntSprite(ant: Ant): void {
    const graphics = this.add.graphics();
    
    // Couleur selon le rôle
    const colors = {
      ouvriere: 0x4caf50,
      soldat: 0xf44336,
      exploratrice: 0xff9800,
      soigneuse: 0x2196f3
    };
    
    graphics.fillStyle(colors[ant.role], 1);
    graphics.fillCircle(ant.x, ant.y, 4);
    
    // Bordure
    graphics.lineStyle(1, 0xffffff, 0.8);
    graphics.strokeCircle(ant.x, ant.y, 4);
    
    this.antSprites.push(graphics);
  }

  private createAmbientParticles(): void {
    // Créer des particules d'ambiance
    const particles = this.add.particles(0, 0, 'particle', {
      speed: { min: 10, max: 30 },
      scale: { start: 0.1, end: 0 },
      lifespan: 3000,
      frequency: 2000,
      blendMode: 'ADD',
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(0, 0, this.cameras.main.width, this.cameras.main.height)
      }
    });
    
    // Créer une texture de particule simple
    const particleTexture = this.add.graphics();
    particleTexture.fillStyle(0xffffff, 0.3);
    particleTexture.fillCircle(0, 0, 2);
    particleTexture.generateTexture('particle', 4, 4);
    particleTexture.destroy();
  }

  private addInstructions(): void {
    // Titre principal
    const title = this.add.text(this.cameras.main.width / 2, 50, '🏗️ Fourmilière Royale', {
      fontSize: '32px',
      color: '#FFD700',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    
    // Sous-titre
    const subtitle = this.add.text(this.cameras.main.width / 2, 90, 'Vos viewers sont des fourmis qui construisent ensemble !', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'italic'
    });
    subtitle.setOrigin(0.5);
    
    // Instructions pour les viewers
    const instructions = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 100, 
      '💬 Commandes chat: !role, !ramener, !construire, !patrouiller, !scouter, !soigner', {
      fontSize: '14px',
      color: '#4CAF50',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });
    instructions.setOrigin(0.5);
    
    // Animation du titre
    this.tweens.add({
      targets: title,
      y: title.y + 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  public addEventPopup(event: any): void {
    // Trouver une chambre aléatoire pour afficher le popup
    const randomRoom = this.rooms[Math.floor(Math.random() * this.rooms.length)];
    
    const text = this.add.text(randomRoom.x, randomRoom.y - 50, event.message, {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    });
    text.setOrigin(0.5);
    
    // Animation d'apparition
    text.setAlpha(0);
    text.setScale(0.5);
    
    this.tweens.add({
      targets: text,
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Faire disparaître le texte après 3 secondes
        this.tweens.add({
          targets: text,
          alpha: 0,
          y: text.y - 20,
          duration: 1000,
          delay: 2000,
          onComplete: () => {
            text.destroy();
          }
        });
      }
    });
    
    this.eventTexts.push(text);
  }

  public updateAnts(ants: Ant[]): void {
    // Mettre à jour les fourmis existantes et en créer de nouvelles
    ants.forEach((ant, index) => {
      if (index < this.ants.length) {
        // Mettre à jour la fourmi existante
        const existingAnt = this.ants[index];
        existingAnt.x = ant.x;
        existingAnt.y = ant.y;
        existingAnt.role = ant.role;
        
        // Animer le mouvement
        if (existingAnt.targetX !== ant.x || existingAnt.targetY !== ant.y) {
          existingAnt.targetX = ant.x;
          existingAnt.targetY = ant.y;
          existingAnt.isMoving = true;
          
          const sprite = this.antSprites[index];
          this.tweens.add({
            targets: sprite,
            x: ant.x,
            y: ant.y,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
              existingAnt.isMoving = false;
            }
          });
        }
      } else {
        // Créer une nouvelle fourmi
        this.ants.push(ant);
        this.createAntSprite(ant);
      }
    });
    
    // Supprimer les fourmis en trop
    while (this.ants.length > ants.length) {
      const ant = this.ants.pop();
      const sprite = this.antSprites.pop();
      if (sprite) sprite.destroy();
    }
  }

  public setDayNight(isDay: boolean): void {
    // Changer l'ambiance selon le jour/nuit
    const targetColor = isDay ? 0x87ceeb : 0x2c3e50;
    
    this.tweens.add({
      targets: this.cameras.main,
      backgroundColor: targetColor,
      duration: 2000,
      ease: 'Power2'
    });
  }

  update(): void {
    // Animation des fourmis
    this.ants.forEach((ant, index) => {
      if (!ant.isMoving && Math.random() < 0.01) {
        // Mouvement aléatoire occasionnel
        const targetX = ant.x + (Math.random() - 0.5) * 50;
        const targetY = ant.y + (Math.random() - 0.5) * 50;
        
        // S'assurer que la fourmi reste dans les limites
        const clampedX = Phaser.Math.Clamp(targetX, 50, this.cameras.main.width - 50);
        const clampedY = Phaser.Math.Clamp(targetY, 50, this.cameras.main.height - 50);
        
        ant.targetX = clampedX;
        ant.targetY = clampedY;
        ant.isMoving = true;
        
        const sprite = this.antSprites[index];
        this.tweens.add({
          targets: sprite,
          x: clampedX,
          y: clampedY,
          duration: 2000,
          ease: 'Power1',
          onComplete: () => {
            ant.x = clampedX;
            ant.y = clampedY;
            ant.isMoving = false;
          }
        });
      }
    });
  }
}
