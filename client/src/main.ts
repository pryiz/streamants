import Phaser from 'phaser';
import { GameStore } from './game/store';
import { HUDManager } from './ui/hud';
import { AntColonyScene } from './game/AntColonyScene';

class FourmiliereRoyaleGame {
  private game: Phaser.Game;
  private store: GameStore;
  private hud: HUDManager;
  private scene: AntColonyScene;

  constructor() {
    this.initializeGame();
    this.setupStore();
    this.setupHUD();
    this.setupEventListeners();
  }

  private initializeGame(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: 'game-container',
      backgroundColor: '#2d4a3e',
      scene: AntColonyScene,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    this.game = new Phaser.Game(config);
    this.scene = this.game.scene.getScene('AntColonyScene') as AntColonyScene;
  }

  private setupStore(): void {
    this.store = new GameStore();
    
    // Écouter les événements de connexion
    this.store.addEventListener('connected', () => {
      console.log('✅ Connecté au serveur');
      this.hud.updateConnectionStatus(true);
    });
    
    this.store.addEventListener('disconnected', () => {
      console.log('❌ Déconnecté du serveur');
      this.hud.updateConnectionStatus(false);
    });
  }

  private setupHUD(): void {
    this.hud = new HUDManager(this.store);
  }

  private setupEventListeners(): void {
    // Écouter les mises à jour d'état
    this.store.addEventListener('stateUpdate', (event: any) => {
      const state = event.detail;
      
      // Mettre à jour l'ambiance jour/nuit
      this.scene.setDayNight(state.dayNight.isDay);
      
      // Mettre à jour les fourmis (simulation basée sur la population)
      this.updateAntsFromState(state);
    });

    // Écouter les nouveaux événements
    this.store.addEventListener('eventsUpdate', (event: any) => {
      const events = event.detail;
      
      // Afficher un popup pour le dernier événement
      if (events.length > 0) {
        const lastEvent = events[events.length - 1];
        this.scene.addEventPopup(lastEvent);
      }
    });

    // Écouter les changements de phase
    this.store.addEventListener('phaseUpdate', (event: any) => {
      const phaseData = event.detail;
      this.scene.setDayNight(phaseData.isDay);
    });

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
      this.game.scale.refresh();
    });

    // Gérer les erreurs
    this.store.addEventListener('error', (event: any) => {
      console.error('❌ Erreur:', event.detail);
      this.showErrorNotification(event.detail);
    });
  }

  private updateAntsFromState(state: any): void {
    // Créer des fourmis virtuelles basées sur la population
    const antCount = Math.min(state.population, 20); // Max 20 fourmis visibles
    const ants = [];
    
    for (let i = 0; i < antCount; i++) {
      const role = this.getRoleForIndex(i, state);
      ants.push({
        id: `ant_${i}`,
        x: Math.random() * this.game.scale.width,
        y: Math.random() * this.game.scale.height,
        role: role,
        isMoving: false
      });
    }
    
    this.scene.updateAnts(ants);
  }

  private getRoleForIndex(index: number, state: any): string {
    const roles = ['ouvriere', 'soldat', 'exploratrice', 'soigneuse'];
    const roleCounts = {
      ouvriere: state.rolesCap.ouvriere,
      soldat: state.rolesCap.soldat,
      exploratrice: state.rolesCap.exploratrice,
      soigneuse: state.rolesCap.soigneuse
    };
    
    // Répartir les fourmis selon les rôles disponibles
    let currentIndex = 0;
    for (const role of roles) {
      const count = roleCounts[role];
      if (index < currentIndex + count) {
        return role;
      }
      currentIndex += count;
    }
    
    return 'ouvriere'; // Rôle par défaut
  }

  private showErrorNotification(message: string): void {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.background = '#f44336';
    notification.style.color = 'white';
    notification.style.padding = '20px';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '3000';
    notification.style.maxWidth = '400px';
    notification.style.textAlign = 'center';
    notification.textContent = `Erreur: ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  public destroy(): void {
    this.store.destroy();
    this.game.destroy(true);
  }
}

// Gestionnaire de la page d'accueil
class WelcomeScreen {
  private welcomeScreen: HTMLElement;
  private gameContainer: HTMLElement;
  private setupForm: HTMLFormElement;
  private demoButton: HTMLButtonElement;

  constructor() {
    this.welcomeScreen = document.getElementById('welcome-screen')!;
    this.gameContainer = document.getElementById('game-container')!;
    this.setupForm = document.getElementById('setup-form') as HTMLFormElement;
    this.demoButton = document.getElementById('demo-button')!;
    
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.setupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.startGameWithConfig();
    });

    this.demoButton.addEventListener('click', () => {
      this.startGameDemo();
    });
  }

  private startGameWithConfig(): void {
    const channelName = (document.getElementById('channel-name') as HTMLInputElement).value;
    const twitchUsername = (document.getElementById('twitch-username') as HTMLInputElement).value;
    const oauthToken = (document.getElementById('oauth-token') as HTMLInputElement).value;

    // Sauvegarder la configuration
    localStorage.setItem('fourmiliere_config', JSON.stringify({
      channelName,
      twitchUsername,
      oauthToken
    }));

    this.startGame();
  }

  private startGameDemo(): void {
    // Configuration de démonstration
    localStorage.setItem('fourmiliere_config', JSON.stringify({
      channelName: 'demo_channel',
      twitchUsername: 'demo_user',
      oauthToken: ''
    }));

    this.startGame();
  }

  private startGame(): void {
    // Masquer la page d'accueil
    this.welcomeScreen.style.display = 'none';
    
    // Afficher l'interface de jeu
    this.gameContainer.style.display = 'block';
    
    // Démarrer le jeu
    console.log('🐜 Démarrage de Fourmilière Royale...');
    const game = new FourmiliereRoyaleGame();
    
    // Exposer le jeu globalement pour le débogage
    (window as any).fourmiliereGame = game;
    
    // Gestion propre de l'arrêt
    window.addEventListener('beforeunload', () => {
      game.destroy();
    });
  }
}

// Démarrer la page d'accueil quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
  console.log('🐜 Initialisation de Fourmilière Royale...');
  
  // Vérifier si on a déjà une configuration
  const savedConfig = localStorage.getItem('fourmiliere_config');
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      // Pré-remplir le formulaire
      (document.getElementById('channel-name') as HTMLInputElement).value = config.channelName || '';
      (document.getElementById('twitch-username') as HTMLInputElement).value = config.twitchUsername || '';
      (document.getElementById('oauth-token') as HTMLInputElement).value = config.oauthToken || '';
    } catch (e) {
      console.log('Configuration invalide, utilisation des valeurs par défaut');
    }
  }
  
  // Initialiser la page d'accueil
  new WelcomeScreen();
});
