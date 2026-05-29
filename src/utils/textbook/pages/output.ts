import { get } from 'svelte/store'
import { textbookCurrentPageId, weightPopover } from '~/store'
import {
  highlightElements,
  removeFingerFromElements,
  removeHighlightFromElements,
} from '~/utils/textbook'
import { b, p } from './helpers'
import type { TextbookPage } from './types'

export const outputPages: TextbookPage[] = [
  {
    id: 'mlp',
    title: 'MLP (Multi-Layer Perceptron)',
    content: [
      p(
        `The attention output goes through an ${b('MLP')} to refine token representations. A Linear layer changes embedding values and size using learned weights and bias, then a non-linear activation decides how much each value passes.`,
      ),
      p(
        `Many activation types exist; GPT-2 uses ${b('GELU')}, which lets small values pass partially and large values pass fully, helping capture both subtle and strong patterns.`,
      ),
    ],
    on: () => {
      highlightElements(['.step.mlp', '.operation-col.activation'])
    },
    out: () => {
      removeHighlightFromElements(['.step.mlp', '.operation-col.activation'])
    },
  },
  {
    id: 'output-logit',
    title: 'Output Logit',
    content: [
      p(
        'After all Transformer blocks, the last token\u2019s output embedding, enriched with context from all previous tokens, is multiplied by learned weights in a final layer.',
      ),
      p(
        `This produces ${b('logits')}, 50,257 numbers\u2014one for each token in GPT-2\u2019s vocabulary\u2014that indicate how likely each token is to come next.`,
      ),
    ],
    on: () => {
      highlightElements(['g.path-group.softmax', '.column.final'])
    },
    out: () => {
      removeHighlightFromElements(['g.path-group.softmax', '.column.final'])
      weightPopover.set(null)
    },
    complete: () => {
      removeFingerFromElements(['.column.final'])
      if (get(textbookCurrentPageId) === 'output-logit') {
      }
    },
  },
  {
    id: 'output-probabilities',
    title: 'Probabilities',
    content: [
      p(
        `Logits are just raw scores. To make them easier to interpret, we convert them into ${b('probabilities')} between 0 and 1, where all add up to 1. This tells us the likelihood of each token being the next word.`,
      ),
      p(
        'Instead of always picking the highest-probability token, we can use different selection strategies to balance safety and creativity in the generated text.',
      ),
    ],
    on: () => {
      highlightElements(['.step.softmax .title'])
    },
    out: () => {
      removeHighlightFromElements(['.step.softmax .title'])
    },
    complete: () => {
      removeFingerFromElements(['.step.softmax .title'])
      if (get(textbookCurrentPageId) === 'output-probabilities') {
      }
    },
  },
]
