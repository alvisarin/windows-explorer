<template>
  <div class="select-none">
    <div
      class="flex items-center gap-1 py-1 px-2 rounded cursor-pointer transition-colors"
      :class="nodeClasses"
      :style="{ paddingLeft: `${depth * 16 + 8}px` }"
      @click="handleClick"
    >
      <!-- Expand/collapse chevron -->
      <button
        v-if="hasChildren"
        class="p-0.5 hover:bg-gray-200 rounded"
        @click.stop="toggleExpand"
      >
        <IconChevron :is-expanded="isExpanded" />
      </button>
      <div v-else class="w-4" />

      <!-- Folder icon -->
      <IconFolder :is-open="isExpanded && hasChildren" size="sm" />

      <!-- Folder name -->
      <span class="text-sm truncate" :title="folder.name">
        {{ folder.name }}
      </span>
    </div>

    <!-- Children (recursive) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[2000px]"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[2000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isExpanded && hasChildren" class="overflow-hidden">
        <FolderTreeNode
          v-for="child in folder.children"
          :key="child.id"
          :folder="child"
          :depth="depth + 1"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FolderTreeNode as FolderTreeNodeType } from "@/types";
import { useExplorerStore } from "@/stores";
import { IconFolder, IconChevron } from "@/components/ui";

const props = withDefaults(
  defineProps<{
    folder: FolderTreeNodeType;
    depth?: number;
  }>(),
  {
    depth: 0,
  }
);

const store = useExplorerStore();

const hasChildren = computed(() => props.folder.children.length > 0);
const isExpanded = computed(() => store.isFolderExpanded(props.folder.id));
const isSelected = computed(() => store.selectedFolderId === props.folder.id);

const nodeClasses = computed(() => ({
  "bg-explorer-selected": isSelected.value,
  "hover:bg-explorer-hover": !isSelected.value,
}));

function handleClick() {
  store.selectFolder(props.folder.id);
}

function toggleExpand() {
  store.toggleFolderExpanded(props.folder.id);
}
</script>
