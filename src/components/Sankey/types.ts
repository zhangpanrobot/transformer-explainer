export type PathItem = {
  from: string
  to: string
  gradientId?: string
  fill?: string
  opacity?: number
  unique?: boolean
  curve?: number
  type?: 'stroke' | 'shape'
  id?: string
  pathGenerator?: (source: DOMRect, target: DOMRect, curve: number) => string
  onMouseOver?: () => void
  onMouseOut?: () => void
  onMouseClick?: (e: MouseEvent) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onMouseMove?: (e: MouseEvent) => void
  onMouseUp?: (e: MouseEvent) => void
  onMouseDown?: (e: MouseEvent) => void
  onMouseWheel?: (e: WheelEvent) => void
  onMouseContextMenu?: (e: MouseEvent) => void
}

export type PathMap = Record<string, PathItem[]>
