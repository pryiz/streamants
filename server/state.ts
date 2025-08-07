import { GameState, PlayerData, AntRole, GameEvent, CommandResult } from './types';

export class GameStateManager {
  private state: GameState;
  private eventIdCounter = 0;

  constructor() {
    this.state = this.getInitialState();
    this.startGameLoop();
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
      players: new Map()
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public getStateForWS(): any {
    const state = this.getState();
    return {
      ...state,
      players: Array.from(state.players.entries()).map(([name, data]) => ({
        name,
        role: data.role,
        lastCommandTs: data.lastCommandTs
      }))
    };
  }

  private startGameLoop(): void {
    setInterval(() => {
      this.updateDayNight();
      this.updateTimers();
      this.checkRandomEvents();
    }, 1000);
  }

  private updateDayNight(): void {
    this.state.dayNight.timeRemaining--;
    
    if (this.state.dayNight.timeRemaining <= 0) {
      this.state.dayNight.isDay = !this.state.dayNight.isDay;
      this.state.dayNight.timeRemaining = 60;
      
      if (this.state.dayNight.isDay) {
        this.state.dayNight.dayCount++;
      } else {
        this.checkNightAttack();
      }
      
      this.addEvent({
        type: 'phase',
        message: `${this.state.dayNight.isDay ? 'Jour' : 'Nuit'} ${this.state.dayNight.dayCount}`,
        effects: {}
      });
    }
  }

  private updateTimers(): void {
    const now = Date.now();
    
    // Vérifier la fin des boosts
    if (this.state.timers.boostEnd > 0 && now > this.state.timers.boostEnd) {
      this.state.timers.boostEnd = 0;
      this.addEvent({
        type: 'queen_action',
        message: 'Le boost de la Reine s\'est terminé',
        effects: {}
      });
    }
    
    // Vérifier la fin des priorités
    if (this.state.timers.priorityEnd > 0 && now > this.state.timers.priorityEnd) {
      this.state.timers.priorityEnd = 0;
      this.state.priorities.food = false;
      this.state.priorities.build = false;
      this.state.priorities.defense = false;
      this.addEvent({
        type: 'queen_action',
        message: 'Les ordres de la Reine ont expiré',
        effects: {}
      });
    }
  }

  private checkRandomEvents(): void {
    if (Math.random() < 0.02) { // 2% de chance par seconde
      this.triggerRandomEvent();
    }
  }

  private triggerRandomEvent(): void {
    const events = [
      {
        message: 'Une petite attaque d\'araignée !',
        effects: { health: -3 }
      },
      {
        message: 'Découverte de champignons !',
        effects: { food: 5 }
      },
      {
        message: 'Fuite d\'eau mineure détectée',
        effects: { materials: -2 }
      }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    this.addEvent({
      type: 'random',
      message: event.message,
      effects: event.effects
    });
    
    // Appliquer les effets
    this.applyEffects(event.effects);
  }

  private checkNightAttack(): void {
    if (Math.random() < 0.5) { // 50% de chance d'attaque nocturne
      const baseDamage = 5;
      const variance = Math.floor(Math.random() * 5) - 2; // -2 à +2
      const damage = Math.max(1, baseDamage + variance);
      
      // Réduire les dégâts selon les défenses
      const defense = this.state.rolesCap.soldat * 0.5;
      const finalDamage = Math.max(1, damage - defense);
      
      this.addEvent({
        type: 'attack',
        message: `Attaque nocturne ! Dégâts: ${finalDamage}`,
        effects: { health: -finalDamage }
      });
      
      this.applyEffects({ health: -finalDamage });
    }
  }

  public processCommand(username: string, command: string): CommandResult {
    const player = this.getOrCreatePlayer(username);
    const now = Date.now();
    
    // Vérifier le cooldown général (5 secondes)
    if (now - player.lastCommandTs < 5000) {
      return {
        success: false,
        message: 'Attendez avant de donner un autre ordre'
      };
    }
    
    // Vérifier les cooldowns spécifiques
    const cooldown = player.cooldowns.get(command);
    if (cooldown && now < cooldown) {
      return {
        success: false,
        message: 'Cette action est en cooldown'
      };
    }
    
    player.lastCommandTs = now;
    
    // Traiter la commande selon le rôle
    const result = this.executeCommand(player, command);
    
    if (result.success) {
      this.addEvent({
        type: 'command',
        player: username,
        role: player.role,
        command: command,
        message: result.message,
        effects: result.effects || {}
      });
      
      if (result.effects) {
        this.applyEffects(result.effects);
      }
      
      if (result.cooldown) {
        player.cooldowns.set(command, now + result.cooldown * 1000);
      }
    }
    
    return result;
  }

  private executeCommand(player: PlayerData, command: string): CommandResult {
    const isDay = this.state.dayNight.isDay;
    const boost = this.state.timers.boostEnd > Date.now();
    const multiplier = boost ? 1.25 : 1;
    
    switch (command) {
      case '!role':
        return {
          success: true,
          message: `Vous êtes ${player.role}`
        };
        
      case '!stats':
        return {
          success: true,
          message: `Nourriture: ${this.state.food}, Matériaux: ${this.state.materials}, Population: ${this.state.population}, Santé: ${this.state.health}`
        };
        
      case '!ramener':
        if (player.role !== 'ouvriere') {
          return { success: false, message: 'Seules les ouvrières peuvent ramener des ressources' };
        }
        if (!isDay) {
          return { success: false, message: 'Les ouvrières ne travaillent que le jour' };
        }
        
        const foodGain = Math.floor((Math.random() < 0.7 ? 2 : 1) * multiplier);
        const materialGain = Math.floor((Math.random() < 0.3 ? 1 : 0) * multiplier);
        
        return {
          success: true,
          message: `Ouvrière ${player.name} ramène des ressources`,
          effects: { food: foodGain, materials: materialGain }
        };
        
      case '!construire':
        if (player.role !== 'ouvriere') {
          return { success: false, message: 'Seules les ouvrières peuvent construire' };
        }
        if (this.state.materials < 2) {
          return { success: false, message: 'Pas assez de matériaux pour construire' };
        }
        
        return {
          success: true,
          message: `Ouvrière ${player.name} construit des défenses`,
          effects: { materials: -2 },
          cooldown: 10
        };
        
      case '!creuser':
        if (player.role !== 'ouvriere') {
          return { success: false, message: 'Seules les ouvrières peuvent creuser' };
        }
        
        return {
          success: true,
          message: `Ouvrière ${player.name} creuse de nouveaux tunnels`,
          cooldown: 15
        };
        
      case '!attaquer':
        if (player.role !== 'soldat') {
          return { success: false, message: 'Seuls les soldats peuvent attaquer' };
        }
        if (isDay) {
          return { success: false, message: 'Les soldats n\'attaquent que la nuit' };
        }
        
        return {
          success: true,
          message: `Soldat ${player.name} attaque les ennemis`,
          cooldown: 8
        };
        
      case '!patrouiller':
        if (player.role !== 'soldat') {
          return { success: false, message: 'Seuls les soldats peuvent patrouiller' };
        }
        
        return {
          success: true,
          message: `Soldat ${player.name} patrouille`,
          cooldown: 12
        };
        
      case '!scouter':
        if (player.role !== 'exploratrice') {
          return { success: false, message: 'Seules les exploratrices peuvent scouter' };
        }
        if (!isDay) {
          return { success: false, message: 'Les exploratrices ne partent que le jour' };
        }
        
        if (Math.random() < 0.2) {
          const discovery = Math.random() < 0.5 ? { food: 3 } : { materials: 2 };
          return {
            success: true,
            message: `Exploratrice ${player.name} découvre des ressources !`,
            effects: discovery,
            cooldown: 20
          };
        }
        
        return {
          success: true,
          message: `Exploratrice ${player.name} explore sans rien trouver`,
          cooldown: 15
        };
        
      case '!signaler':
        if (player.role !== 'exploratrice') {
          return { success: false, message: 'Seules les exploratrices peuvent signaler' };
        }
        
        return {
          success: true,
          message: `Exploratrice ${player.name} signale une zone`,
          cooldown: 10
        };
        
      case '!soigner':
        if (player.role !== 'soigneuse') {
          return { success: false, message: 'Seules les soigneuses peuvent soigner' };
        }
        if (this.state.health >= 100) {
          return { success: false, message: 'La colonie est déjà en parfaite santé' };
        }
        
        return {
          success: true,
          message: `Soigneuse ${player.name} soigne la colonie`,
          effects: { health: 2 },
          cooldown: 10
        };
        
      case '!nourrir':
        if (player.role !== 'soigneuse') {
          return { success: false, message: 'Seules les soigneuses peuvent nourrir' };
        }
        if (this.state.food < 1) {
          return { success: false, message: 'Pas assez de nourriture' };
        }
        
        return {
          success: true,
          message: `Soigneuse ${player.name} nourrit la colonie`,
          effects: { food: -1, health: 1 },
          cooldown: 8
        };
        
      default:
        return { success: false, message: 'Commande inconnue' };
    }
  }

  public processQueenAction(action: any): CommandResult {
    const now = Date.now();
    
    switch (action.type) {
      case 'pondre':
        const role = action.data.role;
        if (!role || !this.state.rolesCap[role]) {
          return { success: false, message: 'Rôle invalide' };
        }
        
        this.state.population++;
        this.state.rolesCap[role]++;
        
        return {
          success: true,
          message: `La Reine pond une nouvelle ${role}`,
          effects: { population: 1 }
        };
        
      case 'ordre':
        const priority = action.data.priority;
        if (!priority || !['food', 'build', 'defense'].includes(priority)) {
          return { success: false, message: 'Priorité invalide' };
        }
        
        this.state.priorities.food = priority === 'food';
        this.state.priorities.build = priority === 'build';
        this.state.priorities.defense = priority === 'defense';
        this.state.timers.priorityEnd = now + 30000; // 30 secondes
        
        return {
          success: true,
          message: `La Reine ordonne de prioriser ${priority}`,
          effects: {}
        };
        
      case 'boost':
        if (this.state.timers.boostEnd > now) {
          return { success: false, message: 'Le boost est déjà actif' };
        }
        
        this.state.timers.boostEnd = now + 30000; // 30 secondes
        
        return {
          success: true,
          message: 'La Reine active un boost !',
          effects: {}
        };
        
      default:
        return { success: false, message: 'Action invalide' };
    }
  }

  private getOrCreatePlayer(username: string): PlayerData {
    if (!this.state.players.has(username)) {
      // Assigner un rôle selon la disponibilité
      let role: AntRole = 'ouvriere';
      const roles: AntRole[] = ['ouvriere', 'soldat', 'exploratrice', 'soigneuse'];
      
      for (const r of roles) {
        const count = Array.from(this.state.players.values()).filter(p => p.role === r).length;
        if (count < this.state.rolesCap[r]) {
          role = r;
          break;
        }
      }
      
      this.state.players.set(username, {
        name: username,
        role,
        lastCommandTs: 0,
        cooldowns: new Map()
      });
    }
    
    return this.state.players.get(username)!;
  }

  private applyEffects(effects: Partial<GameEvent['effects']>): void {
    if (effects.food) this.state.food = Math.max(0, this.state.food + effects.food);
    if (effects.materials) this.state.materials = Math.max(0, this.state.materials + effects.materials);
    if (effects.health) this.state.health = Math.max(0, Math.min(100, this.state.health + effects.health));
    if (effects.population) this.state.population = Math.max(0, this.state.population + effects.population);
  }

  private addEvent(event: Omit<GameEvent, 'id' | 'timestamp'>): void {
    const gameEvent: GameEvent = {
      id: `event_${++this.eventIdCounter}`,
      timestamp: Date.now(),
      ...event
    };
    
    this.state.recentEvents.push(gameEvent);
    
    // Garder seulement les 10 derniers événements
    if (this.state.recentEvents.length > 10) {
      this.state.recentEvents.shift();
    }
  }

  public getRecentEvents(): GameEvent[] {
    return [...this.state.recentEvents];
  }

  public getActivePlayers(): PlayerData[] {
    const now = Date.now();
    const activePlayers = Array.from(this.state.players.values())
      .filter(player => now - player.lastCommandTs < 300000); // 5 minutes
    
    return activePlayers.slice(0, 10); // Top 10
  }
}
