import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from './game.service';

export interface Player {
  id: string;
  x: number;
  y: number;
  angle: number;
  color: string;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  angle: number;
  playerId: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  bullets: Bullet[] = [];
  currentPlayer: Player | null = null;
  keys: { [key: string]: boolean } = {};
  gameStarted = false;
  
  // Make Math available in template
  Math = Math;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.connect();
    
    this.gameService.onGameState().subscribe((gameState) => {
      this.players = gameState.players;
      this.bullets = gameState.bullets;
      this.currentPlayer = this.players.find(p => p.id === this.gameService.getPlayerId()) || null;
    });

    this.gameService.onPlayerJoined().subscribe((player) => {
      if (player) {
        this.players.push(player);
      }
    });

    this.gameService.onPlayerLeft().subscribe((playerId) => {
      this.players = this.players.filter(p => p.id !== playerId);
    });

    this.gameService.onPlayerMoved().subscribe((playerData) => {
      const player = this.players.find(p => p.id === playerData.id);
      if (player) {
        player.x = playerData.x;
        player.y = playerData.y;
        player.angle = playerData.angle;
      }
    });

    this.gameService.onBulletShot().subscribe((bullet) => {
      if (bullet) {
        this.bullets.push(bullet);
      }
    });

    this.gameService.onBulletRemoved().subscribe((bulletId) => {
      this.bullets = this.bullets.filter(b => b.id !== bulletId);
    });

    // Start game loop
    this.startGameLoop();
  }

  ngOnDestroy() {
    this.gameService.disconnect();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.keys[event.key.toLowerCase()] = true;
    event.preventDefault();
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.keys[event.key.toLowerCase()] = false;
    event.preventDefault();
  }

  startGameLoop() {
    const gameLoop = () => {
      if (this.currentPlayer) {
        this.handleInput();
      }
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }

  handleInput() {
    if (!this.currentPlayer) return;

    const speed = 3;
    const rotationSpeed = 0.05;
    let newX = this.currentPlayer.x;
    let newY = this.currentPlayer.y;
    let newAngle = this.currentPlayer.angle;

    // Movement
    if (this.keys['w'] || this.keys['arrowup']) {
      newX += Math.cos(newAngle) * speed;
      newY += Math.sin(newAngle) * speed;
    }
    if (this.keys['s'] || this.keys['arrowdown']) {
      newX -= Math.cos(newAngle) * speed;
      newY -= Math.sin(newAngle) * speed;
    }
    if (this.keys['a'] || this.keys['arrowleft']) {
      newAngle -= rotationSpeed;
    }
    if (this.keys['d'] || this.keys['arrowright']) {
      newAngle += rotationSpeed;
    }

    // Shoot
    if (this.keys[' ']) {
      this.shoot();
    }

    // Update player position
    this.currentPlayer.x = newX;
    this.currentPlayer.y = newY;
    this.currentPlayer.angle = newAngle;

    // Send update to server
    this.gameService.movePlayer(newX, newY, newAngle);
  }

  shoot() {
    if (!this.currentPlayer) return;
    
    const bulletX = this.currentPlayer.x + Math.cos(this.currentPlayer.angle) * 40;
    const bulletY = this.currentPlayer.y + Math.sin(this.currentPlayer.angle) * 40;
    
    this.gameService.shoot(bulletX, bulletY, this.currentPlayer.angle);
  }

  startGame() {
    this.gameStarted = true;
  }
}
