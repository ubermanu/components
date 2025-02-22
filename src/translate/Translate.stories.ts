import './Translate'
import { Translate, Translator } from './Translate'

export default {
  title: 'Translate ',
  component: 'um-translate',
}

const translator: Translator = {
  translate(phrase) {
    const fr: any = {
      'Hello {name}': 'Bonjour {name}',
    }
    return fr[phrase]
  },
}

Translate.registerTranslator('fr', translator)

if (!customElements.get('um-translate')) {
  customElements.define('um-translate', Translate)
}

export const Default = () => {
  const t = document.createElement('um-translate')
  t.setAttribute('text', 'Hello {name}')
  t.setAttribute('lang', 'fr')

  const s = document.createElement('span')
  s.slot = 'name'
  s.innerText = 'World'
  t.appendChild(s)

  return t
}
