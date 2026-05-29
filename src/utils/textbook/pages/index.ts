import { advancedPages } from './advanced'
import { architecturePages } from './architecture'
import { attentionPages } from './attention'
import { embeddingPages } from './embedding'
import { introPages } from './intro'
import { outputPages } from './output'
import type { TextbookPage } from './types'

export type { ContentBlock, TextbookPage } from './types'

export const textPages: TextbookPage[] = [
  ...introPages,
  ...architecturePages,
  ...embeddingPages,
  ...attentionPages,
  ...outputPages,
  ...advancedPages,
]
