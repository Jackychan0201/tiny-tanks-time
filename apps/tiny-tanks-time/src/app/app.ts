import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';

@Component({
  imports: [GameComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'tiny-tanks-time';
}
