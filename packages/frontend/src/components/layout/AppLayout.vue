<template>
  <div class="h-screen flex flex-col bg-explorer-bg">
    <!-- Header -->
    <header class="flex items-center gap-4 px-4 py-2 bg-white border-b border-explorer-border">
      <h1 class="text-lg font-semibold text-explorer-text">Windows Explorer</h1>
      <div class="flex-1 max-w-md">
        <SearchBar
          v-model="store.searchQuery"
          @search="handleSearch"
          @clear="handleClearSearch"
        />
      </div>
      <div v-if="store.selectedFolder" class="text-sm text-gray-500">
        {{ store.selectedFolder.path }}
      </div>
    </header>

    <!-- Main content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left panel - folder tree -->
      <LeftPanel class="w-72 flex-shrink-0">
        <FolderTree />
      </LeftPanel>

      <!-- Right panel - content -->
      <RightPanel class="flex-1">
        <SearchResults
          v-if="store.isSearching"
          :query="store.searchQuery"
          :results="store.searchResults"
          :is-loading="store.isLoading"
        />
        <ContentList v-else />
      </RightPanel>
    </div>

    <!-- Status bar -->
    <footer class="px-4 py-1 bg-gray-100 border-t border-explorer-border text-xs text-gray-500">
      <span v-if="store.selectedFolder">
        {{ store.currentFolders.length }} folders, {{ store.currentFiles.length }} files
      </span>
      <span v-else>Ready</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useExplorerStore } from "@/stores";
import { SearchBar, SearchResults } from "@/components/search";
import { FolderTree } from "@/components/tree";
import { ContentList } from "@/components/content";
import LeftPanel from "./LeftPanel.vue";
import RightPanel from "./RightPanel.vue";

const store = useExplorerStore();

onMounted(() => {
  store.fetchFolderTree();
});

function handleSearch(query: string) {
  store.search(query);
}

function handleClearSearch() {
  store.clearSearch();
}
</script>
