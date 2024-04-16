import Phaser from "phaser";
import { createPlayers, resetGame, updatePlayers, updateScene } from "./utils";
import Button from "./button";

export default class FiredScene extends Phaser.Scene {
  constructor() {
    super("FiredScene");
  }

  preload() {
    this.load.image("bg-fired", "img/bg-fired.png");
    this.load.image("pointer", "img/pointer.png");
    this.load.audio("lose", "audio/win.mp3");
  }

  create() {
    this.sound.play("lose");

    this.add.image(0, 0, "bg-fired").setOrigin(0);

    createPlayers(this);

    new Button(
      this,
      this.scale.width / 2,
      this.scale.height / 2,
      [0.5, 0.5],
      "large",
      "Play again",
      "#22A559",
      resetGame
    );
  }

  update() {
    updateScene(this);
    updatePlayers(this);
  }
}