// TODO: nice textured shape behind (for easy identification of spatial change)
export class Chest extends Phaser.GameObjects.Container {
  constructor(scene, x, y, letter) {
    let img = scene.add.sprite(0, 0, 'chest', 0).setOrigin(0.5, 0.5)
    let letter_txt = scene.add
      .text(-35, 80, letter, {
        fontFamily: 'Arial',
        fontSize: 80,
        color: '#FFF',
        stroke: '#000',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5, 0.5)
    super(scene, x, y, [img, letter_txt])
    scene.add.existing(this)
    this.scene = scene
    this.letter = letter
    this.sprite = img
    this.jangle = scene.sound.add('jangle')
    this.thump = scene.sound.add('thump')
    this.reset()
    this.emitter = scene.add.particles('coin').createEmitter({
      frame: { frames: [0, 1, 2, 3, 4, 5], cycle: false },
      x: x,
      y: y - 20,
      speed: { min: 300, max: 600 },
      angle: { min: 240, max: 300 },
      frequency: 30,
      lifespan: { min: 300, max: 1000 },
      gravityY: 800,
      alpha: { start: 1, end: 0 },
      scale: 0.5,
      active: false,
      delay: { min: 0, max: 100 },
    })

    this.shaker = scene.plugins.get('rexShakePosition').add(this, {
      duration: 1000,
      magnitude: 5,
    })
    // 0 is closed, 1 is empty, 2 is full
    this.shaker.on(
      'complete',
      (gameobj, shake) => {
        let frame = 1
        if (this.reward) {
          frame = 2
          this.emitter.active = true
          this.emitter.explode(50)
          this.jangle.play()
        } else {
          this.thump.play()
        }
        this.sprite.setFrame(frame)
      },
      this
    )
  }
  reset() {
    this.reward = false
    this.sprite.setFrame(0)
    this.disable()
  }
  prime(reward, other) {
    this.other = other
    let cb = (p) => {
      // ugh, downTime is mouse and timeDown is keyboard
      let time = p.downTime | p.timeDown
      let type = p.downTime ? 'pointer' : 'keyboard'
      this.scene.events.emit('chestdone', { value: this.letter, type: type, time: time })
      this.shaker.shake()
      this.disable()
      this.other.disable()
    }
    this.reward = reward
    let key = this.scene.input.keyboard.addKey(this.letter)
    this.setInteractive(new Phaser.Geom.Rectangle(-110, -110, 220, 220), Phaser.Geom.Rectangle.Contains)
    key.once('down', cb)
    this.once('pointerdown', cb)
  }
  disable() {
    this.removeInteractive()
    this.removeAllListeners()
    this.scene.input.keyboard.removeKey(this.letter)
  }
}
