import { css, html, LitElement } from 'lit'

/**
 * Implements an accessible day cell.
 * Renders its day with aria-* attributes.
 */
export class DayGridItem extends LitElement {
  static get properties() {
    return {
      /**
       * The date of the day cell in the ISO format (e.g. 2023-01-29T11:53:27.319Z).
       */
      date: { type: String, reflect: true },

      /**
       * If disabled, the day cell will not be focusable.
       */
      disabled: { type: Boolean, reflect: true },
    }
  }

  constructor() {
    super()
    this.date = ''
    this.tabIndex = -1
    this.disabled = true

    // Bind event listeners.
    this.addEventListener('keydown', this._onKeyDown.bind(this))
  }

  /**
   * Get the day of the day cell.
   * @returns {number}
   */
  get day() {
    return new Date(this.date).getDate()
  }

  /**
   * Get the month of the day cell.
   * @returns {number}
   */
  get month() {
    return new Date(this.date).getMonth()
  }

  /**
   * Get the year of the day cell.
   * @returns {number}
   */
  get year() {
    return new Date(this.date).getFullYear()
  }

  /**
   * Get the language of the day cell.
   * @returns {string}
   */
  get lang() {
    return (
      this.getAttribute('lang') ||
      this.grid?.lang ||
      document.documentElement.lang ||
      'en'
    )
  }

  /**
   * Returns true if the day cell is today.
   * @returns {boolean}
   */
  get isToday() {
    const today = new Date()
    const date = new Date(this.date)
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    )
  }

  /**
   * Returns the day grid that contains this day cell.
   * @returns {Element}
   */
  get grid() {
    return this.closest('ubermanu-daygrid')
  }

  /**
   * Returns true if the day cell is the first day of the month.
   * @returns {boolean}
   */
  get isFirstDayOfMonth() {
    return this.day === 1
  }

  /**
   * Returns true if the day cell is the last day of the month.
   * @returns {boolean}
   */
  get isLastDayOfMonth() {
    const date = new Date(this.date)
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    return this.day === nextDate.getDate() - 1
  }

  /**
   * Returns true if the day cell is the first day of the year.
   * @returns {boolean}
   */
  get isFirstDayOfYear() {
    return this.day === 1 && this.month === 0
  }

  /**
   * Returns true if the day cell is the last day of the year.
   * @returns {boolean}
   */
  get isLastDayOfYear() {
    return this.day === 31 && this.month === 11
  }

  /**
   * Returns true if the day cell is the first day of the week (according to the lang attr).
   * @returns {boolean}
   */
  get isFirstDayOfWeek() {
    const date = new Date(this.date)
    // TODO: Check for Intl.Locale polyfill
    const locale = new Intl.Locale(this.lang)
    const firstDayOfWeek = locale?.weekInfo.firstDay ?? 0
    return (date.getDay() || 7) === firstDayOfWeek
  }

  /**
   * Returns true if the day cell is the last day of the week.
   * @returns {boolean}
   */
  get isLastDayOfWeek() {
    const date = new Date(this.date)
    // TODO: Check for Intl.Locale polyfill
    const locale = new Intl.Locale(this.lang)
    const firstDayOfWeek = locale?.weekInfo.firstDay ?? 0
    return (date.getDay() || 7) === (firstDayOfWeek + 6) % 7
  }

  /**
   * Returns true if the day cell is a weekend day (according to the lang attr).
   * @returns {*|boolean}
   */
  get isWeekend() {
    const date = new Date(this.date)
    // TODO: Check for Intl.Locale polyfill
    const locale = new Intl.Locale(this.lang)
    return locale?.weekInfo?.weekend.includes(date.getDay() || 7) ?? false
  }

  /**
   * Returns the formatted date of the day cell according to the language.
   * @returns {string}
   */
  get formattedDate() {
    const date = new Date(this.date)
    return date.toLocaleDateString(this.lang, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  /**
   * Keyboard navigation.
   * When the day cell is focused, the following keys are supported:
   * - ArrowUp: Select the day cell above.
   * - ArrowDown: Select the day cell below.
   * - ArrowLeft: Select the day cell on the left.
   * - ArrowRight: Select the day cell on the right.
   * - Home: Select the first day cell of the month.
   * - End: Select the last day cell of the month.
   * @param {KeyboardEvent} event
   * @private
   */
  _onKeyDown(event) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        const weekBefore = new Date(this.date)
        weekBefore.setDate(weekBefore.getDate() - 7)
        this.grid?.jumpToDate(weekBefore)
        break
      case 'ArrowDown':
        event.preventDefault()
        const weekAfter = new Date(this.date)
        weekAfter.setDate(weekAfter.getDate() + 7)
        this.grid?.jumpToDate(weekAfter)
        break
      case 'ArrowLeft':
        event.preventDefault()
        const dayBefore = new Date(this.date)
        dayBefore.setDate(dayBefore.getDate() - 1)
        this.grid?.jumpToDate(dayBefore)
        break
      case 'ArrowRight':
        event.preventDefault()
        const dayAfter = new Date(this.date)
        dayAfter.setDate(dayAfter.getDate() + 1)
        this.grid?.jumpToDate(dayAfter)
        break
      case 'Home':
        event.preventDefault()
        const firstDayOfMonth = new Date(this.date)
        firstDayOfMonth.setDate(1)
        this.grid?.jumpToDate(firstDayOfMonth)
        break
      case 'End':
        event.preventDefault()
        const lastDayOfMonth = new Date(this.date)
        lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1)
        lastDayOfMonth.setDate(0)
        this.grid?.jumpToDate(lastDayOfMonth)
        break
      case 'PageUp':
        event.preventDefault()
        const monthBefore = new Date(this.date)
        monthBefore.setMonth(monthBefore.getMonth() - 1)
        this.grid?.jumpToDate(monthBefore)
        break
      case 'PageDown':
        event.preventDefault()
        const monthAfter = new Date(this.date)
        monthAfter.setMonth(monthAfter.getMonth() + 1)
        this.grid?.jumpToDate(monthAfter)
        break
    }
  }

  /**
   * Updates additional attributes when the day cell is updated.
   */
  requestUpdate() {
    super.requestUpdate(...arguments)

    // If the day cell is disabled, it should not be focusable.
    if (this.disabled) {
      this.tabIndex = -1
      this.ariaHidden = 'true'
    } else {
      this.tabIndex = 0
      this.ariaHidden = 'false'
    }

    // If the date is today, it should be marked as such.
    if (this.isToday) {
      this.setAttribute('today', '')
    } else {
      this.removeAttribute('today')
    }

    // If the date is a weekend day, it should be marked as such.
    if (this.isWeekend) {
      this.setAttribute('weekend', '')
    } else {
      this.removeAttribute('weekend')
    }
  }

  render() {
    return html`<span aria-label="${this.formattedDate}">${this.day}</span>`
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `
  }
}
