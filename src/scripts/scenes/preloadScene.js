// load images, sounds, etc.
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('background', 'assets/img/background.png')
    this.load.spritesheet('coin', 'assets/img/coin_sprite.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('chest', 'assets/img/chest_sprite.png', { frameWidth: 220, frameHeight: 220 })

    this.load.audio('jangle', 'assets/sounds/jangle.mp3')
    this.load.audio('thump', 'assets/sounds/thump.mp3')
  }

  create() {
    let height = this.game.config.height
    let center = height / 2
    let scale_factor = height / 512 // we know the size of the image a priori
    this.add.image(center, center, 'background').setOrigin(0.5, 0.5).setScale(scale_factor)
    this.scene.launch('TitleScene')
  }
}
