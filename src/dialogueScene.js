import Phaser from "phaser";
import { createUI, createPlayers, updateScene, updatePlayers } from "./utils";
import { getState, setState } from "playroomkit";

export default class DialogueScene extends Phaser.Scene {
  constructor() {
    super("DialogueScene");
  }

  preload() {
    this.load.image("bg-dialogue", "assets/bg-dialogue.png");
    this.load.image("pointer", "assets/pointer.png");
    this.load.image("npc-0", "assets/npc-0.png");
    this.load.image("npc-1", "assets/npc-1.png");
    this.load.image("npc-2", "assets/npc-2.png");
    this.load.image("npc-3", "assets/npc-3.png");
    this.load.image("npc-4", "assets/npc-4.png");
    this.load.image("npc-5", "assets/npc-5.png");
    this.load.image("npc-6", "assets/npc-6.png");
  }

  async create() {
    this.add.image(0, 0, "bg-dialogue").setOrigin(0, 0);

    const players = [];
    createPlayers(this);
    createUI(this);

    const level = getState("level");
    this.npc = this.add.image(0, 0, `npc-${level}`).setOrigin(0, 0);

    this.dialogues = [
      [
        "Welcome to your first day on the job, new recruit! My name is Koboo Kindler and I  am the manager here at Harrowing Hall of Souls Library. We take our literature very seriously and do not tolerate failure of any kind. Our traditional services include the lending of books and comfortable spaces to browse the archives in a warm and welcoming environment. However, what really makes our library special is our unique repair service.  The recovery process demands the utmost precision and only the sharpest of minds will succeed in achieving a pristine restoration.  A word of warning - our clients sometimes include seedy characters who delve into literature with a tendency to produce otherworldly beings.  These may or may not be hazardous to your health, so proceed with extreme caution!",
        "Here's a quick guide on how to hopefully save the books and your life!",
        "Since you're still new, we'll assign you a few simpler tasks before getting into the fun stuff"
      ],
      [
        "A burly troll saunters up to you and slams a hardcover book on the desk.  You feel intimidated by the sheer size of the beast and nervously await its next move.  The troll slides the book in front of you and grunts loudly.",
        "“Me drop book in toilet and book no work anymore.  Please make book work again!”"
      ],
      [
        "A frame so small that you barely notice it approaches your desk.  They very tenderly place a book in front of you.  One eye peers through their anime-type hairstyle and whispers to you in a timid manner.",
        "“Hey I really liked this book, sometimes it feels like my only friend.  I hope it means as much to the next person.”"
      ],
      [
        "You spot a peculiar looking individual scurrying up to your desk in a movement that suspiciously resembles floating.  A pointed hat complements incredibly long hair but a large cyclopean eye seems to mysteriously draw you in.  The high-pitch voice startles you, almost causing you to jump in your seat!",
        "“Hey there sonny, I just happened to be whipping up one of my famous brews last night and spilled a few drops on page 69.  I hope you can get those stains out, they look absolutely dreadful! She hands you the book and then cackles loudly. Hee Hee Hee”"
      ],
      [
        "The doors to the library slowly creak open and a mask-bound figure slowly creeps up to you.  A skull totem on their back gives you the impression it is looking right through your soul.  They do not speak but somehow you hear their words inside your head.",
        "“Greetings my minion, you are here to do my bidding.  Repair this item at once or face my wrath!”"
      ],
      [
        "A lizard-like creature uses its tail to fling a book onto your desk.  Its appearance is almost extra-terrestrial in nature and you expect it to speak in some alien language.  To your surprise, it addresses you in a perfect English accent.",
        "“Bip bip my good chap, I trust you are having a jolly day!  I'm afraid my pet cat Smuckers had her way with this fine piece of literature.  Please do your best to restore it.  Cheerio!”"
      ],
      [
        "A feline beast with large fangs and very pointy ears sleekly struts over to your desk.  Its bushy tail draws your attention and its human characteristics are somewhat familiar.  It licks its chops as if preparing to devour you but calmly speaks.",
        "“Ahoy there matey, I moored me ship at your local dock after we hit some rough seas last week.  I sailed back here as quickly as I could to make our return date.  Don't mind the wee bit of water damage on a few of the pages!”"
      ]
    ]

    this.currentDialogue = getState("currentDialogue");
    if (!this.currentDialogue) {
      this.currentDialogue = 0;
      setState("currentDialogue", 0);
    }
    this.displayDialogue(this.dialogues[level][this.currentDialogue]);

    this.input.on("pointerdown", () => {
      this.advanceDialogue();
    });

    setState("timerStartTime", null);
  }

  advanceDialogue() {
    const level = getState("level");
    this.currentDialogue++;
    if (this.currentDialogue < this.dialogues[level].length) {
      this.displayDialogue(this.dialogues[level][this.currentDialogue]);
      setState("currentDialogue", this.currentDialogue);
    } else {
      this.currentDialogue = 0;
      setState("currentDialogue", 0);
      if (level === 0) {
        setState("level", 1);
        this.npc.destroy();
        this.npc = this.add.image(0, this.scale.height, "npc-1").setOrigin(0, 1);
        this.displayDialogue(this.dialogues[1][0]);
      } else {
        setState("currentScene", "BookScene");
      }
    }
  }

  displayDialogue(text) {
    if (this.dialogueText) {
      this.dialogueText.destroy();
    }
    this.dialogueText = this.add.text(900, 250, text, {
      fontFamily: "Arial",
      fontSize: "32px",
      color: "#000000",
      backgroundColor: "#FFFFFF",
      padding: { x: 30, y: 30 },
      wordWrap: { width: 900 }
    }).setOrigin(0)
      .setAlpha(0.7);
  }

  update() {
    updateScene(this);
    updatePlayers(this);

    const level = getState("level");
    const currentDialogue = getState("currentDialogue");
    if (this.npc.texture.key !== `npc-${level}` || currentDialogue !== this.currentDialogue) {
      this.npc.destroy();
      this.npc = this.add.image(0, 0, `npc-${level}`).setOrigin(0, 0);
      this.currentDialogue = currentDialogue;
      this.displayDialogue(this.dialogues[getState("level")][this.currentDialogue]);
    }
  }
}