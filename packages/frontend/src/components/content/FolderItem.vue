<template>
  <div
    class="flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors hover:bg-explorer-hover"
    @dblclick="handleDoubleClick"
  >
    <IconFolder size="md" />
    <span class="text-sm truncate" :title="folder.name">
      {{ folder.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from "@/types";
import { useExplorerStore } from "@/stores";
import { IconFolder } from "@/components/ui";

const props = defineProps<{
  folder: Folder;
}>();

const store = useExplorerStore();

function handleDoubleClick() {
  // Navigate into the folder
  store.expandFolder(props.folder.id);
  store.selectFolder(props.folder.id);
}
</script>
