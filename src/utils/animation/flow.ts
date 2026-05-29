import { gsap } from 'gsap'
import { get } from 'svelte/store'
import { blockIdx, isOnAnimation, modelMeta } from '~/store'
import {
  animateGradient,
  animateGradientPair,
  FADE_OUT_COLOR,
  fadeInReveal,
  getGradientStops,
} from './utils'

interface FlowStageContext {
  tl: GSAPTimeline
  isNextTokenOnly: boolean
  isFirstBlock: boolean
  isLastBlock: boolean
  tokenLength: number
  stepDuration: number
}

// ============================
// Stage 1: Embedding
// ============================
function animateEmbedding(ctx: FlowStageContext) {
  const { tl, isNextTokenOnly, isFirstBlock, stepDuration: dur } = ctx

  const tokenEmbedding = document.querySelectorAll(
    isNextTokenOnly ? '.embedding .content .last' : '.embedding .content',
  )
  tl.fromTo(tokenEmbedding, { opacity: 0 }, { opacity: 1, duration: isNextTokenOnly ? dur : 0.2 })

  if (isFirstBlock) return

  const [embedToBlock1, embedToBlock1Last] = getGradientStops('.gray-white-blue')
  const [embedToBlock2, embedToBlock2Last] = getGradientStops('.gray-white-blue', 3)

  const blockPathTl = gsap.timeline()
  animateGradient(
    blockPathTl,
    isNextTokenOnly ? [embedToBlock1Last] : [embedToBlock1, embedToBlock1Last],
    { duration: dur * 5, offset: { to: '50%' }, ease: 'sine.inOut' },
  )
  animateGradient(
    blockPathTl,
    isNextTokenOnly ? [embedToBlock2Last] : [embedToBlock2, embedToBlock2Last],
    { duration: dur * 5, offset: { from: '50%' }, ease: 'sine.inOut' },
  )
  tl.add(blockPathTl)

  const blockStartCols = document.querySelectorAll('.qkv .block-start-column')
  tl.fromTo(
    blockStartCols,
    {
      opacity: (_: number, el: Element) =>
        isNextTokenOnly ? (el.classList.contains('last') ? 0 : 1) : 0,
    },
    { opacity: 1, duration: isNextTokenOnly ? dur : 0.2 },
  )
}

// ============================
// Stage 2: QKV Projection
// ============================
function animateQKVProjection(ctx: FlowStageContext) {
  const { tl, isNextTokenOnly, isFirstBlock, stepDuration: dur } = ctx

  // Embedding → QKV weight path
  animateGradientPair(tl, isFirstBlock ? '.gray-blue' : '.transparent-blue', isNextTokenOnly, {
    duration: dur * 10,
  })

  // Reveal QKV weighted vectors
  const qkvVectors = document.querySelectorAll('.qkv .qkv-weighted')
  fadeInReveal(tl, qkvVectors, isNextTokenOnly, isNextTokenOnly ? dur : 0.2)

  // Multi-head QKV split paths
  const [queryH1, queryH1Last] = getGradientStops('.blue-blue')
  const [keyH1, keyH1Last] = getGradientStops('.red-red')
  const [valueH1, valueH1Last] = getGradientStops('.green-green')
  const [query, queryLast] = getGradientStops('.blue-blue2')
  const [key, keyLast] = getGradientStops('.red-red2')
  const [value, valueLast] = getGradientStops('.green-green2')

  if (isNextTokenOnly) {
    animateGradient(tl, [queryH1Last, keyH1Last, valueH1Last], {
      position: '<',
      duration: dur * 10,
    })
    animateGradient(tl, [queryLast, keyLast, valueLast], {
      position: '<',
      duration: dur * 10,
    })
  } else {
    animateGradient(tl, [queryH1, keyH1, valueH1, queryH1Last, keyH1Last, valueH1Last], {
      duration: dur * 10,
    })
    animateGradient(tl, [query, key, value, queryLast, keyLast, valueLast], { duration: dur * 10 })
  }

  // Reveal head1 QKV columns
  const head1Cols = document.querySelectorAll('.attention .head-block .qkv .column .head1')
  fadeInReveal(tl, head1Cols, isNextTokenOnly, dur)
}

