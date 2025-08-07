import { GameStateManager } from './state';
import { TwitchMessage, CommandResult } from './types';

export class CommandManager {
  private gameState: GameStateManager;

  constructor(gameState: GameStateManager) {
    this.gameState = gameState;
  }

  public processMessage(twitchMessage: TwitchMessage): void {
    const { username, message } = twitchMessage;
    
    // Ignorer les messages qui ne commencent pas par !
    if (!message.startsWith('!')) {
      return;
    }

    // Extraire la commande
    const command = message.toLowerCase().trim();
    
    // Traiter la commande
    const result = this.gameState.processCommand(username, command);
    
    // Logger le résultat
    if (result.success) {
      console.log(`✅ ${username}: ${command} - ${result.message}`);
    } else {
      console.log(`❌ ${username}: ${command} - ${result.message}`);
    }
  }

  public processQueenAction(action: any): CommandResult {
    const result = this.gameState.processQueenAction(action);
    
    if (result.success) {
      console.log(`👑 Reine: ${action.type} - ${result.message}`);
    } else {
      console.log(`❌ Reine: ${action.type} - ${result.message}`);
    }
    
    return result;
  }

  public getHelpMessage(): string {
    return `
🐜 Commandes Fourmilière Royale:

📋 Universelles:
  !role - Voir votre rôle
  !stats - Voir les statistiques

🛠️ Ouvrière:
  !creuser - Creuser des tunnels
  !ramener - Ramener des ressources
  !construire - Construire des défenses

⚔️ Soldat:
  !patrouiller - Patrouiller
  !attaquer - Attaquer (nuit uniquement)

🔍 Exploratrice:
  !scouter - Explorer de nouvelles zones
  !signaler - Signaler des ressources

💊 Soigneuse:
  !soigner - Soigner la colonie
  !nourrir - Nourrir la colonie
    `.trim();
  }
}
