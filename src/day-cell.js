import { css, html, LitElement } from "lit";

/**
 * Implements an accessible day cell.
 * Renders its day with aria-* attributes.
 */
export class DayCell extends LitElement {
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

      /**
       * If selected, the day cell will be marked as selected.
       * The day cell will not be focusable.
       * The day cell will not be selectable.
       */
      selected: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.date = "";
  }

  /**
   * Get the day of the day cell.
   * @returns {number}
   */
  get day() {
    return new Date(this.date).getDate();
  }

  /**
   * Get the month of the day cell.
   * @returns {number}
   */
  get month() {
    return new Date(this.date).getMonth();
  }

  /**
   * Get the year of the day cell.
   * @returns {number}
   */
  get year() {
    return new Date(this.date).getFullYear();
  }

  /**
   * Get the language of the day cell.
   * @returns {string}
   */
  get lang() {
    return (
      this.getAttribute("lang") ||
      this.grid?.lang ||
      document.documentElement.lang ||
      "en"
    );
  }

  /**
   * Returns true if the day cell is today.
   * @returns {boolean}
   */
  get isToday() {
    const today = new Date();
    const date = new Date(this.date);
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  }

  /**
   * Returns the day grid that contains this day cell.
   * @returns {Element}
   */
  get grid() {
    return this.closest("day-grid");
  }

  /**
   * Returns true if the day cell is the first day of the month.
   * @returns {boolean}
   */
  get isFirstDayOfMonth() {
    return this.day === 1;
  }

  /**
   * Returns true if the day cell is the last day of the month.
   * @returns {boolean}
   */
  get isLastDayOfMonth() {
    const date = new Date(this.date);
    const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    return this.day === nextDate.getDate() - 1;
  }

  /**
   * Returns true if the day cell is the first day of the year.
   * @returns {boolean}
   */
  get isFirstDayOfYear() {
    return this.day === 1 && this.month === 0;
  }

  /**
   * Returns true if the day cell is the last day of the year.
   * @returns {boolean}
   */
  get isLastDayOfYear() {
    return this.day === 31 && this.month === 11;
  }

  /**
   * Returns true if the day cell is the first day of the week.
   * @returns {boolean}
   */
  get isFirstDayOfWeek() {
    const date = new Date(this.date);
    return date.getDay() === 0;
  }

  /**
   * Returns true if the day cell is the last day of the week.
   * @returns {boolean}
   */
  get isLastDayOfWeek() {
    const date = new Date(this.date);
    return date.getDay() === 6;
  }

  /**
   * Returns the formatted date of the day cell according to the language.
   * @returns {string}
   */
  get formattedDate() {
    const date = new Date(this.date);
    return date.toLocaleDateString(this.lang, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Updates additional attributes when the day cell is updated.
   */
  requestUpdate() {
    super.requestUpdate(...arguments);

    // If the day cell is disabled, it should not be focusable.
    if (this.disabled) {
      this.tabIndex = -1;
    } else {
      this.tabIndex = 0;
    }
  }

  render() {
    return html`<span aria-label="${this.formattedDate}">${this.day}</span>`;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }
}

window.customElements.define("day-cell", DayCell);
