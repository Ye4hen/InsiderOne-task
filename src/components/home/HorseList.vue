<script setup lang="ts">
import { computed } from 'vue'
import { useRaceStore } from '@/stores/race'
import { TOTAL_HORSES_COUNT } from '@/constants/race'

const raceStore = useRaceStore()

const horsesList = computed(() => Object.values(raceStore.horses))
const hasHorses = computed(() => !!horsesList.value.length)

const getConditionStatus = (condition: number) => {
  if (condition >= 80) return { label: 'Excellent', class: 'excellent' }
  if (condition >= 60) return { label: 'Good', class: 'good' }
  if (condition >= 40) return { label: 'Fair', class: 'fair' }
  return { label: 'Poor', class: 'poor' }
}

const isRacing = (horseId: number) => {
  return raceStore.racingHorseIds.includes(horseId)
}
</script>

<template>
  <div class="horse-list">
    <div class="section-header">
      <h2 class="section-title">Horses</h2>
      <h4 class="section-subtitle">
        Total: <strong>{{ TOTAL_HORSES_COUNT }}</strong>
      </h4>
    </div>

    <div v-if="!hasHorses" class="empty-state section-container">
      <p>No horses generated yet. Click "Start Racing" to begin!</p>
    </div>

    <div v-else class="horses-grid section-container">
      <div
        v-for="horse in horsesList"
        :key="horse.id"
        class="horse-card"
        :class="{ racing: isRacing(horse.id) }"
      >
        <div class="horse-indicator" :style="{ backgroundColor: horse.color }"></div>
        <div class="horse-info">
          <div class="horse-name">{{ horse.name }}</div>
          <div class="horse-id">ID: {{ horse.id }}</div>
        </div>
        <div class="condition">
          <div class="condition-value">{{ horse.condition }}</div>
          <div class="condition-status" :class="getConditionStatus(horse.condition).class">
            {{ getConditionStatus(horse.condition).label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/breakpoints' as *;
@use '@/assets/colors' as *;

.horse-list {
  position: relative;
  background: $card-background;
  border-radius: 0.5rem;
  box-shadow: $shadow-md;
}

.empty-state {
  text-align: center;
  padding: 2.5rem 1.25rem;
  color: $color-text-secondary;
}

.horses-grid {
  display: grid;
  gap: 0.75rem;
}

.horse-card {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  background-color: $color-background-soft;
  padding: 1rem;
  border-radius: 0.375rem;
  border: 0.125rem solid transparent;
}

.horse-card.racing {
  border-color: $color-primary;
  background-color: $color-primary-light;
}

.horse-indicator {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: $shadow-button;
}

.horse-info {
  flex: 1;
  min-width: 0;
}

.horse-name {
  font-size: 1rem;
  font-weight: 600;
  color: $color-text-primary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.horse-id {
  font-size: 0.75rem;
  color: $color-text-secondary;
  margin-top: 0.125rem;
}

.condition {
  text-align: right;
  flex-shrink: 0;
}

.condition-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: $color-text-primary;
}

.condition-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  margin-top: 0.25rem;
  display: inline-block;
}

.condition-status.excellent {
  background-color: $condition-excellent-bg;
  color: $condition-excellent-text;
}

.condition-status.good {
  background-color: $condition-good-bg;
  color: $condition-good-text;
}

.condition-status.fair {
  background-color: $condition-fair-bg;
  color: $condition-fair-text;
}

.condition-status.poor {
  background-color: $condition-poor-bg;
  color: $condition-poor-text;
}

@include tablet {
  .horse-list {
    order: 1;
  }

  .horse-card {
    padding: 0.875rem;
    gap: 0.625rem;
  }

  .horse-indicator {
    width: 2.25rem;
    height: 2.25rem;
  }

  .horse-name {
    font-size: 0.9375rem;
  }

  .condition-value {
    font-size: 1.125rem;
  }
}

@include mobile {
  .empty-state {
    padding: 1.875rem 1rem;
    font-size: 0.875rem;
  }

  .horse-card {
    padding: 0.375rem;
    gap: 0.375rem;
  }

  .horse-indicator {
    width: 1.5rem;
    height: 1.5rem;
  }

  .horse-name {
    font-size: 0.8125rem;
  }

  .horse-id {
    font-size: 0.625rem;
  }

  .condition-value {
    font-size: 1rem;
  }

  .condition-status {
    font-size: 0.625rem;
    padding: 0.0625rem 0.25rem;
  }
}
</style>
