import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  health: number = 3;
  lastShot: number = 0;
  shootCooldown: number = 300;
  facing: number = 1; // 1: right, -1: left

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(40, 60);
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    // Draw a simple human-like shape using graphics texture
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x4fc3f7, 1);
    // Body
    graphics.fillRect(0, 10, 40, 40);
    // Head
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(20, 10, 10);
    // Arms
    graphics.lineStyle(4, 0x4fc3f7, 1);
    graphics.beginPath();
    graphics.moveTo(0, 25);
    graphics.lineTo(40, 25);
    graphics.strokePath();
    // Legs
    graphics.lineStyle(4, 0x4fc3f7, 1);
    graphics.beginPath();
    graphics.moveTo(10, 50);
    graphics.lineTo(10, 60);
    graphics.moveTo(30, 50);
    graphics.lineTo(30, 60);
    graphics.strokePath();
    // Generate texture
    const key = 'player-tex';
    graphics.generateTexture(key, 40, 60);
    graphics.destroy();
    this.setTexture(key);
    this.setTint(0xffffff);
  }

  // Helper to get bullet spawn position (at player's hand, offset in facing direction)
  getBulletSpawn(target?: Phaser.GameObjects.Sprite): { x: number; y: number; angle: number; dx: number; dy: number } {
    if (target) {
      // Aim at enemy
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const angle = Math.atan2(dy, dx);
      return {
        x: this.x + Math.cos(angle) * (this.displayWidth / 2 + 8),
        y: this.y + Math.sin(angle) * (this.displayWidth / 2 + 8),
        angle,
        dx,
        dy
      };
    }
    // Default: straight right/left
    return {
      x: this.x + this.facing * (this.displayWidth / 2 + 8),
      y: this.y,
      angle: this.facing === 1 ? 0 : Math.PI,
      dx: this.facing,
      dy: 0
    };
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    // Simple walking animation: swing arms/legs and squash/stretch
    if (this.body && Math.abs(this.body.velocity.x) > 10 && this.body.blocked.down) {
      this.setAngle(Math.sin(time / 100) * 10);
      this.setScale(1 + Math.abs(Math.sin(time / 200)) * 0.1, 1);
    } else {
      this.setAngle(0);
      this.setScale(1, 1);
    }
  }

  // Update facing direction on last horizontal input
  handleInput(cursors: Phaser.Types.Input.Keyboard.CursorKeys, shootKey: Phaser.Input.Keyboard.Key, time: number, shootCallback: () => void) {
    const speed = 200;
    if (cursors.left?.isDown) {
      this.setVelocityX(-speed);
      this.facing = -1;
    } else if (cursors.right?.isDown) {
      this.setVelocityX(speed);
      this.facing = 1;
    } else {
      this.setVelocityX(0);
      // Do not change facing if standing still
    }
    if ((cursors.up?.isDown || cursors.space?.isDown) && this.body && this.body.blocked.down) {
      this.setVelocityY(-350);
    }
    if (Phaser.Input.Keyboard.JustDown(shootKey) && time > this.lastShot + this.shootCooldown) {
      shootCallback();
      this.lastShot = time;
    }
  }
}
