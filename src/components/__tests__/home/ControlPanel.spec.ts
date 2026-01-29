import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

import ControlPanel from '@/components/home/ControlPanel.vue'
import Button from '@/components/ui/DefaultButton.vue'
import Modal from '@/components/ui/DefaultModal.vue'
import { useRaceStore } from '@/stores/race'

vi.mock('@/constants/race', () => ({
  TOTAL_HORSES_COUNT: 20,
  HORSES_COUNT_PER_ROUND: 10,
  ROUNDS_COUNT: 6,
  BASE_SPEED: 2,
}))

describe('ControlPanel', () => {
  let wrapper: VueWrapper
  let store: ReturnType<typeof useRaceStore>
  let pinia: ReturnType<typeof createPinia>

  let startSpy: ReturnType<typeof vi.spyOn>
  let resumeSpy: ReturnType<typeof vi.spyOn>
  let pauseSpy: ReturnType<typeof vi.spyOn>
  let resetSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.useFakeTimers()
    pinia = createPinia()
    setActivePinia(pinia)

    wrapper = mount(ControlPanel, {
      global: {
        plugins: [pinia],
        components: {
          Button,
          Modal,
        },
      },
    })

    store = useRaceStore()

    startSpy = vi.spyOn(store, 'startRacing')
    resumeSpy = vi.spyOn(store, 'resumeRace')
    pauseSpy = vi.spyOn(store, 'pauseRace')
    resetSpy = vi.spyOn(store, 'resetRace')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('renders Start Racing button enabled initially and triggers startRacing when clicked', async () => {
    const startBtn = wrapper.findAll('button').find((b) => b.text().trim() === 'Start Racing')
    expect(startBtn).toBeDefined()
    expect(startBtn?.attributes('disabled')).toBeUndefined()

    await startBtn!.trigger('click')
    expect(startSpy).toHaveBeenCalled()
  })

  it('disables Start button once race has started', async () => {
    store.currentRoundIndex = 0
    await nextTick()

    const startBtn = wrapper.findAll('button').find((b) => b.text().trim() === 'Start Racing')
    expect(startBtn).toBeDefined()
    expect(startBtn?.attributes('disabled')).toBeDefined()
  })

  it('shows Resume when started & paused and clicking triggers resumeRace; toggles to Pause', async () => {
    store.currentRoundIndex = 0
    store.isPaused = true
    await nextTick()

    let toggleBtn = wrapper.findAll('button').find((b) => b.text().trim() === 'Resume')
    expect(toggleBtn).toBeDefined()
    await toggleBtn!.trigger('click')
    expect(resumeSpy).toHaveBeenCalled()

    store.isPaused = false
    await nextTick()

    toggleBtn = wrapper.findAll('button').find((b) => b.text().trim() === 'Pause')
    expect(toggleBtn).toBeDefined()
    await toggleBtn!.trigger('click')
    expect(pauseSpy).toHaveBeenCalled()
  })

  it('does not show Pause/Resume when race is finished (currentRoundIndex >= ROUNDS_COUNT)', async () => {
    store.currentRoundIndex = 6
    store.isPaused = false
    await nextTick()

    const toggleBtn = wrapper.findAll('button').find((b) => {
      const t = b.text().trim()
      return t === 'Pause' || t === 'Resume'
    })
    expect(toggleBtn).toBeUndefined()
  })

  it('opens confirmation modal when Reset clicked, Cancel closes it', async () => {
    const resetBtn = wrapper.findAll('button').find((b) => b.text().trim() === 'Reset')
    expect(resetBtn).toBeDefined()

    await resetBtn!.trigger('click')
    await nextTick()
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)

    const cancelBtn = wrapper
      .findAll('.modal-overlay button')
      .find((b) => b.text().trim() === 'Cancel')
    expect(cancelBtn).toBeDefined()
    await cancelBtn!.trigger('click')
    await nextTick()

    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('calls store.resetRace when confirming reset and closes modal', async () => {
    const resetBtn = wrapper.findAll('button').find((b) => b.text().trim() === 'Reset')
    await resetBtn!.trigger('click')
    await nextTick()
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)

    const confirmBtn = wrapper
      .findAll('.modal-overlay button')
      .find((b) => b.text().trim() === 'Reset')
    expect(confirmBtn).toBeDefined()

    await confirmBtn!.trigger('click')
    await nextTick()

    expect(resetSpy).toHaveBeenCalled()
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })
})
