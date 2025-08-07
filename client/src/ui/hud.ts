import { GameStore } from '../game/store';
import { GameState, GameEvent, PlayerData } from '../game/types';

export class HUDManager {
  private store: GameStore;
  private elements: {
    foodValue: HTMLElement;
    materialsValue: HTMLElement;
    populationValue: HTMLElement;
    healthValue: HTMLElement;
    healthBar: HTMLElement;
    phaseIndicator: HTMLElement;
    eventsList: HTMLElement;
    playersList: HTMLElement;
    pondreBtn: HTMLButtonElement;
    ordreBtn: HTMLButtonElement;
    boostBtn: HTMLButtonElement;
    pondreMenu: HTMLElement;
    ordreMenu: HTMLElement;
  };

  constructor(store: GameStore) {
    this.store = store;
    this.elements = this.getElements();
    this.setupEventListeners();
    this.setupQueenControls();
  }

  private getElements() {
    return {
      foodValue: document.getElementById('food-value')!,
      materialsValue: document.getElementById('materials-value')!,
      populationValue: document.getElementById('population-value')!,
      healthValue: document.getElementById('health-value')!,
      healthBar: document.getElementById('health-bar')!,
      phaseIndicator: document.getElementById('phase-indicator')!,
      eventsList: document.getElementById('events-list')!,
      playersList: document.getElementById('players-list-content')!,
      pondreBtn: document.getElementById('pondre-btn') as HTMLButtonElement,
      ordreBtn: document.getElementById('ordre-btn') as HTMLButtonElement,
      boostBtn: document.getElementById('boost-btn') as HTMLButtonElement,
      pondreMenu: document.getElementById('pondre-menu')!,
      ordreMenu: document.getElementById('ordre-menu')!
    };
  }

  private setupEventListeners(): void {
    // Écouter les mises à jour d'état
    this.store.addEventListener('stateUpdate', (event: any) => {
      this.updateResources(event.detail);
    });

    // Écouter les mises à jour d'événements
    this.store.addEventListener('eventsUpdate', (event: any) => {
      this.addEvents(event.detail);
    });

    // Écouter les changements de phase
    this.store.addEventListener('phaseUpdate', (event: any) => {
      this.updatePhase(event.detail);
    });

    // Écouter les changements d'état
    this.store.addEventListener('stateUpdate', (event: any) => {
      this.updatePlayers(event.detail.players);
    });
  }

