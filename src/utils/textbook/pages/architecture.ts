import { get } from 'svelte/store'
import {
  isBoundingBoxActive,
  isExpandOrCollapseRunning,
} from '~/store'
import {
  applyTransformerBoundingHeight,
  highlightElements,
  removeFingerFromElements,
  removeHighlightFromElements,
  resetElementsHeight,
} from '~/utils/textbook'
import { b, numbered, p, ul } from './helpers'
import type { TextbookPage } from './types'

export const architecturePages: TextbookPage[] = [
  {
    id: 'transformer-architecture',
    title: 'Transformer Architecture',
    content: [
      p('Transformer has three main parts:'),
      numbered(
        `${b('Embeddings')} turn text into numbers.`,
        `${b('Transformer blocks')} mix information with Self-Attention and refine it with an MLP.`,
        `${b('Probabilities')} determine the likelihood of each next token.`,
      ),
    ],
    on: () => {
      const selectors = [
        '.step.embedding',
        '.step.softmax',
        '.transformer-bounding',
        '.transformer-bounding-title',
      ]
      highlightElements(selectors)
      applyTransformerBoundingHeight(['.softmax-bounding', '.embedding-bounding'])
    },
    out: () => {
      const selectors = [
        '.step.embedding',
        '.step.softmax',
        '.transformer-bounding',
        '.transformer-bounding-title',
      ]
      removeHighlightFromElements(selectors)
      resetElementsHeight(['.softmax-bounding', '.embedding-bounding'])
    },
  },
  {
    id: 'blocks',
    title: 'Repetitive Transformer Blocks',
    content: [
      p(
        `A ${b('Transformer block')} is the main unit of processing in the model. It has two parts:`,
      ),
      ul(
        `${b('Multi-head self-attention')} \u2013 lets tokens share information`,
        `${b('MLP')} \u2013 refines each token\u2019s details`,
      ),
      p(
        `Models stack many blocks so token representations become richer as they pass through. GPT-2 (small) has 12 of them.`,
      ),
    ],
    on: function () {
      this.timeoutId = setTimeout(
        () => {
          highlightElements([
            '.transformer-bounding',
            '.step.transformer-blocks .guide',
            '.attention > .title',
            '.mlp > .title',
          ])
          highlightElements(['.transformer-bounding-title'], 'textbook-button-highlight')
          isBoundingBoxActive.set(true)
        },
        get(isExpandOrCollapseRunning) ? 500 : 0,
      )
    },
    out: function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = undefined
      }
      removeHighlightFromElements([
        '.transformer-bounding',
        '.step.transformer-blocks .guide',
        '.attention > .title',
        '.mlp > .title',
      ])
      removeHighlightFromElements(['.transformer-bounding-title'], 'textbook-button-highlight')
      isBoundingBoxActive.set(false)
    },
    complete: () => {
      removeFingerFromElements(['.transformer-bounding-title'])
    },
  },
]
