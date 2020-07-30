// load images, sounds, etc.
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('red', 'assets/img/red.png')
  }

  create() {
    this.scene.start('MainScene')
  }
}
