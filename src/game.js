import Phaser from './phaser-custom'

// import 'devtools-detect'
import UAParser from 'ua-parser-js'

import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js'
import TextTypingPlugin from 'phaser3-rex-plugins/plugins/texttyping-plugin.js'

let small_dim = window.screen.height
const phaser_config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: small_dim,
    height: small_dim
  },
  audio: {
    noAudio: true
  },
  scene: [],
  plugins: {
    global: [
      {
        key: 'rexBBCodeTextPlugin',
        plugin: BBCodeTextPlugin,
        start: true
      },
      {
        key: 'rexTextTypingPlugin',
        plugin: TextTypingPlugin,
        start: true
      }
    ]
  }
}

window.addEventListener('load', () => {

  const game = new Phaser.Game(phaser_config)
  // TODO: figure out prolific/mturk/elsewhere here (URL parsing)
  // Remember that localStorage *only stores strings*
  const url_params = new URL(window.location.href).searchParams
  // If coming from prolific, use that ID. Otherwise, generate some random chars
  const randomString = (length) =>
    [...Array(length)].
      map(() => (~~(Math.random() * 36)).toString(36)).
      join('')
  let id =
    url_params.get('SONA_ID') ||
    url_params.get('PROLIFIC_PID') ||
    url_params.get('id') ||
    randomString(8)
  let reference_angle = 270
  // rotation or clamp, default to clamp
  let manipulation = url_params.get('manipulation') || 'clamp'
  if (!['rotation', 'clamp'].includes(manipulation)) {

    console.error('Manipulation not found.')

  }
  let ua_res = new UAParser().getResult()
  let user_config = {
    id: id.slice(0, 8), // just the first part of the ID, we don't need to store the whole thing
    is_prolific: url_params.get('PROLIFIC_PID') !== null,
    is_sona: url_params.get('SONA_ID') !== null,
    institution: 'yale',
    description: 'consciousness clamp v1',
    datetime: new Date(),
    already_visited: localStorage.getItem('conscious-clamp') !== null,
    manipulation: manipulation,
    width: game.config.width,
    height: game.config.height,
    renderer: game.config.renderType === Phaser.CANVAS ? 'canvas' : 'webgl',
    // only take a subset of the UA results-- we don't need everything
    user_agent: {
      browser: ua_res.browser,
      os: ua_res.os
    },
    fullscreen_supported: document.fullscreenEnabled, // this is pretty important for us?
    debug: url_params.get('debug') !== null,
    version: 1,
    reference_angle: reference_angle
  }
  game.user_config = user_config // patch in to pass into game
  // set up for user
  localStorage.setItem('conscious-clamp', 1)

})

// once the data is successfully sent, null this out
// need to log this too
export function onBeforeUnload(event) {

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
  event.preventDefault()
  event.returnValue = ''
  return 'experiment not done yet.'

}
// TODO: add back after iterating
// window.addEventListener('beforeunload', onBeforeUnload)

// if prematurely ended, shuffle logs away?
// we'll at least store a local time to get an idea if they're
// refreshing
// window.addEventListener('unload', (event) => {})

// breaks on IE, so dump if that's really a big deal
// Might be able to polyfill our way out, too?
// window.addEventListener('devtoolschange', (event) => {
//   log.warn(`Devtools opened: ${event.detail.isOpen} at time ${window.performance.now()}`)
// })
