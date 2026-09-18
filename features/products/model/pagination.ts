export function getPageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize))
}

export function clampPage(page: number, pageCount: number): number {
  if (!Number.isFinite(page)) return 1
  return Math.min(Math.max(1, Math.trunc(page)), pageCount)
}

export function selectPage<T>(
  items: readonly T[],
  page: number,
  pageSize: number
): readonly T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}
