import { globalData } from './utils/globaldata'
import 'phaser' // TODO: split phaser imports up to let those trees shake
import '@babel/polyfill'
import log from './utils/logger'
import 'devtools-detect'
import UAParser from 'ua-parser-js'

import RoundRectanglePlugin from 'phaser3-rex-plugins/plugins/roundrectangle-plugin.js'
import ShakePositionPlugin from 'phaser3-rex-plugins/plugins/shakeposition-plugin.js'
import TextTypingPlugin from 'phaser3-rex-plugins/plugins/texttyping-plugin.js'
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js'

import TitleScene from './scenes/titleScene'
import PreloadScene from './scenes/preloadScene'
import InstructionScene from './scenes/instructionScene'
import MainScene from './scenes/mainScene'
import EndScene from './scenes/endScene'

//let small_dim = Math.min(screen.width, screen.height)
let small_dim = 1000
const config = {
  type: Phaser.AUTO,
  backgroundColor: '#1d1d1d',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: small_dim,
    height: small_dim,
  },
  scene: [PreloadScene, TitleScene, InstructionScene, MainScene, EndScene],
  plugins: {
    global: [
      { key: 'rexShakePosition', plugin: ShakePositionPlugin, start: true },
      {
        key: 'rexRoundRectanglePlugin',
        plugin: RoundRectanglePlugin,
        start: true,
      },
      {
        key: 'rexTextTypingPlugin',
        plugin: TextTypingPlugin,
        start: true,
      },
      {
        key: 'rexBBCodeTextPlugin',
        plugin: BBCodeTextPlugin,
        start: true,
      },
    ],
  },
}

window.addEventListener('load', () => {
  // fixed seed for everyone
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
  let visitTimes = localStorage.getItem('visit_times')
  if (visitTimes === null) {
    visitTimes = [new Date()]
  } else {
    visitTimes = JSON.parse(visitTimes)
    visitTimes.push(new Date())
  }
  localStorage.setItem('visit_times', JSON.stringify(visitTimes))
  localStorage.setItem('returning', 'y')
  let exitTimes = localStorage.getItem('exit_times')
  if (exitTimes !== null) {
    exitTimes = JSON.parse(exitTimes)
  }
  const url_params = new URL(window.location.href).searchParams
  const randomString = (length) => [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('')
  let id = url_params.get('PROLIFIC_PID') || randomString(10)
  globalData.config = {
    id: id,
    // if not on prolific, might be all null
    prolific_config: {
      prolific_pid: url_params.get('PROLIFIC_PID'),
      study_id: url_params.get('STUDY_ID'),
      session_id: url_params.get('SESSION_ID'),
    },
    width: conf.width,
    height: conf.height,
    renderer: rt,
    user_agent: res,
    first_visit: firstVisit,
    start_date: visitTimes.slice(-1)[0],
    start_dates: visitTimes,
    exit_dates: exitTimes,
  }
})

// once the data is successfully sent, null this out
// need to log this too
export function onBeforeUnload(event) {
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
  event.preventDefault()
  log.warn('Early termination impending?')
  event.returnValue = ''
  return 'experiment not done yet.'
}
window.addEventListener('beforeunload', onBeforeUnload)

// if prematurely ended, shuffle logs away?
// we'll at least store a local time to get an idea if they're
// refreshing
window.addEventListener('unload', (event) => {
  let store = window.localStorage
  let exits = store.getItem('exit_times')
  if (exits === null) {
    exits = [new Date()]
  } else {
    exits = JSON.parse(exits)
    exits.push(new Date())
  }
  store.setItem('exit_times', JSON.stringify(exits))
})

// breaks on IE, so dump if that's really a big deal
// Might be able to polyfill our way out, too?
window.addEventListener('devtoolschange', (event) => {
  log.warn('Devtools opened: ' + event.detail.isOpen)
})
