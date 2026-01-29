<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <dialog class="modal" open @click.stop>
      <h3 class="modal-title">
        <slot name="title" />
      </h3>
      <p class="modal-text">
        <slot name="text" />
      </p>
      <div class="modal-actions">
        <slot name="actions" />
      </div>
    </dialog>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/breakpoints' as *;
@use '@/assets/colors' as *;

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: $card-background;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: none;
  max-width: 25rem;
  margin: 0 auto;
  width: 90%;
  box-shadow: $shadow-2xl;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: $color-text-primary;
  margin-bottom: 0.75rem;
}

.modal-text {
  color: $color-text-secondary;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

@include mobile {
  .modal {
    padding: 1.25rem;
    width: 95%;
  }

  .modal-title {
    font-size: 1.125rem;
  }

  .modal-text {
    font-size: 0.875rem;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .button {
    width: 100%;
  }
}
</style>