  private setupQueenControls(): void {
    // Bouton Pondre
    this.elements.pondreBtn.addEventListener('click', () => {
      this.toggleMenu(this.elements.pondreMenu);
      this.elements.ordreMenu.style.display = 'none';
    });

    // Bouton Ordre
    this.elements.ordreBtn.addEventListener('click', () => {
      this.toggleMenu(this.elements.ordreMenu);
      this.elements.pondreMenu.style.display = 'none';
    });

    // Bouton Boost
    this.elements.boostBtn.addEventListener('click', () => {
      this.store.sendQueenAction({ type: 'boost', data: {} });
      this.hideAllMenus();
    });

    // Sous-menus Pondre
    this.elements.pondreMenu.querySelectorAll('[data-role]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = (e.target as HTMLElement).getAttribute('data-role');
        if (role) {
          this.store.sendQueenAction({ 
            type: 'pondre', 
            data: { role: role as any } 
          });
          this.hideAllMenus();
        }
      });
    });

    // Sous-menus Ordre
    this.elements.ordreMenu.querySelectorAll('[data-priority]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const priority = (e.target as HTMLElement).getAttribute('data-priority');
        if (priority) {
          this.store.sendQueenAction({ 
            type: 'ordre', 
            data: { priority: priority as any } 
          });
          this.hideAllMenus();
        }
      });
    });

    // Fermer les menus en cliquant ailleurs
    document.addEventListener('click', (e) => {
      if (!this.elements.queenControls?.contains(e.target as Node)) {
        this.hideAllMenus();
      }
    });
  }

  private toggleMenu(menu: HTMLElement): void {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
  }

  private hideAllMenus(): void {
    this.elements.pondreMenu.style.display = 'none';
    this.elements.ordreMenu.style.display = 'none';
  }

  private updateResources(state: GameState): void {
    // Mettre à jour les valeurs
    this.elements.foodValue.textContent = state.food.toString();
    this.elements.materialsValue.textContent = state.materials.toString();
    this.elements.populationValue.textContent = state.population.toString();
    this.elements.healthValue.textContent = state.health.toString();

    // Mettre à jour la barre de santé
    const healthPercent = Math.max(0, Math.min(100, state.health));
    this.elements.healthBar.style.width = `${healthPercent}%`;

    // Changer la couleur de la barre selon la santé
    if (healthPercent > 70) {
      this.elements.healthBar.className = 'resource-fill health-fill';
    } else if (healthPercent > 30) {
      this.elements.healthBar.className = 'resource-fill health-fill warning';
    } else {
      this.elements.healthBar.className = 'resource-fill health-fill danger';
    }
  }

  private updatePhase(phaseData: any): void {
    const { isDay, dayCount, timeRemaining } = phaseData;
    
    this.elements.phaseIndicator.textContent = 
      `${isDay ? 'Jour' : 'Nuit'} ${dayCount} - ${timeRemaining}s`;
    
    this.elements.phaseIndicator.className = 
      `phase-indicator ${isDay ? 'day' : 'night'}`;
  }

  private addEvents(events: GameEvent[]): void {
    events.forEach(event => {
      const eventElement = document.createElement('div');
      eventElement.className = 'event-item';
      
      const timestamp = new Date(event.timestamp).toLocaleTimeString();
      const player = event.player ? ` (${event.player})` : '';
      
      eventElement.innerHTML = `
        <strong>${timestamp}</strong>${player}<br>
        ${event.message}
      `;
      
      // Ajouter des effets visuels selon le type d'événement
      switch (event.type) {
        case 'command':
          eventElement.style.borderLeftColor = '#4CAF50';
          break;
        case 'attack':
          eventElement.style.borderLeftColor = '#F44336';
          break;
        case 'discovery':
          eventElement.style.borderLeftColor = '#FF9800';
          break;
        case 'queen_action':
          eventElement.style.borderLeftColor = '#9C27B0';
          break;
        case 'random':
          eventElement.style.borderLeftColor = '#2196F3';
          break;
      }
      
      this.elements.eventsList.appendChild(eventElement);
      
      // Garder seulement les 5 derniers événements
      while (this.elements.eventsList.children.length > 5) {
        this.elements.eventsList.removeChild(this.elements.eventsList.firstChild!);
      }
      
      // Animation d'apparition
      eventElement.style.opacity = '0';
      eventElement.style.transform = 'translateX(-20px)';
      eventElement.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        eventElement.style.opacity = '1';
        eventElement.style.transform = 'translateX(0)';
      }, 10);
    });
  }

  private updatePlayers(players: PlayerData[]): void {
    this.elements.playersList.innerHTML = '';
    
    const activePlayers = players
      .filter(player => Date.now() - player.lastCommandTs < 300000) // 5 minutes
      .slice(0, 10); // Top 10
    
    activePlayers.forEach(player => {
      const playerElement = document.createElement('div');
      playerElement.className = 'player-item';
      
      const roleIcon = this.getRoleIcon(player.role);
      const timeAgo = this.getTimeAgo(player.lastCommandTs);
      
      playerElement.innerHTML = `
        <span class="role-${player.role}">${roleIcon} ${player.name}</span>
        <span>${timeAgo}</span>
      `;
      
      this.elements.playersList.appendChild(playerElement);
    });
  }

  private getRoleIcon(role: string): string {
    const icons = {
      ouvriere: '🛠️',
      soldat: '⚔️',
      exploratrice: '🔍',
      soigneuse: '💊'
    };
    return icons[role as keyof typeof icons] || '🐜';
  }

  private getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h`;
    }
  }

  public updateConnectionStatus(isConnected: boolean): void {
    const statusElement = document.createElement('div');
    statusElement.style.position = 'fixed';
    statusElement.style.top = '10px';
    statusElement.style.left = '50%';
    statusElement.style.transform = 'translateX(-50%)';
    statusElement.style.padding = '10px';
    statusElement.style.borderRadius = '5px';
    statusElement.style.zIndex = '2000';
    
    if (isConnected) {
      statusElement.style.background = '#4CAF50';
      statusElement.textContent = '🔌 Connecté';
    } else {
      statusElement.style.background = '#F44336';
      statusElement.textContent = '🔌 Déconnecté - Reconnexion...';
    }
    
    document.body.appendChild(statusElement);
    
    setTimeout(() => {
      if (statusElement.parentNode) {
        statusElement.parentNode.removeChild(statusElement);
      }
    }, 3000);
  }
}
