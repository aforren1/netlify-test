export class ContinueButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    let rect = scene.add.rexRoundRectangle(0, 0, 300, 100, 8, 0x888888).setOrigin(0.5, 0.5)
    rect.setStrokeStyle(3, 0x000000)
    let text = scene.add
      .text(0, 0, 'Continue', { fontFamily: 'Arial', fontSize: 64, align: 'center' })
      .setOrigin(0.5, 0.5)
    super(scene, x, y, [rect, text])
    this.rect = rect
    scene.add.existing(this)
    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, rect.width, rect.height), Phaser.Geom.Rectangle.Contains)
    this.active = true
    this.on('pointerover', () => {
      if (this.active) {
        this.rect.setFillStyle(0x6ec071)
      }
    })
    this.on('pointerout', () => {
      if (this.active) {
        this.setGreen()
      }
    })
    this.on('pointerdown', () => {
      this.rect.setStrokeStyle(3, 0x444444)
    })
    this.on('pointerup', () => {
      this.rect.setStrokeStyle(3, 0x000000)
    })
  }
  setGreen() {
    this.rect.setFillStyle(0x4caf50)
  }
  setGray() {
    this.rect.setFillStyle(0x888888)
  }
  setActive(val) {
    let val2 = !!val
    this.active = val
    if (val2) {
      this.setGreen()
    } else {
      this.setGray()
    }
  }
}
