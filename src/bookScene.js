import Phaser from "phaser";
import { getState, setState } from "playroomkit";
import { createUI, createPlayers, updateScene, updatePlayers } from "./utils";
import Tool from "./tool";
import Problem from "./problem";

export default class BookScene extends Phaser.Scene {
  constructor() {
    super("BookScene");
  }

  preload() {
    this.load.image("bg-book", "assets/bg-book.png");
    this.load.image("pointer", "assets/pointer.png");
    this.load.image("bandage", "assets/bandage.png");
    this.load.image("glue", "assets/glue.png");
    this.load.image("knife", "assets/knife.png");
    this.load.image("potion", "assets/potion.png");
    this.load.image("potion2", "assets/potion2.png");
    this.load.image("tape", "assets/tape.png");
    this.load.image("wand", "assets/wand.png");
    this.load.image("bandage-problem", "assets/bandage.png");
    this.load.image("glue-problem", "assets/glue.png");
    this.load.image("knife-problem", "assets/knife.png");
    this.load.image("potion-problem", "assets/potion.png");
    this.load.image("potion2-problem", "assets/potion2.png");
    this.load.image("tape-problem", "assets/tape.png");
    this.load.image("wand-problem", "assets/wand.png");
  }

  async create() {
    this.add.image(0, 0, "bg-book").setOrigin(0, 0);

    const players = [];
    createPlayers(this);
    createUI(this);

    const problemLayouts = [
      [
        { x: 810, y: 410, imageKey: "tape-problem" },
        { x: 1260, y: 570, imageKey: "potion-problem" }
      ],
      [
        { x: 590, y: 380, imageKey: "glue-problem" },
        { x: 1340, y: 390, imageKey: "wand-problem" },
        { x: 800, y: 590, imageKey: "bandage-problem" }
      ],
      [
        { x: 890, y: 410, imageKey: "wand-problem" },
        { x: 1340, y: 390, imageKey: "potion2-problem" },
        { x: 510, y: 650, imageKey: "tape-problem" },
        { x: 1260, y: 570, imageKey: "knife-problem" }
      ],
      [
        { x: 590, y: 380, imageKey: "potion-problem" },
        { x: 1160, y: 370, imageKey: "glue-problem" },
        { x: 1340, y: 390, imageKey: "bandage-problem" },
        { x: 510, y: 650, imageKey: "potion2-problem" },
        { x: 800, y: 590, imageKey: "knife-problem" }
      ],
      [
        { x: 810, y: 410, imageKey: "potion-problem" },
        { x: 1160, y: 370, imageKey: "knife-problem" },
        { x: 1340, y: 390, imageKey: "glue-problem" },
        { x: 510, y: 650, imageKey: "bandage-problem" },
        { x: 800, y: 590, imageKey: "wand-problem" },
        { x: 1260, y: 570, imageKey: "tape-problem" }
      ],
      [
        { x: 590, y: 380, imageKey: "bandage-problem" },
        { x: 810, y: 410, imageKey: "potion2-problem" },
        { x: 1160, y: 370, imageKey: "wand-problem" },
        { x: 1340, y: 390, imageKey: "potion-problem" },
        { x: 510, y: 650, imageKey: "knife-problem" },
        { x: 800, y: 590, imageKey: "tape-problem" },
        { x: 1260, y: 570, imageKey: "glue-problem" }
      ]
    ];

    const level = getState("level");
    this.problems = problemLayouts[level - 1].map(problem => new Problem(this, problem.x, problem.y, problem.imageKey));

    this.tools = [
      new Tool(this, 1800, 370, "bandage"),
      new Tool(this, 110, 490, "glue"),
      new Tool(this, 1760, 740, "knife"),
      new Tool(this, 110, 220, "potion"),
      new Tool(this, 220, 220, "potion2"),
      new Tool(this, 1670, 510, "tape"),
      new Tool(this, 190, 640, "wand")
    ]

    const timeLimit = 30;

    this.timerBar = this.add.graphics();
    this.timerBar.fillStyle(0x000000);
    this.timerBar.fillRect(0, 0, this.cameras.main.width, 10);

    this.timerDuration = timeLimit;
    this.timeLeft = timeLimit;
    this.lastUpdateTime = Date.now();

    setState("timerStartTime", Date.now());
  }

  solveProblem(problem) {
    this.problems = this.problems.filter(p => p !== problem);
    if (this.problems.length === 0) {
      const level = getState("level");
      if (level === 6) {
        setState("currentScene", "WinScene");
      } else {
        setState("level", level + 1);
        setState("currentScene", "DialogueScene");
      }
    }
  }

  update() {
    updateScene(this);
    updatePlayers(this);

    const now = Date.now();
    const elapsed = (now - getState("timerStartTime")) / 1000;
    this.timeLeft = Math.max(this.timerDuration - elapsed, 0);

    const width = (this.timeLeft / this.timerDuration) * this.cameras.main.width;
    this.timerBar.clear();
    this.timerBar.fillStyle(0xFF0000);
    this.timerBar.fillRect(0, 0, width, 10);

    if (this.timeLeft <= 0) {
      setState("currentScene", "SummonScene");
    }
  }
}