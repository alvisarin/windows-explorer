<template>
  <div
    class="flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors hover:bg-explorer-hover"
  >
    <IconFile :mime-type="file.mimeType" size="md" />
    <div class="flex-1 min-w-0">
      <span class="text-sm truncate block" :title="file.name">
        {{ file.name }}
      </span>
    </div>
    <span class="text-xs text-gray-500 flex-shrink-0">
      {{ formatSize(file.size) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { File } from "@/types";
import { IconFile } from "@/components/ui";

defineProps<{
  file: File;
}>();

function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
</script>
