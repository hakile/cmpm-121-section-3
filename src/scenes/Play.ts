import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spaceship?: Phaser.GameObjects.Shape;

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

    this.spaceship = this.add.rectangle(295, 450, 50, 50, 0x00bf00);
    this.fired = false;
  }

  update(_: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown && !this.fired && this.spaceship!.x > 30) {
      this.spaceship!.x -= delta * this.moveSpeed;
    }
    if (this.right!.isDown && !this.fired && this.spaceship!.x < 610) {
      this.spaceship!.x += delta * this.moveSpeed;
    }

    if (this.fire!.isDown && !this.fired) {
      this.fired = true;
      this.tweens.add({
        targets: this.spaceship,
        y: { from: 450, to: -25 },
        duration: 1000,
        ease: Phaser.Math.Easing.Quintic.In,
      });
      this.time.delayedCall(1100, () => {
        this.spaceship!.y = 450;
        this.fired = false;
      });
    }
  }
}