// ============================
// Stage 3: Attention & Output
// ============================
function animateAttentionComputation(
  tl: GSAPTimeline,
  isNextTokenOnly: boolean,
  tokenLength: number,
) {
  const keyPaths = document.querySelectorAll('.sankey-top g.attention path.key-to-attention')
  const queryPaths = document.querySelectorAll('.sankey-top g.attention path.query-to-attention')
  const attnMatrix = document.querySelector('.attention .attention-result')

  if (isNextTokenOnly) {
    const qkDuration = 0.7
    const stagger = Number((qkDuration / tokenLength).toFixed(2))

    ;[...keyPaths, ...queryPaths].forEach((path: any) => {
      path.style.strokeDasharray = 0
      path.style.strokeDashoffset = 0
    })

    const lastKey = keyPaths[keyPaths.length - 1] as any
    const lastQuery = queryPaths[queryPaths.length - 1] as any
    ;[lastKey, lastQuery].forEach((path: any) => {
      const length = path.getTotalLength()
      path.style.strokeDasharray = length
      path.style.strokeDashoffset = length
    })

    tl.to(lastKey, {
      strokeDashoffset: 0,
      stagger,
      duration: qkDuration,
      ease: 'power2.out',
    })
      .to(
        lastQuery,
        { strokeDashoffset: 0, stagger, duration: qkDuration, ease: 'power2.out' },
        '<',
      )
      .from(
        attnMatrix.querySelectorAll('svg circle.last'),
        {
          scale: 0,
          transformOrigin: '50% 50%',
          opacity: 0,
          delay: qkDuration / tokenLength,
          stagger: Number((qkDuration / tokenLength ** 2).toFixed(2)),
          ease: 'power2.out',
          duration: qkDuration,
        },
        '<',
      )
  } else {
    const qkDuration = 0.4
    const stagger = Number((qkDuration / tokenLength).toFixed(2))

    ;[...keyPaths, ...queryPaths].forEach((path: any) => {
      const length = path.getTotalLength()
      path.style.strokeDasharray = length
      path.style.strokeDashoffset = length
    })

    tl.to(keyPaths, {
      strokeDashoffset: 0,
      stagger,
      duration: qkDuration,
      ease: 'power2.out',
    })
      .to(
        queryPaths,
        { strokeDashoffset: 0, stagger, duration: qkDuration, ease: 'power2.out' },
        '<',
      )
      .from(
        attnMatrix.querySelectorAll('svg circle'),
        {
          scale: 0,
          transformOrigin: '50% 50%',
          opacity: 0,
          delay: qkDuration / tokenLength,
          stagger: Number((qkDuration / tokenLength ** 2).toFixed(2)),
          ease: 'power2.out',
          duration: qkDuration,
        },
        '<',
      )
  }
}

function animateAttentionAndOutput(ctx: FlowStageContext) {
  const { tl, isNextTokenOnly, tokenLength, stepDuration: dur } = ctx

  animateAttentionComputation(tl, isNextTokenOnly, tokenLength)

  // Value × Attention gradient
  const valueMulStops = getGradientStops('.green-purple')
  const attnMulStops = getGradientStops('.transparent-purple2')
  animateGradient(tl, [attnMulStops, valueMulStops].flat(), {
    color: isNextTokenOnly ? FADE_OUT_COLOR : undefined,
    position: '<50%',
  })

  // Reveal attention output vectors
  const outputCells = document.querySelectorAll('.attention .head-block .head-out .column .cell')
  const outputTitle = document.querySelector('.attention .head-block .head-out .title')
  fadeInReveal(tl, [outputCells, outputTitle], isNextTokenOnly, dur)

  // Concat paths
  const [concatH1, concatH1Last] = getGradientStops('.purple-purple')
  const [concatFull, concatFullLast] = getGradientStops('.transparent-purple')
  if (isNextTokenOnly) {
    animateGradient(tl, [concatH1Last, concatFullLast], { position: '<' })
  } else {
    animateGradient(tl, [concatH1, concatFull, concatH1Last, concatFullLast])
  }
}

