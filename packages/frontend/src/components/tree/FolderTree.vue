<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-explorer-border">
      <span class="text-sm font-medium text-explorer-text">Folders</span>
      <div class="flex gap-1">
        <button
          class="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          title="Expand all"
          @click="store.expandAll()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-4 h-4"
          >
            <path
              fill-rule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button
          class="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          title="Collapse all"
          @click="store.collapseAll()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-4 h-4"
          >
            <path
              fill-rule="evenodd"
              d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Tree content -->
    <div class="flex-1 overflow-auto py-2">
      <LoadingSpinner v-if="store.isLoading && store.folderTree.length === 0" />
      <div v-else-if="store.error" class="px-3 py-2 text-sm text-red-600">
        {{ store.error }}
      </div>
      <div v-else-if="store.folderTree.length === 0" class="px-3 py-2 text-sm text-gray-500">
        No folders found
      </div>
      <div v-else>
        <FolderTreeNode
          v-for="folder in store.folderTree"
          :key="folder.id"
          :folder="folder"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExplorerStore } from "@/stores";
import { LoadingSpinner } from "@/components/ui";
import FolderTreeNode from "./FolderTreeNode.vue";

const store = useExplorerStore();
</script>
