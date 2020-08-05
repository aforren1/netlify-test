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
    let cont = new ContinueButton(this, center, center - 100)
    // todo: use rexshakepositionplugin for selection effect
    let foo = this.add.sprite(center - 300, center, 'chest', 0).setOrigin(0.5, 0.5)
    this.add.sprite(center, center, 'chest', 1).setOrigin(0.5, 0.5)
    this.add.sprite(center + 300, center, 'chest', 2).setOrigin(0.5, 0.5)

    let emitter = this.add.particles('coin').createEmitter({
      frame: { frames: [0, 1, 2, 3, 4, 5], cycle: false },
      x: center - 300,
      y: center - 20,
      speed: { min: -450, max: 450 },
      angle: { min: 0, max: 360 },
      frequency: 30,
      lifespan: { min: 300, max: 1000 },
      gravityY: 800,
      alpha: { start: 1, end: 0 },
      scale: 0.5,
      active: false,
      delay: { min: 0, max: 100 },
    })

    foo.setInteractive()
    let shaker = this.plugins.get('rexShakePosition').add(foo, {
      duration: 1000,
      magnitude: 5,
    })
    foo.once('pointerdown', (p) => {
      shaker.shake()
    })
    shaker.on('complete', (gameobj, shake) => {
      gameobj.setFrame(2)
      emitter.active = true
      emitter.explode(50)
    })
  }
}
