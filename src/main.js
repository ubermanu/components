import { DayGrid } from './DayGrid.js'
import { DayGridItem } from './DayGridItem.js'

export * from './DayGrid.js'
export * from './DayGridItem.js'

window.customElements.define('day-grid', DayGrid)
window.customElements.define('day-grid-item', DayGridItem)
