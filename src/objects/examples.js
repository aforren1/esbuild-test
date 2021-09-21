//
const WHITE = 0xffffff
const GREEN = 0x39ff14 // actually move to the target
const GRAY = 0x666666
const TARGET_SIZE_RADIUS = 30

export default class BasicExample extends Phaser.GameObjects.Container {
  // vis cursor + target
  constructor(scene, x, y, has_feedback = true) {
    let target = scene.add.circle(-200, 0, TARGET_SIZE_RADIUS, GRAY)
    let center = scene.add.circle(200, 0, 15, WHITE)
    let img_cur = scene.add.image(200, 0, 'cursor').setOrigin(0, 0).setScale(0.2)

    let cur = scene.add.circle(200, 0, 10, WHITE, has_feedback)
    super(scene, x, y, [target, center, cur, img_cur])
    this.cur = cur
    let foo = [img_cur]
    let xp = -300
    let yp = 0
    scene.add.existing(this)
    this.tl1 = scene.tweens.timeline({
      loop: -1,
      loopDelay: 1000,
      paused: true,
      tweens: [
        {
          targets: [target],
          x: -200,
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
          x: -300,
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
            cur.x = 200
            cur.y = 0
            img_cur.x = 200
            img_cur.y = 0
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
