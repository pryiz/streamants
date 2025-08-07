export interface GameState {
  food: number;
  materials: number;
  population: number;
  health: number;
  
  rolesCap: {
    ouvriere: number;
    soldat: number;
    exploratrice: number;
    soigneuse: number;
  };
  
  priorities: {
    food: boolean;
    build: boolean;
    defense: boolean;
  };
  
  dayNight: {
    isDay: boolean;
    timeRemaining: number;
    dayCount: number;
  };
  
  timers: {
    boostEnd: number;
    priorityEnd: number;
    lastAttack: number;
  };
  
  recentEvents: GameEvent[];
  players: PlayerData[];
}

export interface PlayerData {
  name: string;
  role: AntRole;
  lastCommandTs: number;
}

export type AntRole = 'ouvriere' | 'soldat' | 'exploratrice' | 'soigneuse';

export interface GameEvent {
  id: string;
  timestamp: number;
  type: 'command' | 'attack' | 'discovery' | 'queen_action' | 'random' | 'phase';
  player?: string;
  role?: AntRole;
  command?: string;
  message: string;
  effects: {
    food?: number;
    materials?: number;
    health?: number;
    population?: number;
  };
}

export interface WebSocketMessage {
  type: 'state' | 'event' | 'phase' | 'error' | 'pong';
  data: any;
}

export interface QueenAction {
  type: 'pondre' | 'ordre' | 'boost';
  data: {
    role?: AntRole;
    priority?: 'food' | 'build' | 'defense';
  };
}

export interface AntColonyRoom {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  label: string;
}

export interface Ant {
  id: string;
  x: number;
  y: number;
  role: AntRole;
  targetX?: number;
  targetY?: number;
  isMoving: boolean;
}
