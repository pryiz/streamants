export interface GameState {
  // Ressources
  food: number;
  materials: number;
  population: number;
  health: number;
  
  // Rôles et population
  rolesCap: {
    ouvriere: number;
    soldat: number;
    exploratrice: number;
    soigneuse: number;
  };
  
  // Priorités et boosts
  priorities: {
    food: boolean;
    build: boolean;
    defense: boolean;
  };
  
  // Phase jour/nuit
  dayNight: {
    isDay: boolean;
    timeRemaining: number;
    dayCount: number;
  };
  
  // Timers et cooldowns
  timers: {
    boostEnd: number;
    priorityEnd: number;
    lastAttack: number;
  };
  
  // Événements récents
  recentEvents: GameEvent[];
  
  // Joueurs connectés
  players: Map<string, PlayerData>;
}

export interface PlayerData {
  name: string;
  role: AntRole;
  lastCommandTs: number;
  cooldowns: Map<string, number>;
}

export type AntRole = 'ouvriere' | 'soldat' | 'exploratrice' | 'soigneuse';

export interface GameEvent {
  id: string;
  timestamp: number;
  type: 'command' | 'attack' | 'discovery' | 'queen_action' | 'random';
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
  type: 'state' | 'event' | 'phase' | 'error';
  data: any;
}

export interface CommandResult {
  success: boolean;
  message: string;
  effects?: Partial<GameEvent['effects']>;
  cooldown?: number;
}

export interface TwitchMessage {
  username: string;
  message: string;
  channel: string;
}

export interface QueenAction {
  type: 'pondre' | 'ordre' | 'boost';
  data: {
    role?: AntRole;
    priority?: 'food' | 'build' | 'defense';
  };
}
