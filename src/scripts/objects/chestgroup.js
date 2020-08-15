import { Chest } from './chest'

// TODO: replace with e.g. https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-gridbuttons/
// use Phaser.Actions.GridAlign
// docs: https://photonstorm.github.io/phaser3-docs/Phaser.Types.Actions.html
// GridAlign aligns to top left of rect,
// center on x, y; letters determines number of chests
// cellSize is the spacing between chests
// nrow * ncol should === number of letters
// post-hoc moving is tough, unless we just make
// this a function. We might want to anyway, since
// we'll keep flipping positions around
// https://phasergames.com/phaser-3-dispatching-custom-events/
//
// it's good to have left/right here but not have actual chest identity
// tied to current position
export class ChestGroup {
  constructor(scene, x, y, offset) {
    this.scene = scene
    this.events = this.scene.events
    this.left = new Chest(scene, x - offset / 2, y, 'A')
    this.right = new Chest(scene, x + offset / 2, y, 'L')
    this.reset()
  }
  reset() {
    this.left.reset()
    this.right.reset()
    this.disable()
  }
  prime(lval, rval) {
    this.left.prime(lval, this.right)
    this.right.prime(rval, this.left)
  }
  disable() {
    // remove event handlers
    this.left.disable()
    this.right.disable()
  }
}
