import { html, render } from 'uhtml'
import css from './ddg-button.scss'

export class DDGButton extends HTMLElement {
    static CUSTOM_TAG_NAME = 'ddg-button'

    // variant = 'primary'
    // content

    constructor () {
        super()
        /**
         * Create the shadow root, closed to prevent any outside observers
         * @type {ShadowRoot}
         */
        this.shadow = this.attachShadow({ mode: 'closed' })
    }

    connectedCallback () {
        this.wasConnected = true
        this.update()
    }

    update () {
        if (!this.wasConnected) return
        render(this.shadow, this.template())
    }

    template () {
        return html`
            <style>${css}</style>
            <button class="ddg-button primary"><div>${this.content}</div></button>
        `
    }
}

customElements.define(DDGButton.CUSTOM_TAG_NAME, DDGButton)
