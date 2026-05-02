<template>
  <div class="h-full flex flex-col">
    <LoadingSpinner v-if="isLoading" full-height />

    <div v-else-if="!results" class="flex-1 flex items-center justify-center text-gray-400">
      <p class="text-sm">Enter a search term</p>
    </div>

    <div v-else-if="isEmpty" class="flex-1 flex items-center justify-center text-gray-400">
      <p class="text-sm">No results found for "{{ query }}"</p>
    </div>

    <div v-else class="flex-1 overflow-auto py-2 px-2">
      <!-- Folders section -->
      <div v-if="results.folders.length > 0" class="mb-4">
        <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-1">
          Folders ({{ results.folders.length }})
        </h3>
        <div
          v-for="folder in results.folders"
          :key="folder.id"
          class="flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors hover:bg-explorer-hover"
          @click="handleFolderClick(folder.id)"
        >
          <IconFolder size="md" />
          <div class="flex-1 min-w-0">
            <span class="text-sm truncate block" :title="folder.name">
              {{ folder.name }}
            </span>
            <span class="text-xs text-gray-400 truncate block" :title="folder.path">
              {{ folder.path }}
            </span>
          </div>
        </div>
      </div>

      <!-- Files section -->
      <div v-if="results.files.length > 0">
        <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-1">
          Files ({{ results.files.length }})
        </h3>
        <div
          v-for="file in results.files"
          :key="file.id"
          class="flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors hover:bg-explorer-hover"
          @click="handleFileClick(file.folderId)"
        >
          <IconFile :mime-type="file.mimeType" size="md" />
          <div class="flex-1 min-w-0">
            <span class="text-sm truncate block" :title="file.name">
              {{ file.name }}
            </span>
            <span class="text-xs text-gray-400">
              {{ formatSize(file.size) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SearchResult } from "@/types";
import { useExplorerStore } from "@/stores";
import { IconFolder, IconFile, LoadingSpinner } from "@/components/ui";

const props = defineProps<{
  query: string;
  results: SearchResult | null;
  isLoading: boolean;
}>();

const store = useExplorerStore();

const isEmpty = computed(
  () =>
    props.results &&
    props.results.folders.length === 0 &&
    props.results.files.length === 0
);

function handleFolderClick(folderId: string) {
  store.clearSearch();
  store.expandFolder(folderId);
  store.selectFolder(folderId);
}

function handleFileClick(folderId: string) {
  store.clearSearch();
  store.expandFolder(folderId);
  store.selectFolder(folderId);
}

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
</script>
