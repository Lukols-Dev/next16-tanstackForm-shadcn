import { describe, expect, it } from "vitest"

import { clampPage, getPageCount, selectPage } from "./pagination"

const pageSize = 5

function productIds(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index + 1)
}

describe("getPageCount", () => {
  it.each([
    { total: 0, pages: 1 },
    { total: 5, pages: 1 },
    { total: 6, pages: 2 },
    { total: 7, pages: 2 },
    { total: 10, pages: 2 },
  ])("splits $total products into $pages page(s)", ({ total, pages }) => {
    expect(getPageCount(total, pageSize)).toBe(pages)
  })
})

describe("clampPage", () => {
  const pageCount = 3

  it.each([
    { scenario: "keeps a page within range", page: 2, expected: 2 },
    { scenario: "moves page 0 to the first page", page: 0, expected: 1 },
    {
      scenario: "moves a negative page to the first page",
      page: -4,
      expected: 1,
    },
    {
      scenario: "moves a page past the end to the last page",
      page: 999,
      expected: 3,
    },
    { scenario: "drops the fractional part of a page", page: 2.7, expected: 2 },
    {
      scenario: "moves a fraction below 1 to the first page",
      page: 0.5,
      expected: 1,
    },
    {
      scenario: "falls back to the first page for NaN",
      page: NaN,
      expected: 1,
    },
    {
      scenario: "falls back to the first page for Infinity",
      page: Infinity,
      expected: 1,
    },
    {
      scenario: "falls back to the first page for -Infinity",
      page: -Infinity,
      expected: 1,
    },
  ])("$scenario ($page -> $expected)", ({ page, expected }) => {
    expect(clampPage(page, pageCount)).toBe(expected)
  })
})

describe("selectPage", () => {
  it.each([
    { scenario: "first page", total: 12, page: 1, expected: [1, 2, 3, 4, 5] },
    { scenario: "middle page", total: 12, page: 2, expected: [6, 7, 8, 9, 10] },
    { scenario: "partial last page", total: 12, page: 3, expected: [11, 12] },
    {
      scenario: "full last page",
      total: 10,
      page: 2,
      expected: [6, 7, 8, 9, 10],
    },
  ])("returns the products of the $scenario", ({ total, page, expected }) => {
    expect(selectPage(productIds(total), page, pageSize)).toEqual(expected)
  })
})
