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
    this.load.image("bg-book", "img/bg-book.png");
    this.load.image("pointer", "img/pointer.png");
    this.load.image("book-1-closed", "img/book-1-closed.png");
    this.load.image("book-1-open", "img/book-1-open.png");
    this.load.image("book-2-closed", "img/book-2-closed.png");
    this.load.image("book-2-open", "img/book-2-open.png");
    this.load.image("book-3-closed", "img/book-3-closed.png");
    this.load.image("book-3-open", "img/book-3-open.png");
    this.load.image("book-4-closed", "img/book-4-closed.png");
    this.load.image("book-4-open", "img/book-4-open.png");
    this.load.image("book-5-closed", "img/book-5-closed.png");
    this.load.image("book-5-open", "img/book-5-open.png");
    this.load.image("book-6-closed", "img/book-6-closed.png");
    this.load.image("book-6-open", "img/book-6-open.png");
    this.load.image("bandage", "img/bandage.png");
    this.load.image("glue", "img/glue.png");
    this.load.image("knife", "img/knife.png");
    this.load.image("potion", "img/potion.png");
    this.load.image("potion2", "img/potion2.png");
    this.load.image("tape", "img/tape.png");
    this.load.image("bandage-pickup", "img/bandage-pickup.png");
    this.load.image("glue-pickup", "img/glue-pickup.png");
    this.load.image("knife-pickup", "img/knife-pickup.png");
    this.load.image("potion-pickup", "img/potion-pickup.png");
    this.load.image("potion2-pickup", "img/potion2-pickup.png");
    this.load.image("tape-pickup", "img/tape-pickup.png");
    this.load.image("bandage-problem", "img/bandage-problem.png");
    this.load.image("glue-problem", "img/glue-problem.png");
    this.load.image("knife-problem", "img/knife-problem.png");
    this.load.image("potion-problem", "img/potion-problem.png");
    this.load.image("potion2-problem", "img/potion2-problem.png");
    this.load.image("tape-problem", "img/tape-problem.png");
    this.load.audio("book-open", "audio/book-open.mp3");
    this.load.audio("bandage-pickup", "audio/bandage-pickup.mp3");
    this.load.audio("glue-pickup", "audio/glue-pickup.mp3");
    this.load.audio("knife-pickup", "audio/knife-pickup.mp3");
    this.load.audio("potion-pickup", "audio/potion-pickup.mp3");
    this.load.audio("potion2-pickup", "audio/potion2-pickup.mp3");
    this.load.audio("tape-pickup", "audio/tape-pickup.mp3");
    this.load.audio("bandage-use", "audio/bandage-use.mp3");
    this.load.audio("glue-use", "audio/glue-use.mp3");
    this.load.audio("knife-use", "audio/knife-use.mp3");
    this.load.audio("potion-use", "audio/potion-use.mp3");
    this.load.audio("potion2-use", "audio/potion2-use.mp3");
    this.load.audio("tape-use", "audio/tape-use.mp3");
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

    this.overdue = [1, 4, 5].includes(level);

    this.fineCharged = getState("fineCharged");
    if (!this.fineCharged) {
      this.fineCharged = false;
      setState("fineCharged", false);
    }

    this.book = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, `book-${level}-closed`).setInteractive();
    this.book.on("pointerdown", () => this.openBook(this, level));

    if (!getState("bookOpened")) {
      this.bookOpened = false;
      setState("bookOpened", false);
    } else {
      this.openBook(this, level);
    }

    this.solvedProblems = getState("solvedProblems");
    if (!this.solvedProblems) {
      this.solvedProblems = [];
      setState("solvedProblems", []);
    }

    this.tools = [
      new Tool(this, 1801, 389, "bandage"),
      new Tool(this, 104, 469, "glue"),
      new Tool(this, 1730, 737, "knife"),
      new Tool(this, 110, 217, "potion"),
      new Tool(this, 220, 219, "potion2"),
      new Tool(this, 1693, 505, "tape"),
    ]
    this.currentTool = null;

    this.spellToType = "hippity hoppity lorem ipsum shuttus uppus";
    this.spellActive = false;
    this.spellCompleted = getState("spellCompleted") || false;
    this.spellCorrectChars = getState("spellCorrectChars") || 0;
    this.spellText = null

    this.input.keyboard.on("keydown", this.handleKeyPress, this);

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

    // broken :(
    // this.time.addEvent({
    //   delay: 5000,
    //   callback: () => {
    //     if ([2, 4, 5, 6].includes(level)) {
    //       this.spellActive = true;
    //       this.displaySpell();
    //     }
    //   }
    // })
  }

  displaySpell() {
    if (this.spellText) {
      this.spellText.destroy();
    }
    this.add.text(this.cameras.main.width / 2, 50, "Type the shushing spell to silence the noisy patrons!", {
      fontFamily: "Arial",
      fontSize: "32px",
      color: "#FFFFFF"
    }).setOrigin(0.5);
    this.spellText = this.add.rexBBCodeText(this.cameras.main.width / 2, 100, this.spellToType).setFontSize("32px").setOrigin(0.5);
  }

  handleKeyPress(event) {
    if (!this.spellActive || this.spellCompleted) return;

    const charTyped = event.key;
    const correctChar = this.spellToType.charAt(this.spellCorrectChars);
    if (charTyped === correctChar) {
      this.spellCorrectChars++;
    } else {
      this.spellCorrectChars = 0;
    }
    setState("spellCorrectChars", this.spellCorrectChars);
    this.updateSpellText();

    if (this.spellCorrectChars === this.spellToType.length) {
      this.spellCompleted = true;
      setState("spellCompleted", true);
      this.maybeFinish();
    }
  }

  updateSpellText() {
    if (this.spellText) {
      const highlighted = this.spellToType.substring(0, this.spellCorrectChars);
      const remaining = this.spellToType.substring(this.spellCorrectChars);
      this.spellText.setText(`[color=#00FF00]${highlighted}[/color][color=#FFFFFF]${remaining}[/color]`);
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
    if (!scene.bookOpened) {
      if (scene.chargeFineButton) {
        scene.chargeFineButton.destroy();
      }
      if (scene.overdue && !scene.fineCharged) {
        setState("firedReason", 1);
        setState("currentScene", "FiredScene");
      } else {
        scene.sound.play("book-open");
        scene.book.setTexture(`book-${level}-open`);
        scene.createProblems(level);
        scene.bookOpened = true;
        setState("bookOpened", true);
      }
    }
  }

  createProblems(level) {
    const problemLayouts = [
      [
        { x: 810, y: 460, imageKey: "tape-problem" }
      ],
      [
        { x: 690, y: 480, imageKey: "glue-problem" },
        { x: 800, y: 600, imageKey: "bandage-problem" }
      ],
      [
        { x: 1140, y: 390, imageKey: "potion2-problem" },
        { x: 710, y: 450, imageKey: "tape-problem" },
        { x: 1260, y: 570, imageKey: "knife-problem" }
      ],
      [
        { x: 890, y: 450, imageKey: "potion-problem" },
        { x: 1160, y: 370, imageKey: "glue-problem" },
        { x: 1100, y: 520, imageKey: "bandage-problem" },
        { x: 610, y: 630, imageKey: "potion2-problem" }
      ],
      [
        { x: 810, y: 410, imageKey: "potion-problem" },
        { x: 1160, y: 370, imageKey: "knife-problem" },
        { x: 1100, y: 570, imageKey: "glue-problem" },
        { x: 550, y: 650, imageKey: "bandage-problem" },
        { x: 1260, y: 570, imageKey: "tape-problem" }
      ],
      [
        { x: 630, y: 380, imageKey: "bandage-problem" },
        { x: 810, y: 410, imageKey: "potion2-problem" },
        { x: 1200, y: 390, imageKey: "potion-problem" },
        { x: 550, y: 650, imageKey: "knife-problem" },
        { x: 800, y: 550, imageKey: "tape-problem" },
        { x: 1260, y: 570, imageKey: "glue-problem" }
      ]
    ];

    this.problems = problemLayouts[level - 1].map(problem => new Problem(this, problem.x, problem.y, problem.imageKey));
  }

  solveProblem(problem) {
    this.problems = this.problems.filter(p => p !== problem);
    this.solvedProblems = [...this.solvedProblems, problem.imageKey];
    if (this.problems.length === 0) {
      this.maybeFinish();
    } else {
      setState("solvedProblems", this.solvedProblems);
    }
  }

  maybeFinish() {
    if (this.problems.length === 0 && (!this.spellActive || this.spellCompleted)) {
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

    const spellCompleted = getState("spellCompleted");
    if (spellCompleted !== this.spellCompleted) {
      this.spellCompleted = spellCompleted;
      if (this.spellCompleted) {
        this.maybeFinish();
      }
    }

    const spellCorrectChars = getState("spellCorrectChars");
    if (spellCorrectChars !== this.spellCorrectChars) {
      this.spellCorrectChars = spellCorrectChars;
      this.updateSpellText();
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