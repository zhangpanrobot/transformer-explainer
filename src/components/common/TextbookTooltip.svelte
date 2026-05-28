<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    isTextbookOpen,
    textbookCurrentPage,
    textbookCurrentPageId,
    textbookPreviousPage,
    userId,
  } from "~/store";
  import { textPages } from "~/utils/textbookPages";

  let { id, children }: { id: string; children?: Snippet } = $props();

  function openTextbook(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    const pageIndex = textPages.findIndex((page) => page.id === id);
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
  data-click={`textbook-tooltip`}
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
