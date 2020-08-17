import log from '../utils/logger'
import { ChestGroup } from '../objects/chestgroup'
import { TypingText } from '../objects/typingtext'
import { Score } from '../objects/score'

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

    let score = new Score(this, center, center - 400)

    let _tmptxt = `Get a [b][i][size=42][color=red]HIGH HONKING SCORE[/b][/i][/size][/color]!\nPress the [b][size=42]left[/b][/size] chest to continue.\nFOo`
    let _tmp2 = `FOOBAR`
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
      maxlines: 3,
    })
      .setOrigin(0.5, 0.5)
      .start(_tmptxt, 100)
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
      console.log(`reward: ${l.reward}`)
      // 1000ms for rumble effect, 1000ms to wait after chest opening
      let cb = () => {}
      if (l.reward) {
        cb = () => {
          score.addScore(50)
        }
      }
      this.time.delayedCall(1000, cb)
      this.time.delayedCall(2000, () => {
        foo.reset()
        foo.prime(0, 1)
        originTime = window.performance.now()
        text.start(_tmp2, 100)
      })
    })
  }
}
