import Phaser from "phaser";
import { createPlayers, resetGame, updatePlayers, updateScene } from "./utils";
import Button from "./button";

export default class FiredScene extends Phaser.Scene {
  constructor() {
    super("FiredScene");
  }

  preload() {
    this.load.image("bg-fired", "assets/bg-fired.png");
    this.load.image("pointer", "assets/pointer.png");
  }

  create() {
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