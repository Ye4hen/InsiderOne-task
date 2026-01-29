export interface IHorse {
  id: number
  name: string
  color: string
  condition: number
}

export type THorseList = Record<number, IHorse>

export interface IRacingHorse {
  horseId: number
  distance: number
  finished: boolean
  finishTime: number
}

export type TRoundProgress = Record<number, IRacingHorse>

export interface IHorseRankingPerRound {
  horseId: number
  finishTime: string
}

export interface IRaceResult {
  rankings: IHorseRankingPerRound[]
  distance: number
  timestamp: Date
}
