import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

export interface Player {
  id: string;
  x: number;
  y: number;
  angle: number;
  color: string;
}

export interface GameState {
  players: Map<string, Player>;
  bullets: Array<{
    id: string;
    x: number;
    y: number;
    angle: number;
    playerId: string;
  }>;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('GameGateway');
  private gameState: GameState = {
    players: new Map(),
    bullets: [],
  };

  private colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Create a new player
    const player: Player = {
      id: client.id,
      x: Math.random() * 800 + 100, // Random position between 100-900
      y: Math.random() * 600 + 100, // Random position between 100-700
      angle: 0,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
    };

    this.gameState.players.set(client.id, player);
    
    // Send current game state to the new player
    client.emit('gameState', {
      players: Array.from(this.gameState.players.values()),
      bullets: this.gameState.bullets,
    });

    // Notify all other players about the new player
    client.broadcast.emit('playerJoined', player);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Remove player from game state
    this.gameState.players.delete(client.id);
    
    // Remove player's bullets
    this.gameState.bullets = this.gameState.bullets.filter(
      bullet => bullet.playerId !== client.id
    );

    // Notify all other players
    this.server.emit('playerLeft', client.id);
  }

  @SubscribeMessage('playerMove')
  handlePlayerMove(
    @MessageBody() data: { x: number; y: number; angle: number },
    @ConnectedSocket() client: Socket,
  ) {
    const player = this.gameState.players.get(client.id);
    if (player) {
      // Update player position with bounds checking
      player.x = Math.max(50, Math.min(950, data.x));
      player.y = Math.max(50, Math.min(650, data.y));
      player.angle = data.angle;

      // Broadcast updated position to all other players
      client.broadcast.emit('playerMoved', {
        id: client.id,
        x: player.x,
        y: player.y,
        angle: player.angle,
      });
    }
  }

  @SubscribeMessage('shoot')
  handleShoot(
    @MessageBody() data: { x: number; y: number; angle: number },
    @ConnectedSocket() client: Socket,
  ) {
    const bullet = {
      id: `${client.id}-${Date.now()}`,
      x: data.x,
      y: data.y,
      angle: data.angle,
      playerId: client.id,
    };

    this.gameState.bullets.push(bullet);

    // Broadcast bullet to all players
    this.server.emit('bulletShot', bullet);

    // Remove bullet after 3 seconds
    setTimeout(() => {
      this.gameState.bullets = this.gameState.bullets.filter(b => b.id !== bullet.id);
      this.server.emit('bulletRemoved', bullet.id);
    }, 3000);
  }
}
