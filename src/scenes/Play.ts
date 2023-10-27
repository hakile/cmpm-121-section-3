import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spaceship?: Phaser.GameObjects.Shape;
  enemies?: Phaser.GameObjects.Shape[];

  moveSpeed = 0.3;
  fired?: boolean;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.spaceship = this.add.rectangle(295, 462.5, 25, 25, 0x00bf00);
    this.enemies = [
      this.add.rectangle(740, 177.5, 25, 25, 0xbf0000),
      this.add.rectangle(790, 227.5, 25, 25, 0xbf0000),
      this.add.rectangle(840, 277.5, 25, 25, 0xbf0000),
    ];
    this.fired = false;

    this.physics.add.existing(this.spaceship, false);
    this.enemies.forEach((enemy) => {
      enemy.state = 3;
      this.physics.add.existing(enemy, false);
      this.physics.add.overlap(this.spaceship!, enemy, () => {
        enemy!.x = 840;
        if (typeof enemy.state == "number") enemy.state += 1;
      });
    });
  }

  update(_: number, delta: number) {
    this.starfield!.tilePositionX -= 4;
    this.enemies?.forEach((enemy) => {
      if (typeof enemy.state == "number") enemy.x -= Math.min(10, enemy.state);
      if (enemy.x < -200) enemy.x += 1040;
    });

    if (this.left!.isDown && !this.fired) {
      this.spaceship!.x -= delta * this.moveSpeed;
      if (this.spaceship!.x < 17.5) {
        this.spaceship!.x = 17.5;
      }
    }
    if (this.right!.isDown && !this.fired) {
      this.spaceship!.x += delta * this.moveSpeed;
      if (this.spaceship!.x > 622.5) {
        this.spaceship!.x = 622.5;
      }
    }

    if (this.fire!.isDown && !this.fired) {
      this.fired = true;
      this.tweens.add({
        targets: this.spaceship,
        y: { from: 462.5, to: -15 },
        duration: 500,
        ease: Phaser.Math.Easing.Quadratic.In,
      });
      this.time.delayedCall(750, () => {
        this.tweens.add({
          targets: this.spaceship,
          y: { from: 495, to: 462.5 },
          duration: 500,
          ease: Phaser.Math.Easing.Quintic.Out,
        });
      });
      this.time.delayedCall(1250, () => (this.fired = false));
    }
  }
}
