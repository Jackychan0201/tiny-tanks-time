# 🎮 Tiny Tanks Time - Multiplayer Tank Game

A real-time multiplayer tank battle game built with Angular frontend and NestJS backend using WebSockets.

## 🚀 Features

- **Real-time multiplayer** - Multiple players can join and play simultaneously
- **CSS-based tank graphics** - Beautiful circular tanks with CSS styling
- **WebSocket communication** - Low-latency real-time updates
- **Smooth controls** - WASD/Arrow keys for movement, Space to shoot
- **Modern UI** - Gradient backgrounds and smooth animations
- **Collision boundaries** - Tanks stay within game field
- **Bullet system** - Shoot and track bullets in real-time

## 🛠️ Tech Stack

### Frontend (Angular)
- Angular 20.3.0
- Socket.io-client for WebSocket communication
- CSS animations and gradients
- TypeScript

### Backend (NestJS)
- NestJS 10.0.2
- Socket.io for WebSocket server
- TypeScript
- CORS enabled for cross-origin requests

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server
```bash
# In one terminal
nx serve server
```
The server will run on `http://localhost:3000`

### 3. Start the Frontend
```bash
# In another terminal
nx serve tiny-tanks-time
```
The frontend will run on `http://localhost:4200`

### 4. Open Multiple Browser Tabs
Open `http://localhost:4200` in multiple browser tabs to test multiplayer functionality.

## 🎮 How to Play

### Controls
- **WASD** or **Arrow Keys** - Move your tank
- **Space** - Shoot bullets
- **Mouse** - Not used (keyboard-only game)

### Gameplay
1. Click "Start Game" to begin
2. Your tank appears as a circular shape with a cannon
3. Move around the game field using WASD or arrow keys
4. Press Space to shoot bullets
5. Other players will see your tank in real-time
6. Try to avoid other players' bullets!

## 🏗️ Project Structure

```
apps/
├── server/                 # NestJS backend
│   └── src/app/
│       ├── game.gateway.ts # WebSocket gateway
│       ├── app.module.ts   # Main module
│       └── main.ts         # Server entry point
└── tiny-tanks-time/        # Angular frontend
    └── src/app/
        └── game/
            ├── game.component.ts    # Main game component
            ├── game.component.html  # Game template
            ├── game.component.css   # Game styles
            └── game.service.ts      # WebSocket service
```

## 🔧 Development Tips

### 1. WebSocket Communication
- The game uses Socket.io for real-time communication
- Events: `playerMove`, `shoot`, `playerJoined`, `playerLeft`, etc.
- All game state is synchronized across all connected clients

### 2. Game Loop
- Uses `requestAnimationFrame` for smooth 60fps updates
- Input handling is done in the game loop for responsive controls
- Server validates positions and enforces game boundaries

### 3. Styling
- Tanks are pure CSS circles with gradients and shadows
- Current player has a golden border for identification
- Bullets have a glowing animation effect
- Responsive design with modern UI elements

### 4. Performance Considerations
- Bullets are automatically removed after 3 seconds
- Player positions are bounded to prevent going off-screen
- Smooth transitions for all movements

## 🚀 Future Enhancements

### Easy Additions
1. **Player Names** - Add text labels above tanks
2. **Score System** - Track hits and wins
3. **Power-ups** - Speed boosts, rapid fire, etc.
4. **Sound Effects** - Add audio for shooting and movement
5. **Chat System** - Allow players to communicate

### Advanced Features
1. **Room System** - Create/join different game rooms
2. **Spectator Mode** - Watch games without playing
3. **Replay System** - Record and playback games
4. **Mobile Support** - Touch controls for mobile devices
5. **AI Players** - Add computer-controlled tanks

### Technical Improvements
1. **Collision Detection** - Bullet-to-tank collisions
2. **Health System** - Tanks can be destroyed
3. **Map System** - Different game maps/obstacles
4. **Database Integration** - Store player stats and game history
5. **Deployment** - Docker containers and cloud deployment

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Ensure the server is running on port 3000
   - Check CORS settings in the server
   - Verify firewall settings

2. **Tanks Not Moving Smoothly**
   - Check browser console for errors
   - Ensure WebSocket connection is established
   - Verify game loop is running

3. **Multiple Players Not Syncing**
   - Open multiple browser tabs/windows
   - Clear browser cache if needed
   - Check network connectivity

### Debug Mode
- Open browser DevTools (F12)
- Check Console tab for WebSocket messages
- Monitor Network tab for WebSocket connections

## 📝 Code Quality

- **TypeScript** - Full type safety throughout
- **ESLint** - Code linting and formatting
- **Modular Design** - Separated concerns between frontend/backend
- **Error Handling** - Graceful WebSocket disconnection handling
- **Performance** - Optimized game loop and rendering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development!

---

**Happy Tank Battling! 🎮💥**
