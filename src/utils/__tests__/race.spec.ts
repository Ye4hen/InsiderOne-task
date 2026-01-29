import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import {
  generateHorses,
  selectRandomHorseIds,
  generateDistances,
  formatSecondsToMinutes,
} from '../race'
import type { THorseList } from '@/models/race.model'

vi.mock('@/constants/race', () => ({
  TOTAL_HORSES_COUNT: 20,
  HORSES_COUNT_PER_ROUND: 10,
  ROUNDS_COUNT: 6,
  BASE_SPEED: 2,
}))

describe('race utils', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('generateHorses()', () => {
    beforeEach(() => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
    })

    it('generates the expected number of horses (20)', () => {
      const horses: THorseList = generateHorses()
      const ids = Object.keys(horses).map((k) => Number.parseInt(k, 10))
      expect(ids).toHaveLength(20)
    })

    it('generates sequential numeric ids starting at 1', () => {
      const horses: THorseList = generateHorses()
      const ids = Object.keys(horses)
        .map((k) => Number.parseInt(k, 10))
        .sort((a, b) => a - b)
      expect(ids).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
    })

    it('assigns predefined names and colors to the first 20 horses', () => {
      const horses = generateHorses()
      expect(horses[1]!.name).toBe('Ironhoof')
      expect(horses[2]!.name).toBe('Midnight Comet')
      expect(horses[20]!.name).toBe('Lightning Crown')

      expect(horses[1]!.color).toBe('#FF6B6B')
      expect(horses[2]!.color).toBe('#4ECDC4')
      expect(horses[20]!.color).toBe('#74B9FF')
    })

    it('produces integer condition values between 1 and 100 (with mocked Math.random = 0.5 -> 51)', () => {
      const horses = generateHorses()
      expect(horses[1]!.condition).toBe(51)

      vi.spyOn(Math, 'random').mockRestore()
      const randomHorses = generateHorses()
      Object.values(randomHorses).forEach((h) => {
        expect(Number.isInteger(h.condition)).toBe(true)
        expect(h.condition).toBeGreaterThanOrEqual(1)
        expect(h.condition).toBeLessThanOrEqual(100)
      })
    })

    it('handles extreme Math.random values correctly (0 => 1, 0.99 => 100)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0)
      const minHorses = generateHorses()
      expect(minHorses[1]!.condition).toBe(1)

      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      const maxHorses = generateHorses()
      expect(maxHorses[1]!.condition).toBe(100)
    })
  })

  describe('selectRandomHorseIds()', () => {
    let horses: THorseList

    beforeEach(() => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      horses = generateHorses()
    })

    it('returns requested count of ids and they are numbers', () => {
      const selected = selectRandomHorseIds(horses, 10)
      expect(selected).toHaveLength(10)
      selected.forEach((id) => {
        expect(typeof id).toBe('number')
        expect(Number.isInteger(id)).toBe(true)
        expect(horses[id]).toBeDefined()
      })
    })

    it('returns unique ids (no duplicates) when selecting less than total', () => {
      const selected = selectRandomHorseIds(horses, 10)
      const unique = new Set(selected)
      expect(unique.size).toBe(selected.length)
    })

    it('can select all horses when count equals TOTAL_HORSES_COUNT', () => {
      const all = selectRandomHorseIds(horses, 20)
      expect(all).toHaveLength(20)
      expect(new Set(all).size).toBe(20)
    })

    it('returns empty array when selecting zero horses', () => {
      const none = selectRandomHorseIds(horses, 0)
      expect(Array.isArray(none)).toBe(true)
      expect(none).toHaveLength(0)
    })

    it('returns different selections across calls when randomness is enabled', () => {
      vi.spyOn(Math, 'random').mockRestore()
      const sel1 = selectRandomHorseIds(generateHorses(), 10)
      const sel2 = selectRandomHorseIds(generateHorses(), 10)
      expect(Array.isArray(sel1)).toBe(true)
      expect(Array.isArray(sel2)).toBe(true)
      expect(sel1.length).toBe(10)
      expect(sel2.length).toBe(10)
    })
  })

  describe('generateDistances()', () => {
    it('returns the fixed distances array', () => {
      const d = generateDistances()
      expect(d).toEqual([1200, 1400, 1600, 1800, 2000, 2200])
    })

    it('returns same array on multiple calls and length is 6', () => {
      const a = generateDistances()
      const b = generateDistances()
      expect(a).toEqual(b)
      expect(a).toHaveLength(6)
      for (let i = 0; i < a.length - 1; i++) {
        expect(a[i]).toBeLessThan(a[i + 1]!)
      }
    })
  })

  describe('formatSecondsToMinutes()', () => {
    it('formats sub-second and seconds correctly', () => {
      expect(formatSecondsToMinutes(0)).toBe('0.000s')
      expect(formatSecondsToMinutes(1)).toBe('0.001s')
      expect(formatSecondsToMinutes(10)).toBe('0.010s')
      expect(formatSecondsToMinutes(100)).toBe('0.100s')
      expect(formatSecondsToMinutes(500)).toBe('0.500s')
      expect(formatSecondsToMinutes(1000)).toBe('1.000s')
      expect(formatSecondsToMinutes(5432)).toBe('5.432s')
      expect(formatSecondsToMinutes(59999)).toBe('59.999s')
    })

    it('formats minute+ durations correctly', () => {
      expect(formatSecondsToMinutes(60000)).toBe('1:00.000')
      expect(formatSecondsToMinutes(65432)).toBe('1:05.432')
      expect(formatSecondsToMinutes(120000)).toBe('2:00.000')
      expect(formatSecondsToMinutes(125678)).toBe('2:05.678')
      expect(formatSecondsToMinutes(61234)).toBe('1:01.234')
      expect(formatSecondsToMinutes(69999)).toBe('1:09.999')
      expect(formatSecondsToMinutes(670000)).toBe('11:10.000')
      expect(formatSecondsToMinutes(3661234)).toBe('61:01.234')
      expect(formatSecondsToMinutes(600000)).toBe('10:00.000')
      expect(formatSecondsToMinutes(61001)).toBe('1:01.001')
    })

    it('pads seconds correctly', () => {
      expect(formatSecondsToMinutes(61234)).toBe('1:01.234')
      expect(formatSecondsToMinutes(69999)).toBe('1:09.999')
    })
  })
})
