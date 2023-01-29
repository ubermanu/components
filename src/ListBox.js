import { LitElement } from 'lit'

/**
 * Implements an accessible, multi-selectable list box.
 */
export class ListBox extends LitElement {
  static get properties() {
    return {}
  }

  constructor() {
    super()

    // Set the role to listbox if not already set.
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listbox')
    }
  }

  /**
   * Returns all items.
   * @returns {NodeListOf<Element>}
   */
  get items() {
    return this.querySelectorAll('[role="option"]')
  }

  /**
   * Returns the selected items.
   * @returns {Array<Element>}
   */
  selectedItems() {
    return Array.from(this.items).filter((item) => item.selected && !item.disabled)
  }

  /**
   * Selects an item.
   * @param item
   */
  selectItem(item) {
    if (item.disabled) {
      return
    }
    item.selected = true
  }

  /**
   * Deselects an item.
   * @param item
   */
  deselectItem(item) {
    if (item.disabled) {
      return
    }
    item.selected = false
  }

  /**
   * Toggles an item.
   * @param item
   */
  toggleItem(item) {
    if (item.selected) {
      this.deselectItem(item)
    } else {
      this.selectItem(item)
    }
  }

  /**
   * Selects all items.
   */
  selectAll() {
    this.items.forEach((item) => {
      this.selectItem(item)
    })
  }

  /**
   * Deselects all items.
   */
  deselectAll() {
    this.items.forEach((item) => {
      this.deselectItem(item)
    })
  }

  /**
   * Focus the first non-disabled item.
   */
  focus() {
    Array.from(this.items)
      .find((item) => !item.disabled)
      ?.focus()
  }

  createRenderRoot() {
    return this
  }
}
