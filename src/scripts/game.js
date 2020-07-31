import 'phaser' // TODO: split phaser imports up to let those trees shake
import '@babel/polyfill'

import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

export const config = {
  type: Phaser.AUTO,
  backgroundColor: '#1d1d1d',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    width: screen.height,
    height: screen.height
  },
  scene: [PreloadScene, MainScene]
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
