<script lang="ts">
import type { Snippet } from 'svelte'
import { onDestroy, onMount, tick } from 'svelte'

let {
  triggeredBy = '',
  triggerElements = undefined,
  placement = 'right',
  reference = undefined,
  referenceEl = undefined,
  title = undefined,
  offset = 8,
  class: klass,
  children,
}: {
  triggeredBy?: string
  triggerElements?: Element[]
  placement?: string
  reference?: string | undefined
  referenceEl?: Element | undefined
  title?: string | undefined
  offset?: number
  class?: string
  children?: Snippet
} = $props()
let el: HTMLDivElement
let visible = $state(false)
let posX = $state(0)
let posY = $state(0)
let cleanups: Array<() => void> = []
let hideTimeout: ReturnType<typeof setTimeout>

function position(triggerEl: Element) {
  if (!el) return
  const refEl = referenceEl ?? (reference ? document.querySelector(reference) : triggerEl)
  if (!refEl) return
  const tr = refEl.getBoundingClientRect()
  const gap = offset
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
  }, 150)
}

function cancelHide() {
  clearTimeout(hideTimeout)
}

function bindTriggers(targets: Element[]) {
  targets.forEach((target) => {
    const enter = () => show(target)
    const leave = () => hide()
    target.addEventListener('mouseenter', enter)
    target.addEventListener('mouseleave', leave)
    cleanups.push(() => {
      target.removeEventListener('mouseenter', enter)
      target.removeEventListener('mouseleave', leave)
    })
  })
}

onMount(async () => {
  if (triggerElements && triggerElements.length > 0) {
    bindTriggers(triggerElements)
    return
  }
  if (!triggeredBy) return
  await tick()
  const targets = document.querySelectorAll(triggeredBy)
  bindTriggers(Array.from(targets))
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
  class="popover {klass}"
  class:visible
  style="position:fixed;left:{posX}px;top:{posY}px;"
  role="tooltip"
  onmouseenter={cancelHide}
  onmouseleave={hide}
>
  {#if title}
    <div class="popover-title font-semibold text-sm mb-1">{title}</div>
  {/if}
  {@render children?.()}
</div>

<style>
  .popover {
    pointer-events: auto;
    z-index: 998;
    opacity: 0;
    transition: opacity 150ms;
    background: white;
    border: 1px solid oklch(0.929 0.013 255.508);
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: oklch(0.21 0.006 286.033);
    box-shadow: 0 4px 6px -1px oklch(0 0 0 / 0.1), 0 2px 4px -2px oklch(0 0 0 / 0.1);
    max-width: 24rem;
  }
  .popover.visible {
    opacity: 1;
  }
</style>
