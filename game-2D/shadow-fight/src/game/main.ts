import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1e1e1e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
          y: 500,
          x: 0
      },
      debug: true
    }
  },
  scene: [GameScene],
  parent: undefined // Will be set by React
};

export default config;
