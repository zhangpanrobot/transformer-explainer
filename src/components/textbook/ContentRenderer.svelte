<script lang="ts">
  import type { ContentBlock } from '~/utils/textbook/pages/types'

  let { blocks }: { blocks: ContentBlock[] } = $props()
</script>

{#each blocks as block}
  {#if block.type === 'paragraph'}
    <p>{@html block.html}</p>
    {#if block.spaceAfter}<br />{/if}
  {:else if block.type === 'blockquote'}
    <blockquote class="question">{@html block.html}</blockquote>
  {:else if block.type === 'ul'}
    <ul>
      {#each block.items as item}
        <li>{@html item}</li>
      {/each}
    </ul>
  {:else if block.type === 'ol'}
    <ol>
      {#each block.items as item}
        <li>{@html item}</li>
      {/each}
    </ol>
  {:else if block.type === 'numbered-list'}
    <div class="numbered-list">
      {#each block.items as item}
        <div class="numbered-item">
          <span class="number-circle">{item.number}</span>
          <div class="item-content">{@html item.html}</div>
        </div>
      {/each}
    </div>
  {/if}
{/each}
