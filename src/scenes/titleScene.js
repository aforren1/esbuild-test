import { median } from '../utils/medians'

const common_refresh_rates = [30, 60, 72, 75, 85, 90, 100, 120, 144, 240]

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' })
  }
  preload() {
    // load feedback images (check? x? sparks?)
    this.load.image('cursor', 'assets/cursor.png')
    this.load.image('mouse', 'assets/mouse.jpg')
    this.load.image('touchscreen', 'assets/touchscreen.jpg')
    this.load.image('trackball', 'assets/trackball.jpg')
    this.load.image('trackpad', 'assets/trackpad.jpg')
  }
  create() {
    let height = this.game.config.height
    let center = height / 2
    this.frame_times = Array(200).fill(0) // let's guess the frame rate

    this.i = 0

    let cb = (side) => {
      let dts = this.frame_times.map((ele, idx, arr) => ele - arr[idx - 1]).slice(1)
      let guess_rate = 1000 / median(dts)
      let nearest_rate = common_refresh_rates.sort((a, b) => Math.abs(guess_rate - a) - Math.abs(guess_rate - b))[0]
      console.log(this.game.loop.actualFps)
      console.log(`median: ${guess_rate}, nearest: ${nearest_rate}`)
      left.disableInteractive()
      right.disableInteractive()
      this.game.user_config['hand'] = side
      console.log(side)
      this.scale.startFullscreen()
      this.tweens.addCounter({
        from: 255,
        to: 0,
        duration: 2000,
        onUpdate: (t) => {
          let v = Math.floor(t.getValue())
          this.cameras.main.setAlpha(v / 255)
        },
        onComplete: () => {
          // TODO: https://docs.google.com/document/d/17pvFMFqtAIx0ZA6zMZRU_A2-VnjhNX9QlN1Cgy-3Wdg/edit
          this.input.mouse.requestPointerLock()
          this.scene.start('MainScene')
        }
      })
    }

    this.add.rectangle(center - 6, center, 6, 500, 0xffffff)

    let left = this.add.
      text(center - 250, center, 'Click this side\nif using the mouse\nwith your left hand.', {
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 35,
        color: '#dddddd',
        stroke: '#444444',
        strokeThickness: 6,
        align: 'center'
      }).
      setOrigin(0.5, 0.5).
      setInteractive().
      once('pointerdown', (ptr) => {
        cb('left')
      })
    let right = this.add.
      text(center + 250, center, 'Click this side\nif using the mouse\nwith your right hand.', {
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 35,
        color: '#dddddd',
        stroke: '#444444',
        strokeThickness: 6,
        align: 'center'
      }).
      setOrigin(0.5, 0.5).
      setInteractive().
      once('pointerdown', (ptr) => {
        cb('right')
      })
  }
  update() {
    this.frame_times[this.i] = this.game.loop.now
    this.i++
    this.i %= 200
  }
}
