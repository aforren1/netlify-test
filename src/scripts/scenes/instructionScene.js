import log from '../utils/logger'
import { ChestGroup } from '../objects/chestgroup'
import { TypingText } from '../objects/typingtext'

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

    // ChestGroup is currently just two chests
    let foo = new ChestGroup(this, center, center, 400)
    var originTime = window.performance.now()
    foo.prime(1, 1)
    this.events.on('chestdone', (l) => {
      // trial start time window.performance.now()
      // timestamp is in milliseconds
      console.log(`Scene-level for ${l.value}`)
      console.log(`Timestamp for event: ${l.time - originTime}`)
      console.log(`Device: ${l.type}`)
      // 1000ms for rumble effect, 1000ms to wait after chest opening
      this.time.delayedCall(2000, () => {
        foo.reset()
        foo.prime(0, 1)
        originTime = window.performance.now()
      })
    })

    let _tmptxt = `Get a [b][i][size=42][color=red]HIGH HONKING SCORE[/b][/i][/size][/color]!\nPress the [b][size=42]left[/b][/size] chest to continue.`
    let text = TypingText(this, center, center - 250, '', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#FFF',
      stroke: '#000',
      strokeThickness: 4,
      wrap: {
        mode: 'word',
        width: 600,
      },
      padding: {
        x: 32,
        y: 32,
      },
    })
      .setOrigin(0.5, 0.5)
      .start(_tmptxt, 100)
  }
}
