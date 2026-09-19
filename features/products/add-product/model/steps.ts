export const STEPS = ["basics", "pricing", "availability"] as const
export type StepId = (typeof STEPS)[number]
