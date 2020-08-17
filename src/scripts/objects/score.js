export class Score extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    let rect = scene.add.rexRoundRectangle(0, 0, 250, 100, 8, 0xdaa878).setOrigin(0.5, 0.5).setStrokeStyle(8, 0xfece66)
    let text = scene.add
      .text(0, 0, '0', { fontFamily: 'Arial', fontSize: 64, align: 'center', stroke: '#000', strokeThickness: 4 })
      .setOrigin(0.5, 0.5)
    super(scene, x, y, [rect, text])
    this.text = text
    this.rect = rect
    this.score = 0
    scene.add.existing(this)
  }

  addScore(points) {
    // only animate if we're getting more points
    if (points > 0) {
      this.rect.setFillStyle(0x00ff7f)
      this.scene.tweens.addCounter({
        from: this.score,
        to: this.score + points,
        duration: 1000,
        ease: 'Cubic.easeOut',
        onUpdate: (t) => {
          let v = Math.ceil(t.getValue())
          this.text.text = v
        },
      })
      let timeline = this.scene.tweens.createTimeline()
      timeline.add({
        targets: this.text,
        scale: 1.2,
        ease: 'Cubic.easeIn',
        duration: 300,
      })
      timeline.add({
        targets: this.text,
        scale: 1,
        ease: 'Cubic.easeOut',
        duration: 700,
        onComplete: () => {
          this.rect.setFillStyle(0xdaa878)
        },
      })
      timeline.play()
      this.score += points
    }
  }
  reset() {
    this.addScore(-this.score)
  }
}
