import { html, render } from 'uhtml'
import { sendMessage } from '../../../utils.js'

export class DDGCtlBlockContainer extends HTMLElement {
  static CUSTOM_TAG_NAME = 'ddg-ctl-block-container';
  /**
   *
   * @param {number} id
   * @param {string} videoUrl
   * @param {string} previewimage
   * @param {number} count
   */

  constructor (id, videoUrl) {
      super()
      this.id = id
      this.videoUrl = videoUrl
      this.count = 0

      /**
     * Create the shadow root, closed to prevent any outside observers
     * @type {ShadowRoot}
     */
      this.shadow = this.attachShadow({ mode: 'closed' })

      /**
     * Add our styles
     * @type {HTMLStyleElement}
     */
      const style = document.createElement('style')
      style.innerText = '* { background: red; }'

      /**
     * Append both to the shadow root
     */
      this.shadow.appendChild(style)
  }

  connectedCallback () {
      this.wasConnected = true
      this.handleYouTubeDetails()
      this.update()
  }

  template () {
      console.log(this.id, 'render template')
      return html`
      <div>
        CTL test
        <p>Count: ${++this.count}</p>
        <p>Title: ${this.title}</p>
        <p>Preview Image: ${this.previewimage}</p>
      </div>
    `
  }

  update () {
      if (!this.wasConnected) return
      render(this.shadow, this.template())
  }

  handleYouTubeDetails () {
      this.getYouTubeVideoDetails()
      window.addEventListener('ddg-ctp-youTubeVideoDetails',
          ({ detail: { videoURL: videoURLResp, status, title, previewImage } }) => {
              if (videoURLResp !== this.videoUrl) { return }
              console.log(this.id, 'wc event listener')
              if (status === 'success') {
                  this.title = title
                  this.previewimage = previewImage
                  this.update()

                  // widget.autoplay = true
              }
          }
      )
  }

  getYouTubeVideoDetails () {
      sendMessage('getYouTubeVideoDetails', this.videoUrl)
  }
}

customElements.define(DDGCtlBlockContainer.CUSTOM_TAG_NAME, DDGCtlBlockContainer)
