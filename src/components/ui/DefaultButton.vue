<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    design?: 'primary' | 'secondary' | 'danger' | 'warning'
  }>(),
  {
    design: 'primary',
  },
)

const button_classes = computed(() => {
  return {
    button: true,
    ['button--' + props.design]: true,
  }
})
</script>

<template>
  <button :class="button_classes">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use '@/assets/breakpoints' as *;
@use '@/assets/colors' as *;

.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  color: white;
}

.button:hover:not(:disabled) {
  transform: translateY(-0.125rem);
  box-shadow: $shadow-xl;
}

.button:active:not(:disabled) {
  transform: translateY(0);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--primary {
  background-color: $color-primary;
}

.button--primary:hover:not(:disabled) {
  background-color: $color-primary-hover;
}

.button--warning {
  background-color: $color-warning;
}

.button--warning:hover:not(:disabled) {
  background-color: $color-warning-hover;
}

.button--danger {
  background-color: $color-danger;
}

.button--danger:hover:not(:disabled) {
  background-color: $color-danger-hover;
}

.button--secondary {
  background-color: $color-secondary;
}

.button--secondary:hover {
  background-color: $color-secondary-hover;
}

@include tablet {
  .button {
    padding: 0.625rem 1.25rem;
    font-size: 0.9375rem;
  }
}

@include mobile {
  .button {
    width: 100%;
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }
}
</style>
