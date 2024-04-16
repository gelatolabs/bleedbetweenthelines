import Player from "./player";
import Button from "./button";
import { getState, onPlayerJoin, myPlayer, openDiscordInviteDialog, setState } from "playroomkit";

export function createPlayers(scene) {
  scene.players = [];

  onPlayerJoin((player) => {
    const profile = player.getProfile();
    const cursor = new Player(scene, player.id, profile.name, profile.photo);
    scene.players.push({ player, cursor });

    player.onQuit(() => {
      scene.players = scene.players.filter(({ player: _player }) => _player !== player);
      cursor.destroy();
    });
  });

  scene.input.on("pointermove", (pointer) => {
    if (myPlayer()) {
      myPlayer().setState("pos", { x: pointer.x, y: pointer.y });
    }
  });
}

export function createUI(scene) {
  new Button(
    scene,
    scene.scale.width - 32,
    32,
    [1, 0],
    "small",
    "Invite friends",
    "#5864F2",
    inviteFriends
  );
}

export function inviteFriends() {
  const discordMode = new URLSearchParams(window.location.search).get("instance_id") !== null;
  if (discordMode) {
    openDiscordInviteDialog();
  } else {
    const shareContent = { url: location.href, title: "Join my room" };
    const clipboardFallback = () => {
      navigator.clipboard.writeText(shareContent.url)
        .then(() => alert("Link copied to clipboard"))
        .catch(() => prompt("Copy the link below", shareContent.url));
    };
    navigator.share ? navigator.share(shareContent).catch(clipboardFallback) : clipboardFallback();
  }
}

export function updatePlayers(scene) {
  scene.players.forEach(({ player, cursor }) => {
    const pos = player.getState("pos");
    if (pos) {
      cursor.setPos(pos.x, pos.y);
    }
  });
}

export function updateScene(scene) {
  const sceneState = getState("currentScene");
  if (sceneState && sceneState !== scene.scene.key) {
    scene.scene.start(sceneState);
  }
}

export function resetGame() {
  setState("bookOpened", null);
  setState("fineCharged", null);
  setState("solvedProblems", null);
  setState("timerStartTime", null)
  setState("currentDialogue", null);
  setState("level", 0);
  setState("currentScene", "MenuScene");
}