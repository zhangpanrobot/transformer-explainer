import { get } from 'svelte/store'
import { expandedBlock, isExpandOrCollapseRunning, textbookCurrentPageId } from '~/store'
import { drawResidualLine } from '~/utils/animation/residual'
import {
  highlightElements,
  removeFingerFromElements,
  removeHighlightFromElements,
} from '~/utils/textbook'
import { b, p } from './helpers'
import type { TextbookPage } from './types'

const { drawLine, removeLine } = drawResidualLine()

export const advancedPages: TextbookPage[] = [
  {
    id: 'temperature',
    title: 'Temperature',
    content: [
      p(
        `${b('Temperature')} works by scaling the logits before turning them into probabilities. A ${b('low temperature')} (e.g., 0.2) makes large logits even larger and small ones smaller, favoring the highest-scoring tokens and leading to more ${b('predictable choices')}. A ${b('high temperature')} (e.g., 1.0 or above) flattens the differences, making less likely tokens more competitive and leading to more ${b('creative outputs')}.`,
      ),
    ],
    on: function () {
      if (get(expandedBlock).id !== 'softmax') {
        expandedBlock.set({ id: 'softmax' })
        this.timeoutId = setTimeout(() => {
          highlightElements([
            '.formula-step.scaled',
            '.title-box.scaled',
            '.content-box.scaled',
            '.temperature-input',
          ])
        }, 500)
      } else {
        highlightElements([
          '.formula-step.scaled',
          '.title-box.scaled',
          '.content-box.scaled',
          '.temperature-input',
        ])
      }
    },
    out: function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = undefined
      }
      removeHighlightFromElements([
        '.formula-step.scaled',
        '.title-box.scaled',
        '.temperature-input',
        '.content-box.scaled',
      ])
      if (!['temperature', 'sampling'].includes(get(textbookCurrentPageId)))
        expandedBlock.set({ id: null })
    },
    complete: () => {
      removeFingerFromElements(['.temperature-input'])
      if (get(textbookCurrentPageId) === 'temperature') {
      }
    },
  },
  {
    id: 'sampling',
    title: 'Sampling Strategy',
    content: [
      p(
        `Finally, we need a strategy to pick the next token. Many exist, but here are common ones: Greedy search picks the top one. ${b('Top-k')} keeps only the k most likely tokens, and ${b('top-p')} keeps the smallest set whose total probability is at least p\u2014trimming unlikely ones early.`,
      ),
      p(
        'Then softmax turns the remaining logits into probabilities, and one token is picked at random from the allowed set.',
      ),
    ],
    on: function () {
      if (get(expandedBlock).id !== 'softmax') {
        expandedBlock.set({ id: 'softmax' })
        this.timeoutId = setTimeout(() => {
          highlightElements([
            '.formula-step.sampling',
            '.title-box.sampling',
            '.sampling-input',
            '.content-box.sampling',
          ])
        }, 500)
      } else {
        highlightElements([
          '.formula-step.sampling',
          '.title-box.sampling',
          '.sampling-input',
          '.content-box.sampling',
        ])
      }
    },
    out: function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = undefined
      }
      removeHighlightFromElements([
        '.formula-step.sampling',
        '.title-box.sampling',
        '.sampling-input',
        '.content-box.sampling',
      ])
      if (!['temperature', 'sampling'].includes(get(textbookCurrentPageId)))
        expandedBlock.set({ id: null })
    },
    complete: () => {
      removeFingerFromElements(['.sampling-input'])
      if (get(textbookCurrentPageId) === 'sampling') {
      }
    },
  },
  {
    id: 'residual',
    title: 'Residual Connection',
    content: [
      p(
        `Transformers have auxiliary features that enhance the model performance. For example, a ${b('residual connection')} adds a layer\u2019s input to its output, keeping information from fading through many blocks. In GPT-2, it\u2019s used twice per block to train deeper stacks effectively.`,
      ),
    ],
    on: function () {
      this.timeoutId = setTimeout(
        () => {
          highlightElements(['.operation-col.residual', '.residual-start'])
          drawLine()
        },
        get(isExpandOrCollapseRunning) ? 500 : 0,
      )
    },
    out: function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = undefined
      }
      removeHighlightFromElements(['.operation-col.residual', '.residual-start'])
      removeLine()
    },
  },
  {
    id: 'layer-normalization',
    title: 'Layer Normalization',
    content: [
      p(
        `${b('Layer Normalization')} helps stabilize both training and inference by adjusting input numbers so their mean and variance stay consistent. This makes the model less sensitive to its starting weights and helps it learn more effectively. In GPT-2, it\u2019s applied before self-attention, before the MLP, and once more before the final output.`,
      ),
    ],
    on: () => {
      highlightElements(['.operation-col.ln'])
    },
    out: () => {
      removeHighlightFromElements(['.operation-col.ln'])
    },
  },
  {
    id: 'dropout',
    title: 'Dropout',
    content: [
      p(
        `During training, ${b('dropout')} randomly turns off some connections between numbers so the model doesn\u2019t overfit to specific patterns. This helps it learn features that generalize better. GPT-2 uses it, but newer LLMs often skip it because they train on huge datasets and overfitting is less of a problem. In inference, dropout is turned off.`,
      ),
    ],
    on: () => {
      highlightElements(['.operation-col.dropout'])
    },
    out: () => {
      removeHighlightFromElements(['.operation-col.dropout'])
    },
  },
]
