import { get } from 'svelte/store'
import {
  expandedBlock,
  isExpandOrCollapseRunning,
  textbookCurrentPageId,
  weightPopover,
} from '~/store'
import {
  highlightAttentionPath,
  highlightElements,
  removeAttentionPathHighlight,
  removeFingerFromElements,
  removeHighlightFromElements,
} from '~/utils/textbook'
import { b, blue, green, hl, p, purple, red, ul } from './helpers'
import type { TextbookPage } from './types'

export const attentionPages: TextbookPage[] = [
  {
    id: 'self-attention',
    title: 'Multi-Head Self Attention',
    content: [
      p(
        `${b('Self-attention')} lets the model decide which parts of the input are most relevant to each token. This helps it capture meaning and relationships, even between far-apart words.`,
      ),
      p(
        `In ${b('multi-head')} form, the model runs several attention processes in parallel, each focusing on different patterns in the text.`,
      ),
    ],
    on: () => {
      highlightElements(['.step.attention'])
    },
    out: () => {
      removeHighlightFromElements(['.step.attention'])
    },
  },
  {
    id: 'qkv',
    title: 'Query, Key, Value',
    content: [
      p(
        `To perform self-attention, each token\u2019s embedding is transformed into ${hl('three new embeddings')}\u2014${blue('Query')}, ${red('Key')}, and ${green('Value')}. This transformation is done by applying different weights and biases to each token embedding. These parameters (weights and biases), are optimized through training.`,
      ),
      p(
        `Once created, ${blue('Queries')} compare with ${red('Keys')} to measure relevance, and this relevance is used to weight the ${green('Values')}.`,
      ),
    ],
    on: function () {
      this.timeoutId = setTimeout(
        () => {
          highlightElements(['g.path-group.qkv', '.step.qkv .qkv-column'])
        },
        get(isExpandOrCollapseRunning) ? 500 : 0,
      )
    },
    out: function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = undefined
      }
      removeHighlightFromElements(['g.path-group.qkv', '.step.qkv .qkv-column'])
      weightPopover.set(null)
    },
    complete: () => {
      removeFingerFromElements(['.step.qkv .qkv-column'])
      if (get(textbookCurrentPageId) === 'qkv') {
      }
    },
  },
  {
    id: 'multi-head',
    title: 'Multi-head',
    content: [
      p(
        `After creating ${blue('Q')}, ${red('K')}, and ${green('V')} embeddings, the model splits them into several ${b('heads')} (12 in GPT-2 small). Each head works with its own smaller set of ${blue('Q')}/${red('K')}/${green('V')}, focusing on different patterns in the text\u2014like grammar, meaning, or long-range links.`,
      ),
      p(
        'Multiple heads let the model learn many kinds of relationships in parallel, making its understanding richer.',
      ),
    ],
    on: () => {
      highlightAttentionPath()
      highlightElements(['.multi-head .head-title'])
    },
    out: () => {
      removeAttentionPathHighlight()
      removeHighlightFromElements(['.multi-head .head-title'])
    },
    complete: () => {
      removeFingerFromElements(['.multi-head .head-title'])
      if (get(textbookCurrentPageId) === 'multi-head') {
      }
    },
  },
  {
    id: 'masked-self-attention',
    title: 'Masked Self Attention',
    content: [
      p('In each head, the model decides how much each token focuses on others:'),
      ul(
        `${b('Dot Product')} \u2013 Multiply matching numbers in ${blue('Query')}/${red('Key')} vectors, sum to get ${purple('attention scores')}.`,
        `${b('Mask')} \u2013 Hide future tokens so it can\u2019t peek ahead.`,
        `${b('Softmax')} \u2013 Convert scores to probabilities, each row summing to 1, showing focus on earlier tokens.`,
      ),
    ],
    on: () => {
      highlightAttentionPath()
      highlightElements(['.attention-matrix.attention-result'])
    },
    out: () => {
      removeAttentionPathHighlight()
      removeHighlightFromElements(['.attention-matrix.attention-result'])
      expandedBlock.set({ id: null })
    },
    complete: () => {
      removeFingerFromElements(['.attention-matrix.attention-result'])
      if (get(textbookCurrentPageId) === 'masked-self-attention') {
      }
    },
  },
  {
    id: 'output-concatenation',
    title: 'Attention Output & Concatenation',
    content: [
      p(
        `Each head ${hl(`multiplies its ${purple('attention scores')} with the ${green('Value')} embeddings to produce its attention output`)}\u2014a refined representation of each token after considering context.`,
      ),
      p(
        'GPT-2 (small) has 12 such outputs, which are concatenated to form a single vector of the original size (768 numbers).',
      ),
    ],
    on: function () {
      this.timeoutId = setTimeout(
        () => {
          highlightElements(['path.to-attention-out.value-to-out', '.attention .column.out'])
        },
        get(isExpandOrCollapseRunning) ? 500 : 0,
      )
    },
    out: function () {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
        this.timeoutId = undefined
      }
      removeHighlightFromElements(['path.to-attention-out.value-to-out', '.attention .column.out'])
      weightPopover.set(null)
    },
    complete: () => {
      removeFingerFromElements(['.attention .column.out'])
    },
  },
]
