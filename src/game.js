import Phaser from "phaser";
import MenuScene from "./menuScene";
import BookScene from "./bookScene";
import DialogueScene from "./dialogueScene";
import WinScene from "./winScene";
import SummonScene from "./summonScene";
import FiredScene from "./firedScene";
import { getState, insertCoin, isHost, setState } from "playroomkit";
import RexCircleMaskImagePlugin from "phaser3-rex-plugins/plugins/circlemaskimage-plugin.js";

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: "game",
  scene: [MenuScene, BookScene, DialogueScene, WinScene, SummonScene, FiredScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  plugins: {
    global: [{
      key: "rexCircleMaskImagePlugin",
      plugin: RexCircleMaskImagePlugin,
      start: true
    }]
  }
};

insertCoin({
  gameId: "9vfqsOPKlWF0i0bBfdsd",
  discord: {
    scope: ["identify", "guilds.members.read", "rpc.voice.read"]
  }
}).then(() => {
  const game = new Phaser.Game(config);
  const sceneState = getState("currentScene");
  if (!sceneState) {
    setState("currentScene", "MenuScene");
    setState("level", 0);
  }
});