// ============================
// Stage 4: MLP
// ============================
function animateMLP(ctx: FlowStageContext) {
  const { tl, isNextTokenOnly, stepDuration: dur } = ctx

  // Reveal MLP input
  const mlpInputs = document.querySelectorAll('.mlp .first-layer .cell')
  fadeInReveal(tl, mlpInputs, isNextTokenOnly, dur)

  // MLP first layer path
  animateGradientPair(tl, '.purple-indigo', isNextTokenOnly)

  // Reveal MLP projections + activations
  const mlpProjections = document.querySelectorAll('.mlp .second-layer .cell')
  const mlpActivations = document.querySelectorAll('.mlp #mlp-activation .cell')
  fadeInReveal(tl, [mlpProjections, mlpActivations], isNextTokenOnly, dur)

  // MLP output path
  animateGradientPair(tl, '.indigo-blue', isNextTokenOnly)

  // Reveal MLP output
  const mlpOutputs = document.querySelectorAll('.mlp .ouputs .cell')
  fadeInReveal(tl, mlpOutputs, isNextTokenOnly, dur)
}

// ============================
// Stage 5: Block Transition & Logits
// ============================
function animateBlockTransitionAndLogits(ctx: FlowStageContext) {
  const { tl, isNextTokenOnly, isLastBlock, stepDuration: dur } = ctx

  if (isLastBlock) {
    animateGradientPair(tl, '.blue', isNextTokenOnly)
  } else {
    const [blockStop1, blockStop1Last] = getGradientStops('.blue-white-blue')
    const [blockStop2, blockStop2Last] = getGradientStops('.blue-white-blue', 3)

    const blockTl = gsap.timeline()
    if (isNextTokenOnly) {
      animateGradient(blockTl, [blockStop1Last], {
        duration: dur * 5,
        offset: { to: '50%' },
        ease: 'sine.inOut',
      })
      animateGradient(blockTl, [blockStop2Last], {
        duration: dur * 5,
        offset: { from: '50%' },
        ease: 'sine.inOut',
      })
    } else {
      animateGradient(blockTl, [blockStop1, blockStop1Last], {
        duration: dur * 5,
        offset: { to: '50%' },
        ease: 'sine.inOut',
      })
      animateGradient(blockTl, [blockStop2, blockStop2Last], {
        duration: dur * 5,
        offset: { from: '50%' },
        ease: 'sine.inOut',
      })
    }
    tl.add(blockTl)
  }

  // Reveal final output
  const finalOutput = document.querySelectorAll('.transformer-blocks .cell')
  fadeInReveal(tl, finalOutput, isNextTokenOnly, dur)

  // Logit path
  const logitStops = getGradientStops('.blue-gray')
  animateGradient(tl, logitStops, { offset: { to: '50%' } })

  // Reveal probabilities
  const probabilities = document.querySelectorAll('.softmax .content')
  tl.fromTo(probabilities, { opacity: 0 }, { opacity: 1, duration: dur })
}

// ============================
// Orchestrator
// ============================
let flowTimeline: GSAPTimeline

export const completeCurrentAnimation = () => {
  if (flowTimeline) {
    flowTimeline.progress(1)
  }
}

export const showFlowAnimation = async (tokenLength: number, isNextTokenOnly = true) => {
  completeCurrentAnimation()

  const isFirstBlock = get(blockIdx) === 0
  const isLastBlock = get(blockIdx) === get(modelMeta)?.layer_num - 1

  return new Promise<number>((resolve) => {
    const tl = gsap.timeline({
      onStart: () => isOnAnimation.set(true),
      onComplete: () => {
        isOnAnimation.set(false)
        resolve(0)
      },
    })

    const ctx: FlowStageContext = {
      tl,
      isNextTokenOnly,
      isFirstBlock,
      isLastBlock,
      tokenLength,
      stepDuration: 0.02,
    }

    animateEmbedding(ctx)
    animateQKVProjection(ctx)
    animateAttentionAndOutput(ctx)
    animateMLP(ctx)
    animateBlockTransitionAndLogits(ctx)

    flowTimeline = tl
  })
}
