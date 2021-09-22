//
import make_thick_arc from '../utils/arc'
const WHITE = 0xffffff
const GREEN = 0x39ff14 // actually move to the target
const GRAY = 0x666666
const TARGET_SIZE_RADIUS = 30
const NOISE_DIM = 128


export default class BasicExample extends Phaser.GameObjects.Container {
  // vis cursor + target
  constructor(scene, x, y, has_feedback = true, has_noise = true) {
    let target = scene.add.circle(0, -100, TARGET_SIZE_RADIUS, GRAY)
    let center = scene.add.circle(0, 100, 15, WHITE)
    let img_cur = scene.add.image(0, 100, 'cursor').setOrigin(0, 0).setScale(0.2)

    let cur = scene.add.circle(0, 100, 10, WHITE, has_feedback)
    // noise arc
    let noise_tex = []
    let tmp = ['0', '2'] // 0 = black, 2 = white for the arne16 palette
    for (let i = 0; i < NOISE_DIM; i++) {
      noise_tex[i] = ''
      for (let j = 0; j < NOISE_DIM; j++) {
        noise_tex[i] += tmp[Math.floor(2 * Math.random())] // randomChoice
      }
    }

    let stims = [target, center, cur, img_cur]
    if (has_noise) {
      scene.textures.generate('noise2', { data: noise_tex, pixelWidth: 3, pixelHeight: 3 })
      // noise is the thing we draw
      // to "randomize", do a setPosition with two random ints
      // then rotate to some random PI*n/2
      let noise = scene.add.image(0, 0, 'noise2')
      let data = make_thick_arc(
        Math.PI + Math.PI / 3,
        Math.PI * 2 - Math.PI / 3,
        200,
        15 * 2 + 5,
        200 * 2 - TARGET_SIZE_RADIUS * 2
      )

      let mask = scene.add.polygon(0, 200, data, 0xffffff).setVisible(false).setDisplayOrigin(0, 0)
      noise.mask = new Phaser.Display.Masks.BitmapMask(scene, mask)
      stims.push(noise)
    }
    super(scene, x, y, stims)
    this.cur = cur
    let foo = [img_cur]
    let xp = 0
    let yp = -200
    scene.add.existing(this)
    this.tl1 = scene.tweens.timeline({
      loop: -1,
      loopDelay: 1000,
      paused: true,
      tweens: [
        {
          targets: [target],
          y: -100,
          ease: 'Linear',
          duration: 200,
          onStart: () => {
            target.fillColor = GRAY
          },
          onComplete: () => {
            target.fillColor = GREEN
          }
        },
        {
          offset: 800,
          targets: foo,
          y: -200,
          ease: 'Power2',
          duration: 1200
        },
        {
          offset: 800,
          targets: cur,
          x: xp,
          y: yp,
          ease: 'Power2',
          duration: 1200,
          onComplete: () => {
            target.fillColor = GRAY
            cur.x = 0
            cur.y = 100
            img_cur.y = 100
            img_cur.x = 0
          }
        }
      ]
    })
  }

  play() {
    this.tl1.play()
    this.tl1.resume()
  }
  stop() {
    this.tl1.pause()
  }
}
