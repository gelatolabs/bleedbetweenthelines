export default class Problem {
  constructor(scene, x, y, imageKey) {
    this.scene = scene;
    this.imageKey = imageKey;
    this.solutionTool = imageKey.replace("-problem", "");

    this.sprite = this.scene.add.sprite(x, y, imageKey).setInteractive();
  }

  solve() {
    this.sprite.destroy();
    this.scene.solveProblem(this);
  }

  destroy() {
    this.sprite.destroy();
  }
}