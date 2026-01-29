<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRaceStore } from '@/stores/race'
import { ROUNDS_COUNT } from '@/constants/race'
import DefaultModal from '@/components/ui/DefaultModal.vue'
import DefaultButton from '@/components/ui/DefaultButton.vue'

const store = useRaceStore()
const showResetConfirm = ref(false)
const hasStarted = computed(() => store.currentRoundIndex >= 0)
const isFinished = computed(() => store.currentRoundIndex >= ROUNDS_COUNT)

const handleReset = () => {
  showResetConfirm.value = true
}

const confirmReset = () => {
  store.resetRace()
  showResetConfirm.value = false
}

const cancelReset = () => {
  showResetConfirm.value = false
}
</script>

<template>
  <div class="control-panel">
    <div class="controls">
      <DefaultButton design="primary" :disabled="hasStarted" @click="store.startRacing()">
        Start Racing
      </DefaultButton>

      <DefaultButton
        v-if="hasStarted && !isFinished"
        design="warning"
        @click="store.isPaused ? store.resumeRace() : store.pauseRace()"
      >
        {{ store.isPaused ? 'Resume' : 'Pause' }}
      </DefaultButton>

      <DefaultButton design="danger" @click="handleReset">Reset</DefaultButton>
    </div>

    <DefaultModal v-if="showResetConfirm" @close="cancelReset">
      <template #title> Confirm Reset </template>
      <template #text>
        Are you sure you want to reset the race? All progress will be lost.
      </template>
      <template #actions>
        <DefaultButton design="secondary" @click="cancelReset"> Cancel </DefaultButton>
        <DefaultButton design="danger" @click="confirmReset"> Reset </DefaultButton>
      </template>
    </DefaultModal>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/breakpoints' as *;
@use '@/assets/colors' as *;

.controls {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@include tablet {
  .controls {
    gap: 0.625rem;
  }
}

@include mobile {
  .controls {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
