import { LitElement } from 'lit'

/**
 * Implements an accessible, multi-selectable list box.
 */
export class ListBoxItem extends LitElement {
  static get properties() {
    return {
      /**
       * If selected, the list box item will be marked as selected.
       * The list box item will still be focusable.
       */
      selected: { type: Boolean, reflect: true },

      /**
       * If disabled, the list box item will not be focusable.
       */
      disabled: { type: Boolean, reflect: true },

      /**
       * The value of the list box item.
       * This value will be used to identify the list box item.
       */
      value: { type: String, reflect: true }
    }
  }

  constructor() {
    super()
    this.selected = false
    this.disabled = false
    this.value = ''
    this.tabIndex = 0

    // Set the role to option if not already set.
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'option')
    }

    // Bind event listeners.
    this.addEventListener('click', this._onClick.bind(this))
  }

  get listbox() {
    return this.closest('[role="listbox"]')
  }

  /**
   * Handles the click event.
   * @private
   */
  _onClick() {
    this.listbox?.toggleItem(this)
  }

  /**
   * Updates the element with additional attributes.
   */
  requestUpdate() {
    super.requestUpdate(...arguments)

    this.setAttribute('tabindex', this.disabled ? '-1' : '0')
    this.setAttribute('aria-hidden', this.disabled?.toString() ?? 'false')
    this.setAttribute('aria-selected', this.selected?.toString() ?? 'false')
    this.setAttribute('aria-disabled', this.disabled?.toString() ?? 'false')
  }

  createRenderRoot() {
    return this
  }
}
