import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Player, Bullet } from './game.component';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket: Socket;
  private playerId: string | null = null;

  private gameStateSubject = new BehaviorSubject<{ players: Player[], bullets: Bullet[] }>({
    players: [],
    bullets: []
  });

  private playerJoinedSubject = new BehaviorSubject<Player | null>(null);
  private playerLeftSubject = new BehaviorSubject<string | null>(null);
  private playerMovedSubject = new BehaviorSubject<any>(null);
  private bulletShotSubject = new BehaviorSubject<Bullet | null>(null);
  private bulletRemovedSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Connected to game server');
      this.playerId = this.socket.id || null;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from game server');
      this.playerId = null;
    });

    this.socket.on('gameState', (gameState) => {
      this.gameStateSubject.next(gameState);
    });

    this.socket.on('playerJoined', (player) => {
      this.playerJoinedSubject.next(player);
    });

    this.socket.on('playerLeft', (playerId) => {
      this.playerLeftSubject.next(playerId);
    });

    this.socket.on('playerMoved', (playerData) => {
      this.playerMovedSubject.next(playerData);
    });

    this.socket.on('bulletShot', (bullet) => {
      this.bulletShotSubject.next(bullet);
    });

    this.socket.on('bulletRemoved', (bulletId) => {
      this.bulletRemovedSubject.next(bulletId);
    });
  }

  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    this.socket.disconnect();
  }

  movePlayer(x: number, y: number, angle: number) {
    this.socket.emit('playerMove', { x, y, angle });
  }

  shoot(x: number, y: number, angle: number) {
    this.socket.emit('shoot', { x, y, angle });
  }

  getPlayerId(): string | null {
    return this.playerId;
  }

  onGameState(): Observable<{ players: Player[], bullets: Bullet[] }> {
    return this.gameStateSubject.asObservable();
  }

  onPlayerJoined(): Observable<Player | null> {
    return this.playerJoinedSubject.asObservable();
  }

  onPlayerLeft(): Observable<string | null> {
    return this.playerLeftSubject.asObservable();
  }

  onPlayerMoved(): Observable<any> {
    return this.playerMovedSubject.asObservable();
  }

  onBulletShot(): Observable<Bullet | null> {
    return this.bulletShotSubject.asObservable();
  }

  onBulletRemoved(): Observable<string | null> {
    return this.bulletRemovedSubject.asObservable();
  }
}
