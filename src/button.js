import Phaser from "phaser";

export default class Button {
  constructor(scene, x, y, origin, size, text, color, action) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.color = color;
    this.hoverColor = this.getDarkenedColor(color);

    const fontSize = size === 'large' ? '48px' : '30px';
    const paddingX = size === 'large' ? 22 : 14;
    const paddingY = size === 'large' ? 14 : 10;

    this.text = scene.add.text(x, y, text, {
      fontFamily: "'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: fontSize,
      color: '#FFFFFF',
      padding: { x: paddingX, y: paddingY }
    }).setOrigin(...origin);

    const width = this.text.width + 2 * paddingX;
    const height = this.text.height + 2 * paddingY;
    this.graphics = scene.add.graphics();
    this.drawBackground(width, height, color);

    this.text.setDepth(1);
    this.text.setInteractive();
    this.text.on('pointerover', () => this.drawBackground(width, height, this.hoverColor));
    this.text.on('pointerout', () => this.drawBackground(width, height, this.color));
    this.text.on('pointerdown', action);
  }

  drawBackground(width, height, color) {
    let offsetX = this.x - width * this.text.originX + (this.text.originX - 0.5) * 2 * this.text.padding.left;
    let offsetY = this.y - height * this.text.originY + (this.text.originY - 0.5) * 2 * this.text.padding.top;

    this.graphics.clear();
    this.graphics.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1);
    this.graphics.fillRoundedRect(offsetX, offsetY, width, height, 6);
  }

  getDarkenedColor(hexColor) {
    let color = Phaser.Display.Color.HexStringToColor(hexColor);
    color.darken(20);
    return Phaser.Display.Color.RGBToString(color.red, color.green, color.blue);
  }
}