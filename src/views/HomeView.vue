<script setup lang="ts">
import ControlPanel from '@/components/home/ControlPanel.vue'
import HorseList from '@/components/home/HorseList.vue'
import RaceTrack from '@/components/home/RaceTrack.vue'
import RaceResults from '@/components/home/RaceResults.vue'
</script>

<template>
  <header class="header">
    <h1 class="title">Horse Race Simulator</h1>
    <ControlPanel />
  </header>

  <main>
    <div class="main-content">
      <HorseList />
      <RaceTrack />
      <RaceResults />
    </div>
  </main>
</template>
