import {
  ATTENTION_HEAD_1,
  ATTENTION_OUT,
  EMBEDDING,
  LOGIT,
  MLP,
  TRANSFORMER_BLOCKS,
} from '~/constants/opacity'
import { pathAdjustor } from './geometry'
import type { PathItem, PathMap } from './types'

export const createPathMap = ({
  blockIdx,
  isOnBlockTransition,
  tokensLength,
  modelLayerNum,
  rootRem,
  curveFactor,
  tooltip,
  weightPopover,
  completePage,
}: {
  blockIdx: number
  isOnBlockTransition: boolean
  tokensLength: number
  modelLayerNum: number
  rootRem: number
  curveFactor: number
  tooltip: (value: string | null) => void
  weightPopover: (value: string | null) => void
  completePage: (page: string) => void
}) => {
  const qkvPaths: PathItem[] = [
    {
      from: '.qkv .vector-column .column.vectors .vector',
      to: '.qkv .qkv-column .vector',
      gradientId: blockIdx === 0 ? 'gray-blue' : 'transparent-blue',
      opacity: EMBEDDING,
      pathGenerator: (source: DOMRect, target: DOMRect, curve: number) => {
        const scrollTop = window.scrollY
        const scrollLeft = window.scrollX

        const rightOffset = 30
        const { curveOffset } = pathAdjustor(source, target, curve)
        return `
          M ${source.right + scrollLeft},${source.top + scrollTop}
          L ${source.right + rightOffset + scrollLeft},${source.top + scrollTop}
          C ${source.right + rightOffset + scrollLeft + curveOffset},${source.top + scrollTop} ${target.left + scrollLeft - curveOffset},${target.top + scrollTop} ${target.left + scrollLeft},${target.top + scrollTop}
          L ${target.left + scrollLeft},${target.bottom + scrollTop}
          C ${target.left + scrollLeft - curveOffset},${target.bottom + scrollTop} ${source.right + rightOffset + scrollLeft + curveOffset},${source.bottom + scrollTop} ${source.right + rightOffset + scrollLeft},${source.bottom + scrollTop}
          L ${source.right + scrollLeft},${source.bottom + scrollTop}
          Z
        `
      },
      onMouseOver: () => tooltip('click to see QKV calculation'),
      onMouseOut: () => tooltip(null),
      onMouseClick: (e: MouseEvent) => {
        e.stopPropagation()
        completePage('qkv')

        weightPopover('qkv')
      },
    },
  ]

  const attentionPaths: PathItem[] = [
    {
      from: '.qkv .qkv-column .query .sub-vector.head1',
      to: '.head-block .query .vector',
      gradientId: 'blue-blue',
      opacity: ATTENTION_HEAD_1,
    },
    {
      from: '.qkv .qkv-column .key .sub-vector.head1',
      to: '.head-block .key .vector',
      gradientId: 'red-red',
      opacity: ATTENTION_HEAD_1,
    },
    {
      from: '.qkv .qkv-column .value .sub-vector.head1',
      to: '.head-block .value .vector',
      gradientId: 'green-green',
      opacity: ATTENTION_HEAD_1,
    },
    {
      from: '.attention .head-out .vector',
      to: '.mlp .initial .head1',
      gradientId: 'purple-purple',
      opacity: ATTENTION_HEAD_1,
    },
    {
      from: '.head-block .head1.key .vector',
      to: `.attention-matrix.attention-initial .main g.g-row-${tokensLength - 1} rect`,
      id: 'key-to-attention',
      type: 'stroke',
      gradientId: 'red-purple',
      opacity: ATTENTION_HEAD_1,
      unique: true,
      curve: 20,
      pathGenerator: (source: DOMRect, target: DOMRect, curve: number) => {
        const scrollTop = window.scrollY
        const scrollLeft = window.scrollX

        const sourceMiddleY = source.top + scrollTop + source.height / 2
        const targetMiddleX = target.left + scrollLeft + target.width / 2
        const curveOffset = curve
        return `
          M ${source.right + scrollLeft},${sourceMiddleY}
          L ${targetMiddleX - curveOffset},${sourceMiddleY}
          A ${curveOffset},${curveOffset} 0 0 1 ${targetMiddleX},${sourceMiddleY + curveOffset}
          L ${targetMiddleX},${target.bottom + scrollTop}
        `
      },
    },
    {
      from: '.head-block .query .vector',
      to: `.attention-initial .main g.g-row`,
      gradientId: 'blue-purple',
      id: 'query-to-attention',
      unique: true,
      type: 'stroke',
      opacity: ATTENTION_HEAD_1,
      curve: curveFactor * 30,
      pathGenerator: (source: DOMRect, target: DOMRect, curve: number) => {
        const curveOffset = curve

        const scrollTop = window.scrollY
        const scrollLeft = window.scrollX

        const sourceMiddleY = source.top + scrollTop + source.height / 2
        const targetMiddleY = target.top + scrollTop + target.height / 2
        const controlPoint1X = source.right + scrollLeft + curveOffset
        const controlPoint2X = target.left + scrollLeft - curveOffset

        return `
          M ${source.right + scrollLeft},${sourceMiddleY}
          C ${controlPoint1X},${sourceMiddleY} ${controlPoint2X},${targetMiddleY} ${target.left + scrollLeft},${targetMiddleY}
          L ${target.right + scrollLeft},${targetMiddleY}
        `
      },
    },
    {
      from: '.attention-matrix.attention-out .main svg',
      to: '.attention .head-out',
      gradientId: 'transparent-purple2',
      id: 'to-attention-out',
      unique: true,
      opacity: ATTENTION_OUT,
      curve: 20,
      pathGenerator: (source: DOMRect, target: DOMRect, curve: number) => {
        const { curveOffset } = pathAdjustor(source, target, curve)

        const scrollTop = window.scrollY
        const scrollLeft = window.scrollX

        return `
          M ${source.right + scrollLeft},${source.top + scrollTop}
          C ${source.right + scrollLeft + curveOffset},${source.top + scrollTop} ${target.left + scrollLeft - curveOffset},${target.top + scrollTop} ${target.left + scrollLeft},${target.top + scrollTop}
          L ${target.left + scrollLeft},${target.bottom + scrollTop}
          C ${target.left + scrollLeft - curveOffset},${target.bottom + scrollTop} ${source.right + scrollLeft + curveOffset},${source.bottom + scrollTop} ${source.right + scrollLeft},${source.bottom + scrollTop}
          Z
        `
      },
      onMouseOver: () => tooltip('click to see Attention Out calculation'),
      onMouseOut: () => tooltip(null),
      onMouseClick: (e: MouseEvent) => {
        e.stopPropagation()
        completePage('output-concatenation')

        weightPopover('attention')
      },
    },
    {
      from: '.head-block .value',
      to: '.attention .head-out',
      gradientId: 'green-purple',
      id: 'to-attention-out value-to-out',
      unique: true,
      opacity: ATTENTION_OUT,
      curve: curveFactor * 30,
      pathGenerator: (source: DOMRect, target: DOMRect, curve: number) => {
        const scrollTop = window.scrollY
        const scrollLeft = window.scrollX
        const { curveOffset } = pathAdjustor(source, target, curve)
        return `
          M ${source.right + scrollLeft},${source.top + scrollTop} 
          C ${target.left - curveOffset},${source.top + scrollTop} ${target.left + scrollLeft - curveOffset},${source.top + scrollTop} ${target.left + scrollLeft},${target.top + scrollTop}
          L ${target.left + scrollLeft},${target.bottom + scrollTop}
          C ${target.left + scrollLeft - curveOffset},${source.bottom + scrollTop} ${target.left - curveOffset},${source.bottom + scrollTop} ${source.right + scrollLeft},${source.bottom + scrollTop}
          Z
        `
      },
      onMouseOver: () => tooltip('click to see Attention Out calculation'),
      onMouseOut: () => tooltip(null),
      onMouseClick: (e: MouseEvent) => {
        e.stopPropagation()
        completePage('output-concatenation')

        weightPopover('attention')
      },
    },
  ]

  const mlpUpPaths: PathItem[] = [
    {
      from: '.mlp .column.initial .vector',
      to: '.mlp .second-layer .vector',
      gradientId: 'purple-indigo',
      curve: 50 + (curveFactor - 1) * 20,
      opacity: MLP,
      pathGenerator: (source: DOMRect, target: DOMRect, curve: number) => {
        const scrollTop = window.scrollY
        const scrollLeft = window.scrollX

        const rightOffset = rootRem * 3
        const { curveOffset } = pathAdjustor(source, target, curve)
        return `
          M ${source.right + scrollLeft},${source.top + scrollTop}
          L ${source.right + rightOffset + scrollLeft},${source.top + scrollTop}
          C ${source.right + rightOffset + scrollLeft + curveOffset},${source.top + scrollTop} ${target.left + scrollLeft - curveOffset},${target.top + scrollTop} ${target.left + scrollLeft},${target.top + scrollTop}
          L ${target.left + scrollLeft},${target.bottom + scrollTop}
          C ${target.left + scrollLeft - curveOffset},${target.bottom + scrollTop} ${source.right + rightOffset + scrollLeft + curveOffset},${source.bottom + scrollTop} ${source.right + rightOffset + scrollLeft},${source.bottom + scrollTop}
          L ${source.right + scrollLeft},${source.bottom + scrollTop}
          Z
        `
      },
      onMouseOver: () => tooltip('click to see MLP process'),
      onMouseOut: () => tooltip(null),
      onMouseClick: (e: MouseEvent) => {
        e.stopPropagation()
        weightPopover('mlpUp')
      },
    },
  ]

  const mlpDownPaths: PathItem[] = [
    {
      from: '.mlp .second-layer .vector',
      to: '.mlp .column.out .vector',
      gradientId: 'indigo-blue',
      curve: 50 + (curveFactor - 1) * 20,
      opacity: MLP,
      pathGenerator: (source: DOMRect, target: DOMRect, curve: number) => {
        const scrollTop = window.scrollY
        const scrollLeft = window.scrollX

        const leftOffset = rootRem * 1.5
        const { curveOffset } = pathAdjustor(source, target, curve)
        return `
          M ${source.right + scrollLeft},${source.top + scrollTop}
          C ${source.right + scrollLeft + curveOffset},${source.top + scrollTop} ${target.left - leftOffset + scrollLeft - curveOffset},${target.top + scrollTop} ${target.left - leftOffset + scrollLeft},${target.top + scrollTop}
          L ${target.left + scrollLeft},${target.top + scrollTop}
          L ${target.left + scrollLeft},${target.bottom + scrollTop}
          L ${target.left - leftOffset + scrollLeft},${target.bottom + scrollTop}
          C ${target.left - leftOffset + scrollLeft - curveOffset},${target.bottom + scrollTop} ${source.right + scrollLeft + curveOffset},${source.bottom + scrollTop} ${source.right + scrollLeft},${source.bottom + scrollTop}
          L ${source.right + scrollLeft},${source.bottom + scrollTop}
          Z
        `
      },
      onMouseOver: () => tooltip('click to see MLP process'),
      onMouseOut: () => tooltip(null),
      onMouseClick: (e: MouseEvent) => {
        e.stopPropagation()
        weightPopover('mlpDown')
      },
    },
  ]

  const pathMap: PathMap = {
    embedding: [
      {
        from: '.embedding .vector-column .column.vectors .vector',
        to: '.block-steps.main .qkv .vector-column .column.vectors .vector',
        gradientId: 'gray-white-blue',
        opacity: TRANSFORMER_BLOCKS,
      },
    ],
    qkv: qkvPaths.map((d) => ({
      ...d,
      from: `.block-steps.main ${d.from}`,
      to: `.block-steps.main ${d.to}`,
    })),
    nextQkv: qkvPaths.map((d) => ({
      ...d,
      from: `.block-steps.next ${d.from}`,
      to: `.block-steps.next ${d.to}`,
    })),
    attention: attentionPaths.map((d) => ({
      ...d,
      from: `.block-steps.main ${d.from}`,
      to: `.block-steps.main ${d.to}`,
    })),
    nextAttention: attentionPaths.map((d) => ({
      ...d,
      from: `.block-steps.next ${d.from}`,
      to: `.block-steps.next ${d.to}`,
    })),
    mlpUp: mlpUpPaths.map((d) => ({
      ...d,
      from: `.block-steps.main ${d.from}`,
      to: `.block-steps.main ${d.to}`,
    })),
    mlpDown: mlpDownPaths.map((d) => ({
      ...d,
      from: `.block-steps.main ${d.from}`,
      to: `.block-steps.main ${d.to}`,
    })),
    nextMlpUp: mlpUpPaths.map((d) => ({
      ...d,
      from: `.block-steps.next ${d.from}`,
      to: `.block-steps.next ${d.to}`,
    })),
    nextMlpDown: mlpDownPaths.map((d) => ({
      ...d,
      from: `.block-steps.next ${d.from}`,
      to: `.block-steps.next ${d.to}`,
    })),
    'transformer-blocks': [
      {
        from: `.block-steps.${isOnBlockTransition ? 'next' : 'main'} .mlp .column.out .vector`,
        to: '.transformer-blocks .column.final .vector',
        gradientId: blockIdx === modelLayerNum - 1 ? 'blue' : 'blue-white-blue',
        opacity: blockIdx === modelLayerNum - 1 ? MLP : TRANSFORMER_BLOCKS,
        pathGenerator: (source: DOMRect, target: DOMRect, curve: number) => {
          const scrollTop = window.scrollY
          const scrollLeft = window.scrollX
          const { curveOffset } = pathAdjustor(source, target, curve)
          return `
            M ${source.right + scrollLeft},${source.top + scrollTop}
            C ${source.right + scrollLeft + curveOffset},${source.top + scrollTop} ${target.left + scrollLeft - curveOffset},${target.top + scrollTop} ${target.left + scrollLeft},${target.top + scrollTop}
            L ${target.left + scrollLeft},${target.bottom + scrollTop}
            C ${target.left + scrollLeft - curveOffset},${target.bottom + scrollTop} ${source.right + scrollLeft + curveOffset},${source.bottom + scrollTop} ${source.right + scrollLeft},${source.bottom + scrollTop}
            Z
          `
        },
      },
    ],
    softmax: [
      {
        from: '.transformer-blocks .final .vector.last-token',
        to: '.softmax .content .vector',
        gradientId: 'blue-gray',
        opacity: LOGIT,
        unique: true,
        onMouseOver: () => tooltip('click to see Logits calculation'),
        onMouseOut: () => tooltip(null),
        onMouseClick: (e: MouseEvent) => {
          e.stopPropagation()
          completePage('output-logit')

          weightPopover('softmax')
        },
      },
    ],
  }

  return pathMap
}
