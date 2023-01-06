import { html, render } from 'uhtml'
import { sendMessage } from '../../../utils.js'
import {
    ddgFont, ddgFontBold // For YT CTL
} from '../../../assets/ctl-assets.js'
import './shared/ddg-button.js'

export class DDGCtlBlockContainer extends HTMLElement {
  static CUSTOM_TAG_NAME = 'ddg-ctl-block-container';
  /**
   *
   * @param {number} id
   * @param {string} videoUrl
   * @param {string} previewimage
   * @param {number} count
   */

   styles = {
       fontStyle: `
        @font-face{
            font-family: DuckDuckGoPrivacyEssentials;
            src: url(${ddgFont});
        }
        @font-face{
            font-family: DuckDuckGoPrivacyEssentialsBold;
            font-weight: bold;
            src: url(${ddgFontBold});
        }
    `
   }

   constructor (id, videoUrl) {
       super()
       this.id = id
       this.videoUrl = videoUrl
       this.count = 0

       // Put our custom font-faces inside the wrapper element, since
       // @font-face does not work inside a shadowRoot.
       // See https://github.com/mdn/interactive-examples/issues/887.
       const fontFaceStyleElement = document.createElement('style')
       fontFaceStyleElement.textContent = this.styles.fontStyle
       this.append(fontFaceStyleElement)

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
       return html`
       <style>${this.styles.fontStyle}</style>
      <div>
        CTL test
        <p>Count: ${++this.count}</p>
        <p>Title: ${this.title}</p>
        <p>Preview Image: ${this.previewimage}</p>
        <ddg-button .content=${'content test'}>Test</ddg-button>
      </div>
    `
   }

   update () {
       if (!this.wasConnected) return
       render(this.shadow, this.template())
   }

   handleYouTubeDetails () {
       this.getYouTubeVideoDetails()
       window.addEventListener(
           'ddg-ctp-youTubeVideoDetails',
           ({ detail: { videoURL: videoURLResp, status, title, previewImage } }) => {
               if (videoURLResp !== this.videoUrl) {
                   return
               }
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

customElements.define(
    DDGCtlBlockContainer.CUSTOM_TAG_NAME,
    DDGCtlBlockContainer
)
