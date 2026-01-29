<template>
  <main class="not-found">
    <section class="card" aria-labelledby="not-found-title">
      <h1 id="not-found-title">Page not found</h1>

      <p class="message">We couldn't find the page you were looking for.</p>

      <p v-if="attemptedPath" class="attempted">
        Attempted path:
        <code class="path">{{ attemptedPath }}</code>
      </p>

      <div class="actions" aria-label="Not found actions">
        <RouterLink :to="{ name: 'home' }" class="btn"> Go home </RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const attemptedPath = computed(() => {
  const pathMatch = route.params.pathMatch
  if (Array.isArray(pathMatch)) {
    return '/' + pathMatch.join('/')
  }
  if (typeof pathMatch === 'string' && pathMatch.length) {
    return pathMatch.startsWith('/') ? pathMatch : '/' + pathMatch
  }
  return '/'
})
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  color: #111827;
  background: #f8fafc;
}

.card {
  max-width: 720px;
  width: 100%;
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 6px 20px rgba(17, 24, 39, 0.08);
  text-align: center;
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.message {
  margin: 0 0 1rem;
  color: #374151;
}

.attempted {
  margin: 0 0 1.25rem;
  color: #6b7280;
}

.path {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.15rem 0.5rem;
  background: #f3f4f6;
  border-radius: 6px;
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Helvetica Neue', monospace;
  font-size: 0.95rem;
  color: #111827;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: none;
  background: #0f172a;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-secondary {
  background: transparent;
  color: #0f172a;
  border: 1px solid #e5e7eb;
}

.btn:focus,
.btn-secondary:focus {
  outline: 3px solid rgba(59, 130, 246, 0.2);
  outline-offset: 2px;
}
</style>
