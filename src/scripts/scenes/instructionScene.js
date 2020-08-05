import log from '../utils/logger'
import { ContinueButton } from '../objects/button'
export default class InstructionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InstructionScene' })
  }

  create() {
    this.tweens.addCounter({
      from: 0,
      to: 125,
      duration: 1000,
      onUpdate: (t) => {
        let v = Math.floor(t.getValue())
        this.cameras.main.setBackgroundColor(Phaser.Display.Color.GetColor32(0, 0, 0, v))
      },
    })
    let center = this.game.config.height / 2
    this.add.text(center, center, 'Foooo')
    let cont = new ContinueButton(this, center, center - 100)
    this.add.sprite(center - 150, center, 'chest', 0).setOrigin(0.5, 0.5)
    this.add.sprite(center, center, 'chest', 1).setOrigin(0.5, 0.5)
    this.add.sprite(center + 150, center, 'chest', 2).setOrigin(0.5, 0.5)
  }
}
