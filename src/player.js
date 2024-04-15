import { myPlayer } from "playroomkit";

export default class Player {
  constructor(scene, id, name, photo) {
    this.scene = scene;
    this.id = id;
    this.name = name;

    this.scene.load.image(`player-${id}`, photo);
    this.scene.load.once("complete", () => {
      this.cursor = this.scene.add.container(0, 0);

      const cursorPhoto = this.scene.add.rexCircleMaskImage(52, 52, `player-${id}`, { maskType: "circle" });
      cursorPhoto.setOrigin(0, 0);
      cursorPhoto.setDisplaySize(64, 64);

      const border = this.scene.add.graphics();
      border.lineStyle(4, 0xFFFFFF, 1);
      border.strokeCircle(84, 84, 32);

      const pointer = this.scene.add.sprite(0, 0, "pointer");
      pointer.setOrigin(0, 0);

      this.cursor.add([cursorPhoto, border, pointer]);

      if (this.id === myPlayer().id) {
        this.cursor.setDepth(3);
      } else {
        this.cursor.setDepth(2);
      }
    }, this);
    this.scene.load.start();
  }

  setPos(x, y) {
    if (!this.cursor) {
      return;
    }
    this.cursor.x = x;
    this.cursor.y = y;
  }

  destroy() {
    this.cursor.destroy();
  }
}