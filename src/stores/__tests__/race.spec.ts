// @vitest-environment node

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRaceStore } from '../race'

vi.mock('@/utils/race', () => ({
  generateHorses: vi.fn(() => {
    const horses: Record<number, { id: number; name: string; color: string; condition: number }> =
      {}
    for (let i = 1; i <= 20; i++) {
      horses[i] = {
        id: i,
        name: `Horse ${i}`,
        color: '#000000',
        condition: 50,
      }
    }
    return horses
  }),
  selectRandomHorseIds: vi.fn((horses: Record<number, unknown>, count: number) =>
    Array.from({ length: count }, (_, i) => i + 1),
  ),
  generateDistances: vi.fn(() => [1200, 1400, 1600, 1800, 2000, 2200]),
  formatSecondsToMinutes: vi.fn((ms: number) => `${(ms / 1000).toFixed(3)}s`),
}))

vi.mock('@/constants/race', () => ({
  TOTAL_HORSES_COUNT: 20,
  HORSES_COUNT_PER_ROUND: 10,
  ROUNDS_COUNT: 6,
  BASE_SPEED: 2,
}))

describe('useRaceStore', () => {
  let store: ReturnType<typeof useRaceStore>
  let perfSpy: ReturnType<typeof vi.spyOn>
  let dateSpy: ReturnType<typeof vi.spyOn>

  let now = 0

  const advanceTick = (ms: number) => {
    now += ms
    perfSpy.mockReturnValue(now)
    vi.advanceTimersByTime(ms)
  }

  const finishHorseByIdAt = (id: number, finishAtMs: number) => {
    store.roundProgress[id]!.distance = 99
    perfSpy.mockReturnValue(finishAtMs)
    vi.advanceTimersByTime(100)
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useRaceStore()

    vi.useFakeTimers()

    perfSpy = vi.spyOn(performance, 'now')
    dateSpy = vi.spyOn(Date, 'now')

    perfSpy.mockReturnValue(0)
    dateSpy.mockReturnValue(0)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('has expected empty initial state', () => {
      expect(store.horses).toEqual({})
      expect(store.roundProgress).toEqual({})
      expect(store.raceResults).toEqual([])
      expect(store.currentRoundIndex).toBe(-1)
      expect(store.isPaused).toBe(true)
      expect(store.racingHorseIds).toEqual([])
      expect(store.currentRoundDistance).toBe(0)
    })
  })

  describe('startRacing()', () => {
    it('generates schedule and starts first round', () => {
      const spySetInterval = vi.spyOn(globalThis, 'setInterval')
      store.startRacing()

      expect(store.isPaused).toBe(false)
      expect(store.currentRoundIndex).toBe(0)
      expect(Object.keys(store.horses)).toHaveLength(20)
      expect(Object.keys(store.roundProgress)).toHaveLength(10)
      expect(store.racingHorseIds).toHaveLength(10)
      expect(store.currentRoundDistance).toBe(1200)
      expect(spySetInterval).toHaveBeenCalledWith(expect.any(Function), 100)
    })

    it('populates roundProgress entries with expected initial shape', () => {
      store.startRacing()
      const entry = store.roundProgress[1]!
      expect(entry).toBeDefined()
      expect(entry.horseId).toBe(1)
      expect(entry.finished).toBe(false)
      expect(entry.distance).toBe(0)
      expect(entry.finishTime).toBe(0)
    })
  })

  describe('animateRace behavior (ticks)', () => {
    beforeEach(() => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
    })

    it('updates distances on tick', () => {
      store.startRacing()

      expect(store.roundProgress[1]!.distance).toBe(0)
      advanceTick(100)

      expect(store.roundProgress[1]!.distance).toBeGreaterThan(0)
    })

    it('calculates speed roughly according to formula (sanity check)', () => {
      store.startRacing()
      advanceTick(100)
      expect(store.roundProgress[1]!.distance).toBeCloseTo(2.8, 1)
    })

    it('does not move horses already marked finished', () => {
      store.startRacing()
      store.roundProgress[1]!.finished = true
      const before = store.roundProgress[1]!.distance
      advanceTick(100)
      expect(store.roundProgress[1]!.distance).toBe(before)
    })

    it('marks a horse finished when distance threshold exceeded', () => {
      store.startRacing()
      finishHorseByIdAt(1, 1000)
      expect(store.roundProgress[1]!.finished).toBe(true)
      expect(store.roundProgress[1]!.finishTime).toBe(1000)
    })

    it('advances to next round and records results when all horses finish', () => {
      store.startRacing()
      const ids = store.racingHorseIds
      ids.forEach((id, idx) => {
        finishHorseByIdAt(id, 1000 + idx * 10)
      })

      expect(store.raceResults).toHaveLength(1)
      expect(store.currentRoundIndex).toBe(1)
      expect(store.currentRoundDistance).toBe(1400)
    })
  })

  describe('pause/resume behavior', () => {
    it('pauseRace sets isPaused and clears interval', () => {
      const clearSpy = vi.spyOn(globalThis, 'clearInterval')
      store.startRacing()
      expect(store.isPaused).toBe(false)
      perfSpy.mockReturnValue(500)
      store.pauseRace()
      expect(store.isPaused).toBe(true)
      expect(clearSpy).toHaveBeenCalled()
    })

    it('resumeRace resumes and accumulates paused time', () => {
      store.startRacing()
      perfSpy.mockReturnValue(1000)
      store.pauseRace()
      perfSpy.mockReturnValue(4000)
      store.resumeRace()
      expect(store.isPaused).toBe(false)

      finishHorseByIdAt(1, 7000)
      expect(store.roundProgress[1]!.finishTime).toBe(4000)
    })

    it('multiple pause/resume cycles accumulate correctly', () => {
      store.startRacing()
      perfSpy.mockReturnValue(1000)
      store.pauseRace()
      perfSpy.mockReturnValue(2000)
      store.resumeRace()
      perfSpy.mockReturnValue(3000)
      store.pauseRace()
      perfSpy.mockReturnValue(5000)
      store.resumeRace()

      finishHorseByIdAt(1, 8000)
      expect(store.roundProgress[1]!.finishTime).toBe(5000)
    })
  })

  describe('setRoundResult and rankings', () => {
    it('stores result with distance and timestamp', () => {
      dateSpy.mockReturnValue(123456789)
      store.startRacing()

      store.racingHorseIds.forEach((id) => {
        store.roundProgress[id]!.distance = 101
        store.roundProgress[id]!.finishTime = id * 10
      })

      vi.advanceTimersByTime(100)

      expect(store.raceResults).toHaveLength(1)
      const res = store.raceResults[0]!
      expect(res.distance).toBe(1200)
      expect(res.timestamp).toEqual(new Date(123456789))
      expect(res.rankings[0]!.horseId).toBe(1)
      expect(res.rankings.at(-1)!.horseId).toBe(10)
    })

    it('formats finish times as strings in rankings', () => {
      store.startRacing()
      store.roundProgress[1]!.distance = 101
      store.roundProgress[1]!.finishTime = 500

      store.racingHorseIds.forEach((id) => {
        if (id !== 1) {
          store.roundProgress[id]!.distance = 101
          store.roundProgress[id]!.finishTime = 1000 + id
        }
      })

      vi.advanceTimersByTime(100)

      const first = store.raceResults[0]!.rankings[0]!
      expect(typeof first.finishTime).toBe('string')
    })
  })

  describe('resetRace and lifecycle', () => {
    it('resetRace clears round state and stops interval', () => {
      const clearSpy = vi.spyOn(globalThis, 'clearInterval')
      store.startRacing()
      vi.advanceTimersByTime(200)
      store.resetRace()
      expect(store.currentRoundIndex).toBe(-1)
      expect(store.isPaused).toBe(true)
      expect(Object.keys(store.roundProgress)).toHaveLength(0)
      expect(clearSpy).toHaveBeenCalled()
    })

    it('allows starting a new race after reset', () => {
      store.startRacing()
      vi.advanceTimersByTime(200)
      store.resetRace()
      store.startRacing()
      expect(store.currentRoundIndex).toBe(0)
      expect(store.isPaused).toBe(false)
      expect(Object.keys(store.horses)).toHaveLength(20)
    })
  })
})
