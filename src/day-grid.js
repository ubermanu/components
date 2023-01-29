import { css, html, LitElement } from "lit";
import "./day-cell.js";

/**
 * Implements an accessible day grid.
 * Exposes some methods to control its view (e.g. previousMonth, nextMonth, etc.)
 */
export class DayGrid extends LitElement {
  static get properties() {
    return {
      /**
       * The current month being displayed.
       */
      month: { type: Number, reflect: true },

      /**
       * The current year being displayed.
       */
      year: { type: Number, reflect: true },
    };
  }

  constructor() {
    super();

    // The current month and year are set to the current date.
    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
  }

  /**
   * Get the language of the grid.
   * @returns {string}
   */
  get lang() {
    return this.getAttribute("lang") || document.documentElement.lang || "en";
  }

  /**
   * Moves the calendar to the previous month.
   * If the current month is January, it will move to December of the previous year.
   * If the current year is not set, it will not move.
   * If the current month is not set, it will not move.
   */
  previousMonth() {
    if (this.year === -1 || this.month === -1) {
      return;
    }

    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }

    this.requestUpdate();
  }

  /**
   * Moves the calendar to the next month.
   * If the current month is December, it will move to January of the next year.
   * If the current year is not set, it will not move.
   * If the current month is not set, it will not move.
   */
  nextMonth() {
    if (this.year === -1 || this.month === -1) {
      return;
    }

    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }

    this.requestUpdate();
  }

  /**
   * Moves the calendar to the previous year.
   * If the current year is not set, it will not move.
   */
  previousYear() {
    if (this.year === -1) {
      return;
    }

    this.year--;
    this.requestUpdate();
  }

  /**
   * Moves the calendar to the next year.
   * If the current year is not set, it will not move.
   */
  nextYear() {
    if (this.year === -1) {
      return;
    }

    this.year++;
    this.requestUpdate();
  }

  /**
   * Returns an array of days for the current month.
   * The array will contain 42 days (6 weeks).
   * The days of the previous month will be added to the beginning of the array.
   * The days of the next month will be added to the end of the array.
   * @returns {Array}
   */
  get days() {
    const days = [];

    if (this.year === -1 || this.month === -1) {
      return days;
    }

    const firstDay = new Date(this.year, this.month, 1);
    const lastDay = new Date(this.year, this.month + 1, 0);

    // Add the days of the previous month.
    for (let i = firstDay.getDay() - 1; i >= 0; i--) {
      const date = new Date(this.year, this.month, 1 - i);
      days.push({
        date: date,
        disabled: true,
      });
    }

    // Add the days of the current month.
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(this.year, this.month, i);
      days.push({
        date: date,
        disabled: false,
      });
    }

    // Add the days of the next month.
    for (let i = 1; days.length < 42; i++) {
      const date = new Date(this.year, this.month + 1, i);
      days.push({
        date: date,
        disabled: true,
      });
    }

    return days;
  }

  get selectedDays() {
    return this.days.filter((day) => day.selected);
  }

  select(day) {
    day.selected = true;
    this.requestUpdate();
  }

  deselect(day) {
    day.selected = false;
    this.requestUpdate();
  }

  createRenderRoot() {
    return this;
  }

  /**
   * Focuses the first day cell that is not disabled.
   * @returns {void}
   */
  focus() {
    const dayCell = this.querySelector("day-cell:not([disabled])");
    if (dayCell) {
      dayCell.focus();
    }
  }

  render() {
    return html`
      ${this.days.map(
        (day) => html`<day-cell
          .date=${day.date.toISOString()}
          .disabled=${day.disabled}
          .selected=${day.selected}
        ></day-cell>`
      )}
    `;
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-template-rows: repeat(6, 1fr);
        grid-gap: 0.5rem;
        padding: 0.5rem;
      }
    `;
  }
}

window.customElements.define("day-grid", DayGrid);
