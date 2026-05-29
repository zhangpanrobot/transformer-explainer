import { get } from 'svelte/store'
import { isFetchingModel } from '~/store'
import {
  highlightElements,
  removeFingerFromElements,
  removeHighlightFromElements,
} from '~/utils/textbook'
import { b, bq, p } from './helpers'
import type { TextbookPage } from './types'

export const introPages: TextbookPage[] = [
  {
    id: 'what-is-transformer',
    title: 'What is Transformer?',
    content: [
      p(
        `${b('Transformer')} is the core architecture behind modern AI, powering models like ChatGPT and Gemini. Introduced in 2017, it revolutionized how AI processes information. The same architecture is used for training on massive datasets and for inference to generate outputs. Here we use GPT-2 (small), simpler than newer ones but perfect for learning the fundamentals.`,
      ),
    ],
    on: () => {},
    out: () => {},
  },
  {
    id: 'how-transformers-work',
    title: 'How Transformers Work?',
    content: [
      p('Transformers aren\u2019t magic\u2014they build text step by step by asking:'),
      bq('\u201CWhat is the most probable next word that will follow this input?\u201D'),
      p(
        `Here we explore how a trained model generates text. Write your own text or use an example, then click ${b('Generate')} to see it in action. If the model isn\u2019t ready yet, try another ${b('Example')}.`,
      ),
    ],
    on: () => {
      highlightElements(['.input-form'])
      if (get(isFetchingModel)) {
        highlightElements(['.input-form .select-button'])
      } else {
        highlightElements(['.input-form .generate-button'])
      }
    },
    out: () => {
      removeHighlightFromElements([
        '.input-form',
        '.input-form .select-button',
        '.input-form .generate-button',
      ])
    },
    complete: () => {
      removeFingerFromElements(['.input-form .select-button', '.input-form .generate-button'])
    },
  },
]
