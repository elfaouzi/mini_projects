import Phaser from 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  health: number = 2;
  patrolDir: number = 1;
  patrolSpeed: number = 80;
  chaseSpeed: number = 140;
  isChasing: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, '');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(40, 50);
    this.setCollideWorldBounds(true);
    this.setBounce(0.1);
    // Draw a simple human-like enemy using graphics texture
    const graphics = scene.add.graphics();
    graphics.fillStyle(0xe57373, 1);
    // Body
    graphics.fillRect(0, 10, 40, 30);
    // Head
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(20, 10, 10);
    // Arms
    graphics.lineStyle(4, 0xe57373, 1);
    graphics.beginPath();
    graphics.moveTo(0, 20);
    graphics.lineTo(40, 20);
    graphics.strokePath();
    // Legs
    graphics.lineStyle(4, 0xe57373, 1);
    graphics.beginPath();
    graphics.moveTo(10, 40);
    graphics.lineTo(10, 50);
    graphics.moveTo(30, 40);
    graphics.lineTo(30, 50);
    graphics.strokePath();
    // Generate texture
    const key = 'enemy-tex';
    graphics.generateTexture(key, 40, 50);
    graphics.destroy();
    this.setTexture(key);
    this.setTint(0xffffff);
  }

  updateAI(player: Phaser.Physics.Arcade.Sprite) {
    // Always chase player, even if jumping
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = this.isChasing ? this.chaseSpeed : this.patrolSpeed;
    // Move toward player
    if (dist > 8) {
      const angle = Math.atan2(dy, dx);
      this.setVelocityX(Math.cos(angle) * speed);
      // Optional: jump if player is above and close
      if (dy < -20 && this.body && this.body.blocked.down) {
        this.setVelocityY(-220);
      }
    } else {
      this.setVelocityX(0);
    }
    this.isChasing = true;
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    // Simple walking animation: swing body
    if (this.body && Math.abs(this.body.velocity.x) > 10 && this.body.blocked.down) {
      this.setAngle(Math.sin(time / 100) * 10);
      this.setScale(1 + Math.abs(Math.sin(time / 200)) * 0.1, 1);
    } else {
      this.setAngle(0);
      this.setScale(1, 1);
    }
  }

  flashRed() {
    this.setTint(0xff0000);
    setTimeout(() => this.setTint(0xffffff), 100);
  }
}
