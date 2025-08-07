import { WebSocketServer, WebSocket } from 'ws';
import { GameStateManager } from './state';
import { WebSocketMessage, GameEvent } from './types';

export class WebSocketManager {
  private wss: WebSocketServer;
  private gameState: GameStateManager;
  private clients: Set<WebSocket> = new Set();

  constructor(gameState: GameStateManager, port: number) {
    this.gameState = gameState;
    this.wss = new WebSocketServer({ port });
    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('🔌 Nouveau client WebSocket connecté');
      this.clients.add(ws);

      // Envoyer l'état initial
      this.sendToClient(ws, {
        type: 'state',
        data: this.gameState.getStateForWS()
      });

      // Envoyer les événements récents
      const recentEvents = this.gameState.getRecentEvents();
      if (recentEvents.length > 0) {
        this.sendToClient(ws, {
          type: 'event',
          data: recentEvents
        });
      }

      ws.on('message', (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(ws, message);
        } catch (error) {
          console.error('❌ Erreur parsing message WebSocket:', error);
        }
      });

      ws.on('close', () => {
        console.log('🔌 Client WebSocket déconnecté');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('❌ Erreur WebSocket:', error);
        this.clients.delete(ws);
      });
    });

    console.log(`🔌 Serveur WebSocket démarré sur le port ${this.wss.options.port}`);
  }

  private handleClientMessage(ws: WebSocket, message: any): void {
    switch (message.type) {
      case 'queen_action':
        // Traiter les actions de la Reine depuis le frontend
        const result = this.gameState.processQueenAction(message.data);
        this.broadcast({
          type: 'event',
          data: [{
            id: `queen_${Date.now()}`,
            timestamp: Date.now(),
            type: 'queen_action',
            message: result.message,
            effects: result.effects || {}
          }]
        });
        break;

      case 'ping':
        this.sendToClient(ws, { type: 'pong', data: Date.now() });
        break;

      default:
        console.log('❓ Message WebSocket inconnu:', message.type);
    }
  }

  public broadcast(message: WebSocketMessage): void {
    const messageStr = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  public broadcastEvent(event: GameEvent): void {
    this.broadcast({
      type: 'event',
      data: [event]
    });
  }

  public broadcastState(): void {
    this.broadcast({
      type: 'state',
      data: this.gameState.getStateForWS()
    });
  }

  public broadcastPhaseChange(isDay: boolean, dayCount: number): void {
    this.broadcast({
      type: 'phase',
      data: {
        isDay,
        dayCount,
        message: `${isDay ? 'Jour' : 'Nuit'} ${dayCount}`
      }
    });
  }

  private sendToClient(ws: WebSocket, message: WebSocketMessage): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }

  public close(): void {
    this.wss.close();
  }
}
