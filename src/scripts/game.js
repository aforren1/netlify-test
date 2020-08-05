import { globalData } from './utils/globaldata'
import 'phaser' // TODO: split phaser imports up to let those trees shake
import '@babel/polyfill'
import log from './utils/logger'
import 'devtools-detect'
import UAParser from 'ua-parser-js'
import RoundRectanglePlugin from 'phaser3-rex-plugins/plugins/roundrectangle-plugin.js'

import TitleScene from './scenes/titleScene'
import PreloadScene from './scenes/preloadScene'
import InstructionScene from './scenes/instructionScene'

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#1d1d1d',
  resolution: window.devicePixelRatio,
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: screen.height,
    height: screen.height,
  },
  scene: [PreloadScene, TitleScene, InstructionScene],
  plugins: {
    global: [
      {
        key: 'rexRoundRectanglePlugin',
        plugin: RoundRectanglePlugin,
        start: true,
      },
    ],
  },
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
  log.info('Phaser loaded.')
  let conf = game.config
  let rt = 'webgl'
  if (conf.renderType === Phaser.CANVAS) {
    rt = 'canvas'
  }
  let res = new UAParser().getResult()
  // TODO: figure out prolific/mturk/elsewhere here (URL parsing)

  let firstVisit = true
  let localStorage = window.localStorage
  if (localStorage.getItem('returning') !== null) {
    firstVisit = false
  }
  localStorage.setItem('returning', 'y')
  globalData.config = { width: conf.width, height: conf.height, renderer: rt, user_agent: res, first_visit: firstVisit }
  log.warn('Config:' + JSON.stringify(globalData.config, null, '  '))
  // console.log(log.toJSON())
})

// once the data is successfully sent, null this out
// need to log this too
window.addEventListener('beforeunload', (event) => {
  log.warn('Early termination impending?')
  return 'experiment not done yet.'
})

// if prematurely ended, shuffle logs away?
window.addEventListener('unload', (event) => {})

// breaks on IE, so dump if that's really a big deal
// Might be able to polyfill our way out, too?
window.addEventListener('devtoolschange', (event) => {
  log.warn('Devtools opened: ' + event.detail.isOpen)
})
