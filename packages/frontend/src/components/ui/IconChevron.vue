<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    :class="iconClass"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    isExpanded?: boolean;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    isExpanded: false,
    size: "sm",
  }
);

const iconClass = computed(() => {
  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };
  const rotation = props.isExpanded ? "rotate-90" : "rotate-0";
  return `${sizes[props.size]} text-gray-500 transition-transform duration-200 ${rotation}`;
});
</script>
