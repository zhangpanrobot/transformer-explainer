import { ATTENTION_HEAD_BACK } from '~/constants/opacity'
import type { PathItem, PathMap } from './types'

const baseBackPaths: PathItem[] = [
  {
    from: '.qkv .qkv-column .query',
    to: '.head-block .query .vector',
    gradientId: 'blue-blue2',
    opacity: ATTENTION_HEAD_BACK,
  },
  {
    from: '.qkv .qkv-column .key',
    to: '.head-block .key .vector',
    gradientId: 'red-red2',
    opacity: ATTENTION_HEAD_BACK,
  },
  {
    from: '.qkv .qkv-column .value',
    to: '.head-block .value .vector',
    gradientId: 'green-green2',
    opacity: ATTENTION_HEAD_BACK,
  },
  {
    from: '.attention .head-out .vector',
    to: '.mlp .initial .vector',
    gradientId: 'transparent-purple',
    opacity: ATTENTION_HEAD_BACK,
  },
]

export const createBackPaths = (scopePrefix: string) => {
  return baseBackPaths.map((item) => ({
    ...item,
    from: `${scopePrefix} ${item.from}`,
    to: `${scopePrefix} ${item.to}`,
  }))
}

export const createBackPathMap = (mainPrefix: string, nextPrefix: string): PathMap => ({
  attention: createBackPaths(mainPrefix),
  nextAttention: createBackPaths(nextPrefix),
})
