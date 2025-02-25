import { html, LitElement } from 'lit'
import { repeat } from 'lit/directives/repeat.js'

/**
 * Implements an accessible day grid. Exposes some methods to control its view
 * (e.g. previousMonth, nextMonth, etc.)
 */
export class DayGrid extends LitElement {
  static get properties() {
    return {
      /** The current month being displayed. */
      month: { type: Number, reflect: true },

      /** The current year being displayed. */
      year: { type: Number, reflect: true },

      /**
       * The start day of the week. 0 = Sunday 1 = Monday 2 = Tuesday 3 =
       * Wednesday 4 = Thursday 5 = Friday 6 = Saturday 7 = Sunday
       */
      startDay: { type: Number, reflect: true },
    }
  }

  constructor() {
    super()

    // The current month and year are set to the current date.
    const today = new Date()
    this.month = today.getMonth()
    this.year = today.getFullYear()

    // The start day is set according to the current locale.
    // If the locale is not supported, it will default to Monday.
    // TODO: Check polyfill support for Intl.Locale.
    const locale = new Intl.Locale(this.lang)
    this.startDay = locale?.weekInfo?.firstDay ?? 1
  }

  /**
   * Get the language of the grid.
   *
   * @returns {string}
   */
  get lang() {
    return this.getAttribute('lang') || document.documentElement.lang || 'en'
  }

  /**
   * Returns the weekdays of the calendar. The weekdays are represented by
   * numbers, where 0 is Sunday and 6 is Saturday. The weekdays are ordered
   * according to the start day of the calendar.
   *
   * @returns {any[]}
   */
  get weekdays() {
    const weekdays = []
    for (let i = this.startDay; i < this.startDay + 7; i++) {
      weekdays.push(i % 7)
    }
    return weekdays
  }

  /**
   * Moves the calendar to the previous month. If the current month is January,
   * it will move to December of the previous year. If the current year is not
   * set, it will not move. If the current month is not set, it will not move.
   */
  previousMonth() {
    if (this.year === -1 || this.month === -1) {
      return
    }

    if (this.month === 0) {
      this.month = 11
      this.year--
    } else {
      this.month--
    }

    this.requestUpdate()
  }

  /**
   * Moves the calendar to the next month. If the current month is December, it
   * will move to January of the next year. If the current year is not set, it
   * will not move. If the current month is not set, it will not move.
   */
  nextMonth() {
    if (this.year === -1 || this.month === -1) {
      return
    }

    if (this.month === 11) {
      this.month = 0
      this.year++
    } else {
      this.month++
    }

    this.requestUpdate()
  }

  /**
   * Moves the calendar to the previous year. If the current year is not set, it
   * will not move.
   */
  previousYear() {
    if (this.year === -1) {
      return
    }

    this.year--
    this.requestUpdate()
  }

  /**
   * Moves the calendar to the next year. If the current year is not set, it
   * will not move.
   */
  nextYear() {
    if (this.year === -1) {
      return
    }

    this.year++
    this.requestUpdate()
  }

  /**
   * Returns an array of days for the current month. The array will contain 42
   * days (6 weeks). The days of the previous month will be added to the
   * beginning of the array. The days of the next month will be added to the end
   * of the array. The previous and next months will be calculated according to
   * the start day of the calendar.
   *
   * @returns {Array}
   */
  getDaysData() {
    const days = []

    if (this.year === -1 || this.month === -1) {
      return days
    }

    // Add the days of the previous month.
    const firstDay = new Date(this.year, this.month, 1)
    const lastDayOfPreviousMonth = new Date(this.year, this.month, 0)

    const previousMonthDaysToAdd =
      firstDay.getDay() - this.startDay < 0
        ? firstDay.getDay() - this.startDay + 7
        : firstDay.getDay() - this.startDay

    for (let i = previousMonthDaysToAdd; i > 0; i--) {
      days.push({
        date: new Date(
          this.year,
          this.month - 1,
          lastDayOfPreviousMonth.getDate() - i + 1
        ),
        disabled: true,
      })
    }

    const lastDay = new Date(this.year, this.month + 1, 0)

    // Add the days of the current month.
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(this.year, this.month, i),
        disabled: false,
      })
    }

    // Add the days of the next month.
    const nextMonthDaysToAdd = 42 - days.length
    for (let i = 1; i <= nextMonthDaysToAdd; i++) {
      days.push({
        date: new Date(this.year, this.month + 1, i),
        disabled: true,
      })
    }

    return days
  }

  /**
   * Returns the day cells.
   *
   * @returns {NodeListOf<Element>}
   */
  get days() {
    return this.querySelectorAll('ubermanu-daygrid-item')
  }

  createRenderRoot() {
    return this
  }

  /**
   * Focuses the first day cell that is not disabled.
   *
   * @returns {void}
   */
  focus() {
    this.querySelector(':not([disabled])')?.focus()
  }

  /**
   * Jump to a specific date. Focus the cell for that date.
   *
   * @param {Date} date
   */
  jumpToDate(date) {
    this.month = date.getMonth()
    this.year = date.getFullYear()
    this.requestUpdate()

    this.updateComplete.then(() => {
      this.querySelector(`[date="${date.toISOString()}"]`)?.focus()
    })
  }

  /** Jump to today. */
  jumpToToday() {
    this.jumpToDate(new Date())
  }

  render() {
    return html`
      ${repeat(
        this.getDaysData(),
        (day) => day.date.toISOString(),
        (day) =>
          html` <ubermanu-daygrid-item
            .date=${day.date.toISOString()}
            .disabled=${day.disabled}
            .selected=${day.selected}
          ></ubermanu-daygrid-item>`
      )}
    `
  }
}
