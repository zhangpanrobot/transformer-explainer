import { get } from 'svelte/store'
import { expandedBlock, textbookCurrentPageId } from '~/store'
import {
  highlightElements,
  removeFingerFromElements,
  removeHighlightFromElements,
} from '~/utils/textbook'
import { b, p } from './helpers'
import type { TextbookPage } from './types'

export const embeddingPages: TextbookPage[] = [
  {
    id: 'embedding',
    title: 'Embedding',
    content: [
      p(
        `Before a Transformer can use text, it first breaks it into small units and represents each as a list of numbers (vector). This process is called ${b('embedding')}, and the term can refer to both the process and the resulting vector.`,
      ),
      p('In this tool, each vector appears as a rectangle, and hovering over it shows its size.'),
    ],
    on: () => {
      highlightElements(['.step.embedding .title'])
    },
    out: () => {
      removeHighlightFromElements(['.step.embedding .title'])
    },
    complete: () => {
      removeFingerFromElements(['.step.embedding .title'])
      if (get(textbookCurrentPageId) === 'embedding') {
      }
    },
  },
  {
    id: 'token-embedding',
    title: 'Token Embedding',
    content: [
      p(
        `${b('Tokenization')} splits input text into tokens\u2014small units like words or parts of words. GPT-2 (small) has 50,257 token vocabulary, each with a unique ID.`,
      ),
      p(
        `In the ${b('token embedding')} step, every token is matched to a 768-number vector from a large lookup table. These vectors are learned during training to best represent each token\u2019s meaning.`,
      ),
    ],
    on: function () {
      const selectors = [
        '.token-column .column.token-string',
        '.token-column .column.token-embedding',
      ]
      if (get(expandedBlock).id !== 'embedding') {
        expandedBlock.set({ id: 'embedding' })
        this.timeoutId = setTimeout(() => {
          highlightElements(selectors)
        }, 500)
      } else {
        highlightElements(selectors)
      }
    },
    out: function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = undefined
      }
      const selectors = [
        '.token-column .column.token-string',
        '.token-column .column.token-embedding',
      ]
      removeHighlightFromElements(selectors)
      if (get(textbookCurrentPageId) !== 'positional-encoding') expandedBlock.set({ id: null })
    },
  },
  {
    id: 'positional-encoding',
    title: 'Positional Encoding',
    content: [
      p(
        `Word order matters in language. ${b('Positional encoding')} gives each token information about its place in the sequence.`,
      ),
      p(
        `GPT-2 does this by adding a learned positional embedding to the token\u2019s embedding, but newer models may use other methods, like RoPE, which encodes position by rotating certain vectors. All aim to help the model understand order in text.`,
      ),
    ],
    on: function () {
      const selectors = ['.token-column .column.position-embedding', '.token-column .column.symbol']
      if (get(expandedBlock).id !== 'embedding') {
        expandedBlock.set({ id: 'embedding' })
        this.timeoutId = setTimeout(() => {
          highlightElements(selectors)
        }, 500)
      } else {
        highlightElements(selectors)
      }
    },
    out: function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = undefined
      }
      const selectors = ['.token-column .column.position-embedding', '.token-column .column.symbol']
      removeHighlightFromElements(selectors)
      if (get(textbookCurrentPageId) !== 'token-embedding') expandedBlock.set({ id: null })
    },
  },
]
