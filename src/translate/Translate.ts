export class Translate extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback() {
    this.render()
  }

  async render() {
    const text = this.getAttribute('text') || ''
    const targetLang = this.getAttribute('lang') || 'en'

    // Replace placeholders with slot content
    const finalText = text.replace(/\{(.*?)\}/g, (_, name) => {
      const slot = this.querySelector(`[slot="${name}"]`)
      console.log(name, slot)
      return slot?.textContent ?? `{${name}}`
    })

    // Translate the final text
    const translatedText = await this.translateText(finalText, targetLang)

    // TODO: Add support for HTML
    this.shadowRoot!.innerHTML = translatedText
  }

  /** Translates a phrase using available translators for the target lang. */
  async translateText(phrase: string, targetLang: string) {
    // TODO: Get all the translaters for a specific lang

    const translators = Translate.#languages.get(targetLang)?.values()

    if (!translators) {
      return phrase
    }

    for (const t of translators) {
      const res = t.translate(phrase)
      if (res) {
        return res
      }
    }

    return phrase
  }

  /** List of translators, per lang. */
  static #languages = new Map<string, Set<Translator>>()

  /** Add a new translator for a lang. */
  static registerTranslator(lang: string, translator: Translator) {
    if (!this.#languages.has(lang)) {
      this.#languages.set(lang, new Set())
    }
    this.#languages.get(lang)!.add(translator)
  }
}

async function waitForSlots(element: HTMLElement) {
  return new Promise<void>((resolve) => {
    const checkSlots = () => {
      const slots = element.querySelectorAll('slot') ?? []
      if (slots.length === 0) return

      let filledSlots = 0
      slots.forEach((slot) => {
        if (slot.assignedNodes().length > 0) {
          filledSlots++
        }
        slot.addEventListener('slotchange', () => {
          if (slot.assignedNodes().length > 0) {
            filledSlots++
          }
          if (filledSlots === slots.length) {
            resolve()
          }
        })
      })

      if (filledSlots === slots.length) {
        resolve()
      }
    }

    const observer = new MutationObserver(() => {
      checkSlots()
    })

    observer.observe(element, { childList: true, subtree: true })
    checkSlots()
  })
}

export interface Translator {
  translate(phrase: string): string | null
}

// Loads a JSON file with a k/v pair of translations.
export const json = async (
  file: string,
  { fetch: customFetch }: { fetch?: typeof fetch }
): Promise<Translator> => {
  const res = await (customFetch ?? fetch)(file)
  const data = await res.json()
  return {
    translate(phrase) {
      return data[phrase] ?? null
    },
  }
}
