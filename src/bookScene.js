import Phaser from "phaser";
import { getState, setState } from "playroomkit";
import { createUI, createPlayers, updateScene, updatePlayers } from "./utils";
import Button from "./button";
import Tool from "./tool";
import Problem from "./problem";

export default class BookScene extends Phaser.Scene {
  constructor() {
    super("BookScene");
  }

  preload() {
    this.load.image("bg-book", "assets/bg-book.png");
    this.load.image("pointer", "assets/pointer.png");
    this.load.image("book-1-closed", "assets/book-1-closed.png");
    this.load.image("book-1-open", "assets/book-1-open.png");
    this.load.image("book-2-closed", "assets/book-2-closed.png");
    this.load.image("book-2-open", "assets/book-2-open.png");
    this.load.image("book-3-closed", "assets/book-3-closed.png");
    this.load.image("book-3-open", "assets/book-3-open.png");
    this.load.image("book-4-closed", "assets/book-4-closed.png");
    this.load.image("book-4-open", "assets/book-4-open.png");
    this.load.image("book-5-closed", "assets/book-5-closed.png");
    this.load.image("book-5-open", "assets/book-5-open.png");
    this.load.image("book-6-closed", "assets/book-6-closed.png");
    this.load.image("book-6-open", "assets/book-6-open.png");
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

    const level = getState("level");

    this.chargeFineButton = new Button(
      this,
      this.scale.width / 2,
      100,
      [0.5, 0.5],
      "small",
      "Charge fine",
      "#FF0000",
      () => this.chargeFine()
    );

    this.overdue = [1, 3, 4, 6].includes(level);

    this.fineCharged = getState("fineCharged");
    if (!this.fineCharged) {
      this.fineCharged = false;
      setState("fineCharged", false);
    }

    this.bookOpened = getState("bookOpened");
    if (!this.bookOpened) {
      this.bookOpened = false;
      setState("bookOpened", false);
    }

    this.book = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, `book-${level}-closed`).setInteractive();
    this.book.on("pointerdown", () => this.openBook(this, level));

    this.solvedProblems = getState("solvedProblems");
    if (!this.solvedProblems) {
      this.solvedProblems = [];
      setState("solvedProblems", []);
    }

    this.tools = [
      new Tool(this, 1800, 370, "bandage"),
      new Tool(this, 110, 490, "glue"),
      new Tool(this, 1760, 740, "knife"),
      new Tool(this, 110, 220, "potion"),
      new Tool(this, 220, 220, "potion2"),
      new Tool(this, 1670, 510, "tape"),
      new Tool(this, 190, 640, "wand")
    ]
    this.currentTool = null;

    const timeLimit = 30;

    this.timerBar = this.add.graphics();
    this.timerBar.fillStyle(0x000000);
    this.timerBar.fillRect(0, 0, this.cameras.main.width, 10);

    this.timerDuration = timeLimit;
    this.timeLeft = timeLimit;
    this.lastUpdateTime = Date.now();

    this.timerStartTime = getState("timerStartTime");
    if (!this.timerStartTime) {
      setState("timerStartTime", Date.now());
    }
  }

  chargeFine() {
    if (this.overdue) {
      this.fineCharged = true;
      this.chargeFineButton.destroy();
      setState("fineCharged", true);
    } else {
      setState("firedReason", 0);
      setState("currentScene", "FiredScene");
    }
  }

  openBook(scene, level) {
    if (!this.bookOpened) {
      if (this.chargeFineButton) {
        this.chargeFineButton.destroy();
      }
      if (this.overdue && !this.fineCharged) {
        setState("firedReason", 1);
        setState("currentScene", "FiredScene");
      } else {
        this.book.setTexture(`book-${level}-open`);
        this.createProblems(level);
        this.bookOpened = true;
        setState("bookOpened", true);
      }
    }
  }

  createProblems(level) {
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

    this.problems = problemLayouts[level - 1].map(problem => new Problem(this, problem.x, problem.y, problem.imageKey));
  }

  solveProblem(problem) {
    this.problems = this.problems.filter(p => p !== problem);
    this.solvedProblems = [...this.solvedProblems, problem.imageKey];
    if (this.problems.length === 0) {
      const level = getState("level");
      if (level === 6) {
        setState("currentScene", "WinScene");
      } else {
        setState("solvedProblems", []);
        setState("fineCharged", false);
        setState("bookOpened", false);
        setState("level", level + 1);
        setState("currentScene", "DialogueScene");
      }
    } else {
      setState("solvedProblems", this.solvedProblems);
    }
  }

  update() {
    updateScene(this);
    updatePlayers(this);

    const level = getState("level");

    const bookOpened = getState("bookOpened");
    if (bookOpened !== this.bookOpened) {
      if (bookOpened) {
        this.openBook(this, level);
      }
      this.bookOpened = bookOpened;
    }

    const fineCharged = getState("fineCharged");
    if (fineCharged !== this.fineCharged) {
      this.fineCharged = fineCharged;
      if (this.fineCharged && this.chargeFineButton) {
        this.chargeFineButton.destroy();
      }
    }

    const solvedProblems = getState("solvedProblems");
    if (solvedProblems !== this.solvedProblems && this.problems) {
      this.solvedProblems = solvedProblems;
      this.problems.forEach(problem => {
        if (this.solvedProblems.includes(problem.imageKey)) {
          problem.solve();
        }
      });
    }

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