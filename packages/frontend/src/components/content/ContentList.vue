<template>
  <div class="h-full flex flex-col">
    <!-- Loading state -->
    <LoadingSpinner v-if="store.isLoadingChildren" full-height />

    <!-- Empty state when nothing selected -->
    <div
      v-else-if="!store.selectedFolderId"
      class="flex-1 flex items-center justify-center text-gray-400"
    >
      <div class="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1"
          stroke="currentColor"
          class="w-16 h-16 mx-auto mb-3 opacity-50"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
          />
        </svg>
        <p class="text-sm">Select a folder to view its contents</p>
      </div>
    </div>

    <!-- Content when folder selected -->
    <div v-else class="flex-1 overflow-auto py-2 px-2">
      <!-- Empty folder -->
      <div
        v-if="isEmpty"
        class="h-full flex items-center justify-center text-gray-400"
      >
        <p class="text-sm">This folder is empty</p>
      </div>

      <!-- Folder and file list -->
      <div v-else>
        <!-- Folders section -->
        <div v-if="store.currentFolders.length > 0" class="mb-4">
          <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-1">
            Folders ({{ store.currentFolders.length }})
          </h3>
          <FolderItem
            v-for="folder in store.currentFolders"
            :key="folder.id"
            :folder="folder"
          />
        </div>

        <!-- Files section -->
        <div v-if="store.currentFiles.length > 0">
          <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-1">
            Files ({{ store.currentFiles.length }})
          </h3>
          <FileItem
            v-for="file in store.currentFiles"
            :key="file.id"
            :file="file"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useExplorerStore } from "@/stores";
import { LoadingSpinner } from "@/components/ui";
import FolderItem from "./FolderItem.vue";
import FileItem from "./FileItem.vue";

const store = useExplorerStore();

const isEmpty = computed(
  () => store.currentFolders.length === 0 && store.currentFiles.length === 0
);
</script>
