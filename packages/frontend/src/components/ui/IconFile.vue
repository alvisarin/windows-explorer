<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    :class="iconClass"
  >
    <path
      fill-rule="evenodd"
      d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z"
      clip-rule="evenodd"
    />
    <path
      d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    mimeType?: string | null;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    mimeType: null,
    size: "md",
  }
);

const iconClass = computed(() => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  let color = "text-gray-400";
  if (props.mimeType) {
    if (props.mimeType.startsWith("image/")) color = "text-green-500";
    else if (props.mimeType.startsWith("video/")) color = "text-purple-500";
    else if (props.mimeType.startsWith("audio/")) color = "text-pink-500";
    else if (props.mimeType.includes("pdf")) color = "text-red-500";
    else if (props.mimeType.includes("spreadsheet") || props.mimeType.includes("excel"))
      color = "text-green-600";
    else if (props.mimeType.includes("document") || props.mimeType.includes("word"))
      color = "text-blue-600";
    else if (props.mimeType.includes("presentation") || props.mimeType.includes("powerpoint"))
      color = "text-orange-500";
    else if (props.mimeType.includes("zip") || props.mimeType.includes("archive"))
      color = "text-amber-600";
    else if (
      props.mimeType.includes("javascript") ||
      props.mimeType.includes("typescript") ||
      props.mimeType.includes("html") ||
      props.mimeType.includes("css")
    )
      color = "text-blue-500";
  }

  return `${sizes[props.size]} ${color} flex-shrink-0`;
});
</script>
