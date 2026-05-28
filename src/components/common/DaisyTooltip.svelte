<script lang="ts">
import { onDestroy, onMount, type Snippet, tick } from 'svelte'

let {
  triggeredBy = '',
  triggerElements = undefined,
  placement = 'top',
  class: klass,
  children
}: { triggeredBy?: string; triggerElements?: Element[]; placement?: string; class?: string; children?: Snippet } = $props()
let el: HTMLDivElement
let visible = $state(false)
let posX = $state(0)
let posY = $state(0)
let cleanups: Array<() => void> = []
let hideTimeout: ReturnType<typeof setTimeout>

function position(triggerEl: Element) {
  if (!el) return
  const tr = triggerEl.getBoundingClientRect()
  const gap = 6
  el.style.visibility = 'hidden'
  el.style.opacity = '1'
  el.style.display = 'block'
  const tt = el.getBoundingClientRect()
  el.style.visibility = ''
  el.style.opacity = ''
  el.style.display = ''

  if (placement === 'right') {
    posX = tr.right + gap
    posY = tr.top + (tr.height - tt.height) / 2
  } else if (placement === 'left') {
    posX = tr.left - tt.width - gap
    posY = tr.top + (tr.height - tt.height) / 2
  } else if (placement === 'bottom') {
    posX = tr.left + (tr.width - tt.width) / 2
    posY = tr.bottom + gap
  } else {
    posX = tr.left + (tr.width - tt.width) / 2
    posY = tr.top - tt.height - gap
  }
}

function show(triggerEl: Element) {
  clearTimeout(hideTimeout)
  position(triggerEl)
  visible = true
}

function hide() {
  clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    visible = false
  }, 80)
}

function bindTrigger(target: Element) {
  const enter = () => show(target)
  const leave = () => hide()
  target.addEventListener('mouseenter', enter)
  target.addEventListener('mouseleave', leave)
  cleanups.push(() => {
    target.removeEventListener('mouseenter', enter)
    target.removeEventListener('mouseleave', leave)
  })
}

onMount(async () => {
  if (triggerElements && triggerElements.length > 0) {
    triggerElements.forEach(bindTrigger)
    return
  }
  if (triggeredBy) {
    await tick()
    const targets = document.querySelectorAll(triggeredBy)
    targets.forEach(bindTrigger)
    return
  }
  // fallback: hover on parent container element
  const parent = el?.parentElement
  if (parent) {
    bindTrigger(parent)
  }
})

onDestroy(() => {
  clearTimeout(hideTimeout)
  cleanups.forEach((fn) => {
    fn()
  })
})
</script>

<div
  bind:this={el}
  class="daisy-tooltip popover {klass}"
  class:visible
  style="position:fixed;left:{posX}px;top:{posY}px;"
>
  {@render children?.()}
</div>

<style>
  .daisy-tooltip {
    pointer-events: none;
    z-index: 999;
    opacity: 0;
    transition: opacity 150ms;
    background: oklch(0.21 0.006 286.033);
    color: oklch(0.92 0.004 286.32);
    padding: 0.25rem 0.625rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    line-height: 1rem;
    white-space: nowrap;
    max-width: 20rem;
    box-shadow: 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1);
  }
  .daisy-tooltip.visible {
    opacity: 1;
  }
</style>
