import { postData } from '../utils/comms'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.input.once(
      'pointerdown',
      function () {
        this.scale.startFullscreen()
      },
      this
    )

    let config = this.game.config
    this.cameras.main.setBounds(-config.width / 2, -config.height / 2, config.width, config.height)

    // border
    let path = new Phaser.Curves.Path(config.width / 2, 0)
    path.circleTo(config.width / 2, true)
    var emitter = this.add.particles('red').createEmitter({
      x: 0,
      y: 0,
      blendMode: 'ADD',
      scale: { start: 0.2, end: 0 },
      speed: { min: -100, max: 100 },
      lifespan: { min: 200, max: 1000 },
      quantity: 150,
      emitZone: { type: 'random', source: path },
      on: false,
    })

    // targets (just visual, not interactive)
    const cursor_diameter = Math.round(config.height * 0.01)
    var x
    var y
    var angles = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75]
    for (let i = 0; i < angles.length; i++) {
      let angle2 = angles[i] * Math.PI
      x = Math.round(Math.cos(angle2) * (config.height / 4))
      y = Math.round(Math.sin(angle2) * (config.height / 4))
      this.add.circle(x, y, cursor_diameter * 2, 0x555555).setOrigin(0.5, 0.5)
    }
    // center position
    this.add.circle(0, 0, cursor_diameter * 2, 0x555555).setOrigin(0.5, 0.5)

    // collision target

    this.target = this.add.circle(x, y, cursor_diameter * 4, 0xff0000)
    this.target.setOrigin(0.5, 0.5)
    this.target.setStrokeStyle(2, 0xffffff)

    // cursor machinery
    this.cursor = this.add.circle(0, 0, cursor_diameter, 0xffffff).setOrigin(0.5, 0.5)
    this.cursor_pos = { x: 0, y: 0, t: 0 }
    this.input.on(
      'pointerdown',
      function (pointer) {
        this.input.mouse.requestPointerLock()
      },
      this
    )
    this.t0 = 0
    // this.input.setPollAlways();
    var prev = 0
    this.input.on(
      'pointermove',
      function (pointer) {
        var timestamp = window.performance.now()
        var p_time = pointer.event.timeStamp
        //console.log(p_time, ', ', p_time - prev);
        prev = p_time
        //console.log(pointer.event.timeStamp  + ', ' + timestamp + ', ' + (pointer.event.timeStamp - timestamp));
        if (this.input.mouse.locked) {
          var dx = pointer.movementX
          var dy = pointer.movementY
          var time = timestamp // pointer.event.timeStamp;
          var dt = (time - this.cursor_pos.t) / 1000
          this.cursor_pos.t = time // update time
          var rad = Math.sqrt(Math.pow(this.cursor_pos.x + dx, 2) + Math.pow(this.cursor_pos.y + dy, 2))
          //console.log('ttmp: ' + ttmp + ', dt: ' + dt + ', velocity: ' + Math.sqrt(dx ** 2 + dy ** 2)/dt); // dpix/dms
          if (rad <= config.width / 2 && rad <= config.height / 2) {
            this.cursor_pos.x += dx
            this.cursor_pos.y += dy
            //var tmp = Phaser.Math.Rotate({ x: pointer.worldX, y: pointer.worldY }, Phaser.Math.DegToRad(0));
            var tmp = Phaser.Math.Rotate({ x: this.cursor_pos.x, y: this.cursor_pos.y }, Phaser.Math.DegToRad(45))
            this.cursor.x = tmp.x
            this.cursor.y = tmp.y
          } else {
            if (pointer.event.timeStamp > this.t0) {
              emitter.start()
              emitter.explode()
              this.t0 = pointer.event.timeStamp + 200
            }
          }
        }
      },
      this
    )

    var keyObj = this.input.keyboard.addKey('W')
    keyObj.on('down', function (event) {
      console.log('Key pressed')
      var data = { data: Array.from(Array(5000).keys()), logs: { a: [100, 200] } }
      Promise.all(postData(data)).then((r) => console.log(r))
    })
  }
}
