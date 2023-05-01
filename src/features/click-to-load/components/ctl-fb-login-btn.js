import { html } from "../../../dom-utils";
import css from "../assets/click-to-load.css";
import { logoImg } from "../ctl-assets";

export class DDGCtlFbLoginBtn extends HTMLElement {
  static CUSTOM_TAG_NAME = "ddg-ctl-fb-login-btn";

  /**
   *
   * @param {{
   *   devMode: boolean,
   *   text: string, // Button text
   *   hoverText: string, // Text for popover on button hover
   *   blockedIcon?: string, // The source of the icon to display in the button, if null the default block icon is used instead.
   *   originalElement: HTMLElement, // The original Facebook login button that this placeholder is replacing.
   *   sharedStrings: {readAbout: string, learnMore: string}, // Shared localized string
   *   onButtonClick: (originalElement: HTMLIFrameElement, replacementElement: HTMLElement) => (e: any) => void,
   * }} params
   */
  constructor(params) {
    super();
    this.params = params;
    /**
     * Create the shadow root, closed to prevent any outside observers
     * @type {ShadowRoot}
     */
    const shadow = this.attachShadow({
      mode: this.params.devMode ? "open" : "closed",
    });

    /**
     * Add our styles
     * @type {HTMLStyleElement}
     */
    const style = document.createElement("style");
    style.innerText = css;

    /**
     * Create the Facebook login button
     * @type {HTMLDivElement}
     */
    const loginButton = this.createLoginButton();

    /**
     * Append both to the shadow root
     */
    shadow.appendChild(loginButton);
    shadow.appendChild(style);
  }

  /**
   * Creates a placeholder Facebook login button. When clicked, a warning dialog
   * is displayed to the user. The login flow only continues if the user clicks to
   * proceed.
   * @returns {{ container: HTMLDivElement, button: HTMLButtonElement }}
   */
  createLoginButton() {
    const {
      text,
      hoverText,
      blockedIcon,
      sharedStrings,
      originalElement,
      onButtonClick,
    } = this.params;

    const { popoverStyle, arrowStyle } = this.calculatePopoverPosition();

    const blockedIconElement = blockedIcon
      ? html`<img
          class="ddg-fb-login-icon"
          heigh="28px"
          src="${blockedIcon}"
        /> `
      : html`
          <div class="ddg-blocked-circle">
            <div class="ddg-blocked-dash"></div>
          </div>
        `;

    const container = document.createElement("div");
    // Add our own styles and inherit any local class styles on the button
    container.classList.add("ddg-fb-login-container");

    container.innerHTML = html`
      <div id="DuckDuckGoPrivacyEssentialsHoverable">
        <!-- Login Button -->
        <button class="DuckDuckGoButton primary ddg-ctl-fb-login-btn">
          <div>${text}</div>
          ${blockedIconElement}
        </button>

        <!-- Popover - hover box -->
        <div
          id="DuckDuckGoPrivacyEssentialsHoverableText"
          class="ddg-popover"
          style="${popoverStyle}"
        >
          <div class="ddg-popover-arrow" style="${arrowStyle}"></div>

          <div class="ddg-title-header">
            <div class="ddg-logo">
              <img class="ddg-logo-img" src="${logoImg}" height="21px" />
            </div>
            <div
              id="DuckDuckGoPrivacyEssentialsCTLElementTitle"
              class="ddg-title-text"
            >
              DuckDuckGo
            </div>
          </div>

          <div class="ddg-popover-body">
            ${hoverText}
            <a
              class="ddg-text-link"
              aria-label="${sharedStrings.readAbout}"
              href="https://help.duckduckgo.com/duckduckgo-help-pages/privacy/embedded-content-protection/"
              target="_blank"
              id="learnMoreLink"
            >
              ${sharedStrings.learnMore}
            </a>
          </div>
        </div>
      </div>
    `.toString();

    container
      .querySelector(".ddg-ctl-fb-login-btn")
      .addEventListener("click", onButtonClick(originalElement, container));

    return container;
  }

  /**
   * The left side of the popover may go offscreen if the
   * login button is all the way on the left side of the page. This
   * If that is the case, dynamically shift the box right so it shows
   * properly.
   * @returns {{
   *  popoverStyle: string, // CSS styles to be applied in the Popover container
   *  arrowStyle: string,   // CSS styles to be applied in the Popover arrow
   * }}
   */
  calculatePopoverPosition() {
    const { originalElement } = this.params;
    const rect = originalElement.getBoundingClientRect();
    const textBubbleWidth = 360; // Should match the width rule in .ddg-popover
    const textBubbleLeftShift = 100; // Should match the CSS left: rule in .ddg-popover
    const arrowDefaultLocationPercent = 50;

    let popoverStyle;
    let arrowStyle;

    if (rect.left < textBubbleLeftShift) {
      const leftShift = -rect.left + 10; // 10px away from edge of the screen
      popoverStyle = `left: ${leftShift}px;`;
      const change =
        (1 - rect.left / textBubbleLeftShift) *
        (100 - arrowDefaultLocationPercent);
      arrowStyle = `left: ${Math.max(
        10,
        arrowDefaultLocationPercent - change
      )}%;`;
    } else if (
      rect.left + textBubbleWidth - textBubbleLeftShift >
      window.innerWidth
    ) {
      const rightShift = rect.left + textBubbleWidth - textBubbleLeftShift;
      const diff = Math.min(
        rightShift - window.innerWidth,
        textBubbleLeftShift
      );
      const rightMargin = 20; // Add some margin to the page, so scrollbar doesn't overlap.
      popoverStyle = `left: -${textBubbleLeftShift + diff + rightMargin}px;`;
      const change =
        (diff / textBubbleLeftShift) * (100 - arrowDefaultLocationPercent);
      arrowStyle = `left: ${Math.max(
        10,
        arrowDefaultLocationPercent + change
      )}%;`;
    } else {
      popoverStyle = `left: -${textBubbleLeftShift}px;`;
      arrowStyle = `left: ${arrowDefaultLocationPercent}%;`;
    }

    return { popoverStyle, arrowStyle };
  }
}

customElements.define(DDGCtlFbLoginBtn.CUSTOM_TAG_NAME, DDGCtlFbLoginBtn);
