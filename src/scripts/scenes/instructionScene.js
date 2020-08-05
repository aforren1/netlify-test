import log from '../utils/logger'
import { Chest } from '../objects/chest'
export default class InstructionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'InstructionScene' })
  }

  create() {
    // darken background slightly
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
    this.add
      .text(center, center - 400, 'Instructions', {
        fontFamily: 'title_font',
        fontSize: 120,
        color: '#D2B48C',
        stroke: '#000',
        strokeThickness: 2,
        align: 'center',
        padding: {
          x: 64,
          y: 64,
        },
      })
      .setOrigin(0.5, 0.5)

    let foo = new Chest(this, center + 200, center, 'L')
    foo.prime(true)
    let bar = new Chest(this, center - 200, center, 'A')
    bar.prime(false)
  }
}
