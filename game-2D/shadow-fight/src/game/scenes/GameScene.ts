import Phaser from 'phaser';
import Player from '../objects/Player';
import Bullet from '../objects/Bullet';
import Enemy from '../objects/Enemy';

export default class GameScene extends Phaser.Scene {
  player!: Player;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  shootKey!: Phaser.Input.Keyboard.Key;
  bullets!: Phaser.Physics.Arcade.Group;
  enemies!: Phaser.Physics.Arcade.Group;
  score: number = 0;
  health: number = 3;
  level: number = 1;
  maxLevel: number = 3;
  isPaused: boolean = false;
  levelData = [
    // Level 1
    {
      platforms: [
        { x: 400, y: 590, w: 800, h: 20 },
        { x: 200, y: 450, w: 120, h: 16 },
        { x: 600, y: 350, w: 120, h: 16 }
      ],
      enemies: [ { x: 600, y: 300 } ],
      goal: { x: 760, y: 520 }
    },
    // Level 2
    {
      platforms: [
        { x: 400, y: 590, w: 800, h: 20 },
        { x: 300, y: 480, w: 120, h: 16 },
        { x: 500, y: 400, w: 120, h: 16 },
        { x: 700, y: 320, w: 120, h: 16 }
      ],
      enemies: [ { x: 500, y: 350 }, { x: 700, y: 270 } ],
      goal: { x: 760, y: 250 }
    },
    // Level 3
    {
      platforms: [
        { x: 400, y: 590, w: 800, h: 20 },
        { x: 200, y: 500, w: 120, h: 16 },
        { x: 400, y: 400, w: 120, h: 16 },
        { x: 600, y: 300, w: 120, h: 16 },
        { x: 700, y: 200, w: 120, h: 16 }
      ],
      enemies: [ { x: 400, y: 350 }, { x: 600, y: 250 }, { x: 700, y: 150 } ],
      goal: { x: 760, y: 120 }
    }
  ];

  constructor() {
    super('GameScene');
  }

  preload() {}

  create() {
    // Ground
    const ground = this.physics.add.staticGroup();
    ground.create(550, 590, undefined).setDisplaySize(800, 20).refreshBody();

    this.createLevel(this.level);
    this.cursors = this.input?.keyboard?.createCursorKeys()!;
    this.shootKey = this.input?.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F)!;
    this.input.on('pointerdown', () => this.tryShoot());

    // Touch controls guide overlay
   
  }

  createLevel(levelNum: number) {
    const data = this.levelData[levelNum - 1];
    // Platforms
    const platforms = this.physics.add.staticGroup();
    data.platforms.forEach((p, i) => {
      // Draw modern platform with gradient using Phaser graphics (simulate gradient)
      const g = this.add.graphics();
      // Simulate gradient by drawing multiple rectangles
      for (let j = 0; j < p.w; j += 4) {
        const t = j / p.w;
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
          Phaser.Display.Color.ValueToColor(0x43cea2),
          Phaser.Display.Color.ValueToColor(0x185a9d),
          1,
          t
        );
        const hex = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
        g.fillStyle(hex, 1);
        g.fillRoundedRect(-p.w/2 + j, -p.h/2, 4, p.h, 8);
      }
      g.generateTexture('platform-modern-' + i, p.w, p.h);
      g.destroy();
      const plat = platforms.create(p.x, p.y, 'platform-modern-' + i).setDisplaySize(p.w, p.h).refreshBody();
      plat.setAlpha(0.98);
    });
    // Player
    this.player = new Player(this, 100, 500);
    this.physics.add.collider(this.player, platforms);
    // Bullets
    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    // Enemies
    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    data.enemies.forEach(e => {
      const enemy = new Enemy(this, e.x, e.y);
      this.enemies.add(enemy);
      this.physics.add.collider(enemy, platforms);
    });
    // Colliders
    this.physics.add.collider(
      this.player,
      this.enemies,
      this.onPlayerHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.bullets,
      this.enemies,
      this.onBulletHitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
    this.physics.add.collider(this.enemies, platforms);
    // Goal
    const goal = this.add.rectangle(data.goal.x, data.goal.y, 3, 64, 0x43a047).setOrigin(0.5);
    this.physics.add.existing(goal, true);
    this.physics.add.overlap(this.player, goal, this.onReachGoal, undefined, this);
  }

  tryShoot() {
    if (!this.player || this.isPaused) return;
    const time = this.time.now;
    if (time > this.player.lastShot + this.player.shootCooldown) {
      // Find closest enemy
      let closest: Enemy | null = null;
      let minDist = Infinity;
      this.enemies.children.iterate((enemyObj: Phaser.GameObjects.GameObject | null) => {
        const enemy = enemyObj as Enemy;
        if (enemy && enemy.active) {
          const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
          if (dist < minDist) {
            minDist = dist;
            closest = enemy;
          }
        }
        return false;
      });
      // Aim at closest enemy if any
      const { x, y, angle, dx, dy } = this.player.getBulletSpawn(closest || undefined);
      const bullet = new Bullet(this, x, y, angle, dx, dy);
      this.bullets.add(bullet);
      this.player.lastShot = time;
      // TODO: play shoot sound
    }
  }

  update(time: number) {
    if (this.isPaused) return;
    if (!this.player || !this.cursors) return;
    this.player.handleInput(this.cursors, this.shootKey, time, () => this.tryShoot());
    this.enemies.children.iterate((enemyObj: Phaser.GameObjects.GameObject | null) => {
      const enemy = enemyObj as Enemy;
      if (enemy && enemy.active) { enemy.updateAI(this.player); return true; }
      return false;
    });
  }

  onBulletHitEnemy(bulletObj: Phaser.GameObjects.GameObject, enemyObj: Phaser.GameObjects.GameObject) {
    const bullet = bulletObj as Bullet;
    const enemy = enemyObj as Enemy;
    bullet.destroy();
    enemy.health--;
    enemy.flashRed();
    if (enemy.health <= 0) {
      // Death effect: fade out
      this.tweens.add({
        targets: enemy,
        alpha: 0,
        duration: 200,
        onComplete: () => enemy.destroy()
      });
      this.score += 100;
      // TODO: play enemy death sound
    }
  }

  onPlayerHit(playerObj: Phaser.GameObjects.GameObject) {
    const player = playerObj as Player;
    if (!player.active) return;
    player.health--;
    player.setTint(0xff0000);
    setTimeout(() => player.setTint(0x4fc3f7), 100);
    this.health = player.health;
    if (player.health <= 0) {
      player.setActive(false).setVisible(false);
      this.scene.pause();
      this.isPaused = true;
      // TODO: trigger game over UI
    }
  }

  onReachGoal() {
    this.scene.pause();
    this.isPaused = true;
    // TODO: trigger level complete UI
  }
}
