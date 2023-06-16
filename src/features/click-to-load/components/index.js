import { DDGCtlLoginButton } from './ctl-login-button.js'
import { DDGCtlPlaceholderBlockedElement } from './ctl-placeholder-blocked.js'

/**
 * Register custom elements in this wrapper function to be called only when we need to
 * and also to allow remote-config later if needed.
 */
export function registerCustomElements () {
    if (!customElements.get(DDGCtlPlaceholderBlockedElement.CUSTOM_TAG_NAME)) {
        customElements.define(DDGCtlPlaceholderBlockedElement.CUSTOM_TAG_NAME, DDGCtlPlaceholderBlockedElement)
    }
    if (!customElements.get(DDGCtlLoginButton.CUSTOM_TAG_NAME)) {
        customElements.define(DDGCtlLoginButton.CUSTOM_TAG_NAME, DDGCtlLoginButton)
    }
}
