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
    this.addEventListener('keydown', this._onKeyDown.bind(this))
  }

  get listbox() {
    return this.closest('ubermanu-listbox')
  }

  /**
   * Handles the click event.
   * @private
   */
  _onClick() {
    this.listbox?.toggleItem(this)
  }

  /**
   * Handles keyboard navigation.
   * @param {KeyboardEvent} event
   * @private
   */
  _onKeyDown(event) {
    const items = Array.from(this.listbox?.items).filter((item) => !item.disabled || item === this)
    const index = items.indexOf(this)

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        if (index > 0) {
          items[index - 1]?.focus()
          // TODO: Scroll the list box if the item is not visible.
        }
        break
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        if (index < items.length - 1) {
          items[index + 1]?.focus()
        }
        break
      case 'Home':
        event.preventDefault()
        items[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        items[items.length - 1]?.focus()
        break
      case ' ':
      case 'Enter':
        this._onClick()
    }
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
