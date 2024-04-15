import Phaser from "phaser";
import { setState } from "playroomkit";
import { createPlayers, inviteFriends, updatePlayers, updateScene } from "./utils";
import Button from "./button";

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("bg-menu", "assets/bg-menu.png");
    this.load.image("pointer", "assets/pointer.png");
  }

  create() {
    this.add.image(0, 0, "bg-menu").setOrigin(0);

    createPlayers(this);

    new Button(
      this,
      this.scale.width / 2,
      this.scale.height / 2 - 56,
      [0.5, 0.5],
      "large",
      "Play",
      "#22A559",
      () => setState("currentScene", "DialogueScene")
    );

    new Button(
      this,
      this.scale.width / 2,
      this.scale.height / 2 + 56,
      [0.5, 0.5],
      "small",
      "Invite friends",
      "#5864F2",
      inviteFriends
    );
  }

  update() {
    updateScene(this);
    updatePlayers(this);
  }
}