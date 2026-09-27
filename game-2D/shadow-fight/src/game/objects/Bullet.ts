import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  lifespan: number = 200; // Knife attack is very short-lived
  spawnTime: number;

  constructor(scene: Phaser.Scene, x: number, y: number, angle: number, dx: number, dy: number) {
    super(scene, x, y, '');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(24, 8); // Knife shape
    this.setTint(0xffffff); // White for knife
    // Knife is a quick, short-range attack
    const speed = 700;
    // Normalize direction for consistent speed
    const mag = Math.sqrt(dx * dx + dy * dy) || 1;
    const vx = (dx / mag) * speed;
    const vy = (dy / mag) * speed;
    this.setVelocity(vx, vy);
    this.angle = Phaser.Math.RadToDeg(angle);
    this.setOrigin(0.1, 80); // Closer to player
    this.spawnTime = scene.time.now;
    if (this.body && 'allowGravity' in this.body) {
      (this.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    }
    this.setAlpha(1);
    // Knife slash effect (arc flash)
    const flash = scene.add.arc(x, y, 18, Phaser.Math.RadToDeg(angle) - 30, Phaser.Math.RadToDeg(angle) + 30, false, 0xfff176, 0.7);
    scene.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.5,
      duration: 120,
      onComplete: () => flash.destroy()
    });
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (time > this.spawnTime + this.lifespan || this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) {
      this.destroy();
    }
  }
}
