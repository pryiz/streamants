import { GameState, GameEvent, WebSocketMessage, QueenAction } from './types';

export class GameStore extends EventTarget {
  private state: GameState;
  private ws: WebSocket | null = null;
  private reconnectInterval: number | null = null;
  private pingInterval: number | null = null;

  constructor() {
    super();
    this.state = this.getInitialState();
    this.connectWebSocket();
  }

  private getInitialState(): GameState {
    return {
      food: 50,
      materials: 20,
      population: 10,
      health: 100,
      
      rolesCap: {
        ouvriere: 10,
        soldat: 10,
        exploratrice: 5,
        soigneuse: 5
      },
      
      priorities: {
        food: false,
        build: false,
        defense: false
      },
      
      dayNight: {
        isDay: true,
        timeRemaining: 60,
        dayCount: 1
      },
      
      timers: {
        boostEnd: 0,
        priorityEnd: 0,
        lastAttack: 0
      },
      
      recentEvents: [],
      players: []
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  private connectWebSocket(): void {
    const wsUrl = `ws://localhost:8080`;
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('🔌 Connecté au serveur WebSocket');
        this.startPingInterval();
        this.dispatchEvent(new CustomEvent('connected'));
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.handleWebSocketMessage(message);
        } catch (error) {
          console.error('❌ Erreur parsing message WebSocket:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('🔌 Déconnecté du serveur WebSocket');
        this.stopPingInterval();
        this.scheduleReconnect();
        this.dispatchEvent(new CustomEvent('disconnected'));
      };
      
      this.ws.onerror = (error) => {
        console.error('❌ Erreur WebSocket:', error);
      };
      
    } catch (error) {
      console.error('❌ Erreur connexion WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private handleWebSocketMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'state':
        this.updateState(message.data);
        this.dispatchEvent(new CustomEvent('stateUpdate', { detail: this.state }));
        break;
        
      case 'event':
        this.addEvents(message.data);
        this.dispatchEvent(new CustomEvent('eventsUpdate', { detail: message.data }));
        break;
        
      case 'phase':
        this.updatePhase(message.data);
        this.dispatchEvent(new CustomEvent('phaseUpdate', { detail: message.data }));
        break;
        
      case 'error':
        console.error('❌ Erreur serveur:', message.data);
        this.dispatchEvent(new CustomEvent('error', { detail: message.data }));
        break;
        
      case 'pong':
        // Réponse au ping, pas d'action nécessaire
        break;
        
      default:
        console.log('❓ Message WebSocket inconnu:', message.type);
    }
  }

  private updateState(newState: Partial<GameState>): void {
    this.state = { ...this.state, ...newState };
  }

  private addEvents(events: GameEvent[]): void {
    if (Array.isArray(events)) {
      this.state.recentEvents.push(...events);
      
      // Garder seulement les 10 derniers événements
      if (this.state.recentEvents.length > 10) {
        this.state.recentEvents = this.state.recentEvents.slice(-10);
      }
    }
  }

  private updatePhase(phaseData: any): void {
    if (phaseData.isDay !== undefined) {
      this.state.dayNight.isDay = phaseData.isDay;
    }
    if (phaseData.dayCount !== undefined) {
      this.state.dayNight.dayCount = phaseData.dayCount;
    }
  }

  private startPingInterval(): void {
    this.pingInterval = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping toutes les 30 secondes
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }
    
    this.reconnectInterval = window.setTimeout(() => {
      console.log('🔄 Tentative de reconnexion...');
      this.connectWebSocket();
    }, 5000); // Reconnecter après 5 secondes
  }

  public sendQueenAction(action: QueenAction): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'queen_action',
        data: action
      }));
    } else {
      console.error('❌ WebSocket non connecté');
    }
  }

  public getRecentEvents(): GameEvent[] {
    return [...this.state.recentEvents];
  }

  public getActivePlayers(): PlayerData[] {
    const now = Date.now();
    return this.state.players
      .filter(player => now - player.lastCommandTs < 300000) // 5 minutes
      .slice(0, 10); // Top 10
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public destroy(): void {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}
