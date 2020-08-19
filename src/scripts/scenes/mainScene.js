import log from '../utils/logger'
import { ChestGroup } from '../objects/chestgroup'
import { Score } from '../objects/score'
import { Enum } from '../utils/enum'

const states = Enum(['FADE_IN', 'MAIN_LOOP', 'FADE_OUT'])

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' })
    this._state = states.FADE_IN
    this.entering = true
  }

  set state(newState) {
    if (this.state != newState) {
      this.entering = true
      this._state = newState
    }
  }

  get state() {
    return this._state
  }

  create(data) {
    let center = this.game.config.height / 2
    console.log(data)
    let score = new Score(this, center, center - 400, 0)
    score.addScore(data.score)
    this.score = score
    let chest = new ChestGroup(this, center, center, 400, 0)
    this.chest = chest
    this.tweens.add({
      targets: [score, chest],
      alpha: { from: 0, to: 1 },
      duration: 1000,
      onComplete: () => {
        this.state = states.MAIN_LOOP
      },
    })
  }
}
