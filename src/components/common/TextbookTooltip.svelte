<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    isTextbookOpen,
    textbookCurrentPage,
    textbookCurrentPageId,
    textbookPreviousPage,
  } from "~/store";
  import { pageIndexById } from '~/utils/textbook/pages/actions'

  let { id, children }: { id: string; children?: Snippet } = $props();

  function openTextbook(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    const pageIndex = pageIndexById(id);
    if (pageIndex !== -1) {
      textbookPreviousPage.set($textbookCurrentPage);
      isTextbookOpen.set(true);
      textbookCurrentPage.set(pageIndex);
      textbookCurrentPageId.set(id);
    }
  }
</script>

<div
  {id}
  class="textbook-tooltip"
 
  onclick={openTextbook}
  role="button"
  tabindex="0"
>
  {@render children?.()}
</div>

<style lang="scss">
  .textbook-tooltip {
    cursor: help;
  }
</style>
