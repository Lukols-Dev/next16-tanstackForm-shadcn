import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import {
  NuqsTestingAdapter,
  type OnUrlUpdateFunction,
} from "nuqs/adapters/testing"
import { describe, expect, it, vi } from "vitest"

import { Toaster } from "@/components/ui/toast"
import { formatPrice, type Product } from "@/entities/product"
import { ProductsView } from "@/features/products"
import { MOCK_PRODUCTS } from "@/features/products/data/mock-products"
import { messages } from "@/messages"

const m = messages.products
const form = messages.productForm

const names = (products: readonly Product[]) => products.map((p) => p.name)
const FIRST_PAGE = names(MOCK_PRODUCTS.slice(0, 5))
const LAST_PAGE = names(MOCK_PRODUCTS.slice(5))
const [MACBOOK, , , BOSCH, , DELL] = MOCK_PRODUCTS

const NEW_PRODUCT = {
  name: "iPad Air 11",
  sku: "IPADAIR11",
  priceNet: "2000",
  priceGross: 2460,
}

function renderProductsView(searchParams = "") {
  const onUrlUpdate = vi.fn<OnUrlUpdateFunction>()
  const user = userEvent.setup()
  render(
    <NuqsTestingAdapter
      searchParams={searchParams}
      onUrlUpdate={onUrlUpdate}
      hasMemory
    >
      <Toaster>
        <ProductsView />
      </Toaster>
    </NuqsTestingAdapter>
  )
  return { user, onUrlUpdate }
}

// jsdom renders both the desktop table and the mobile card list, so the
// table is used as the single source of truth for the visible products.
function tableRows() {
  const [, ...rows] = within(screen.getByRole("table")).getAllByRole("row")
  return rows
}

function visibleProductNames() {
  return tableRows().map(
    (row) => within(row).getAllByRole("cell")[0].textContent
  )
}

// Checks the whole page (table and mobile cards), not only the table.
function renderedAnywhere(productNames: readonly string[]) {
  return productNames.filter((name) => screen.queryAllByText(name).length > 0)
}

function tableCell(productName: string, column: string) {
  const table = within(screen.getByRole("table"))
  const index = table
    .getAllByRole("columnheader")
    .findIndex((header) => header.textContent === column)
  const row = tableRows().find((candidate) =>
    within(candidate).queryByText(productName)
  )
  const cell =
    row && index >= 0 ? within(row).getAllByRole("cell")[index] : null
  if (!cell) throw new Error(`No "${column}" cell for ${productName}`)
  return cell
}

function tablePagination() {
  const [nav] = screen.getAllByRole("navigation", { name: m.pagination.label })
  return within(nav)
}

// The table layout comes first in the DOM, so its summary is the first match.
function expectPage(page: number, pageCount: number, total: number) {
  const [summary] = screen.getAllByText(
    m.pagination.summary(page, pageCount, total)
  )
  expect(summary).toBeVisible()
  expect(
    tablePagination().getByRole("button", { current: "page" })
  ).toHaveAccessibleName(String(page))
}

function getDialog() {
  return screen.getByRole("dialog", { name: form.dialog.title })
}

async function openDialog(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: m.add }))
  return within(await screen.findByRole("dialog", { name: form.dialog.title }))
}

async function selectOption(user: UserEvent, label: string, option: string) {
  await user.click(within(getDialog()).getByRole("combobox", { name: label }))
  await user.click(await screen.findByRole("option", { name: option }))
}

async function fillBasicsStep(
  user: UserEvent,
  product: { name: string; sku: string }
) {
  const dialog = within(getDialog())
  await user.type(dialog.getByLabelText(form.fields.name.label), product.name)
  await user.type(dialog.getByLabelText(form.fields.sku.label), product.sku)
  await selectOption(user, form.fields.manufacturer.label, "Apple")
  await selectOption(user, form.fields.category.label, "Komputery")
  await user.click(dialog.getByRole("checkbox", { name: "Bluetooth" }))
}

async function addProduct(user: UserEvent, product: typeof NEW_PRODUCT) {
  const dialog = await openDialog(user)
  await fillBasicsStep(user, product)
  await user.click(dialog.getByRole("button", { name: form.actions.next }))
  await user.type(
    await dialog.findByLabelText(form.fields.priceNet.label),
    product.priceNet
  )
  await user.click(dialog.getByRole("button", { name: form.actions.next }))
  await user.click(
    await dialog.findByRole("button", { name: form.actions.submit })
  )
  // The success toast is a (non-modal) dialog too, so match by name.
  await waitFor(() =>
    expect(
      screen.queryByRole("dialog", { name: form.dialog.title })
    ).not.toBeInTheDocument()
  )
}

describe("ProductsView", () => {
  describe("pagination", () => {
    it("shows the first page of the catalog when the URL has no page", () => {
      renderProductsView()

      expect(visibleProductNames()).toEqual(FIRST_PAGE)
      expect(renderedAnywhere(LAST_PAGE)).toEqual([])
      expect(screen.getByText(m.count(7))).toBeInTheDocument()
      expectPage(1, 2, 7)
    })

    it("opens the page given in the URL", () => {
      renderProductsView("?page=2")

      expect(visibleProductNames()).toEqual(LAST_PAGE)
      expect(renderedAnywhere(FIRST_PAGE)).toEqual([])
      expectPage(2, 2, 7)
    })

    it.each([
      { search: "?page=999", page: 2, products: LAST_PAGE },
      { search: "?page=0", page: 1, products: FIRST_PAGE },
      { search: "?page=-3", page: 1, products: FIRST_PAGE },
      { search: "?page=abc", page: 1, products: FIRST_PAGE },
    ])(
      "falls back to page $page for an invalid $search",
      ({ search, page, products }) => {
        renderProductsView(search)

        expect(visibleProductNames()).toEqual(products)
        expectPage(page, 2, 7)
      }
    )

    it.each([
      {
        direction: "previous",
        edge: "first",
        search: "",
        name: m.pagination.prev,
      },
      {
        direction: "next",
        edge: "last",
        search: "?page=2",
        name: m.pagination.next,
      },
    ])(
      "disables the $direction button on the $edge page",
      ({ search, name }) => {
        renderProductsView(search)

        expect(tablePagination().getByRole("button", { name })).toBeDisabled()
      }
    )

    it("goes to the next page and pushes it to the URL history", async () => {
      const { user, onUrlUpdate } = renderProductsView()

      await user.click(
        tablePagination().getByRole("button", { name: m.pagination.next })
      )

      expect(visibleProductNames()).toEqual(LAST_PAGE)
      expectPage(2, 2, 7)
      await waitFor(() =>
        expect(onUrlUpdate).toHaveBeenLastCalledWith(
          expect.objectContaining({
            queryString: "?page=2",
            options: expect.objectContaining({ history: "push" }),
          })
        )
      )
    })

    it.each([
      { button: "previous", name: m.pagination.prev },
      { button: "page number", name: "1" },
    ])(
      "returns to page 1 with the $button button and drops the page param",
      async ({ name }) => {
        const { user, onUrlUpdate } = renderProductsView("?page=2")

        await user.click(tablePagination().getByRole("button", { name }))

        expect(visibleProductNames()).toEqual(FIRST_PAGE)
        await waitFor(() =>
          expect(onUrlUpdate).toHaveBeenLastCalledWith(
            expect.objectContaining({ queryString: "" })
          )
        )
      }
    )
  })

  describe("product table", () => {
    it.each([
      {
        variant: "an available product with unlimited stock",
        product: MACBOOK,
        search: "",
        status: m.status.available,
        stock: m.stock.unlimited,
      },
      {
        variant: "an unavailable product with zero stock",
        product: BOSCH,
        search: "",
        status: m.status.unavailable,
        stock: "0",
      },
      {
        variant: "a product priced in EUR",
        product: DELL,
        search: "?page=2",
        status: m.status.available,
        stock: m.stock.unlimited,
      },
    ])(
      "shows SKU, category, gross price, availability and stock of $variant",
      ({ product, search, status, stock }) => {
        renderProductsView(search)
        const cell = (column: string) => tableCell(product.name, column)

        expect(cell(m.columns.sku)).toHaveAccessibleName(product.sku)
        expect(cell(m.columns.category)).toHaveAccessibleName(product.category)
        expect(cell(m.columns.priceGross)).toHaveAccessibleName(
          formatPrice(product.priceGross, product.currency)
        )
        expect(cell(m.columns.status)).toHaveAccessibleName(status)
        expect(cell(m.columns.stock)).toHaveAccessibleName(stock)
      }
    )
  })

  describe("adding a product", () => {
    it("appends the new product to the end of the catalog and keeps the current page", async () => {
      const { user } = renderProductsView()

      await addProduct(user, NEW_PRODUCT)

      expect(await screen.findByText(m.toast.created)).toBeInTheDocument()
      expect(screen.getByText(m.count(8))).toBeInTheDocument()
      expect(visibleProductNames()).toEqual(FIRST_PAGE)
      expectPage(1, 2, 8)

      await user.click(tablePagination().getByRole("button", { name: "2" }))

      expect(visibleProductNames()).toEqual([...LAST_PAGE, NEW_PRODUCT.name])
      const cell = (column: string) => tableCell(NEW_PRODUCT.name, column)
      expect(cell(m.columns.sku)).toHaveAccessibleName(NEW_PRODUCT.sku)
      expect(cell(m.columns.priceGross)).toHaveAccessibleName(
        formatPrice(NEW_PRODUCT.priceGross, "PLN")
      )
    })

    it("blocks step 1 when the SKU matches a product added in this session, ignoring letter case", async () => {
      const { user } = renderProductsView()
      await addProduct(user, { ...NEW_PRODUCT, sku: "iPadAir11" })

      const dialog = await openDialog(user)
      await fillBasicsStep(user, { name: "Galaxy Tab S9", sku: "IPADAIR11" })
      await user.click(dialog.getByRole("button", { name: form.actions.next }))

      const skuInput = dialog.getByLabelText(form.fields.sku.label)
      await waitFor(() =>
        expect(skuInput).toHaveAccessibleDescription(form.errors.sku.duplicate)
      )
      expect(skuInput).toBeInvalid()
      expect(
        dialog.getByRole("listitem", { current: "step" })
      ).toHaveTextContent(form.steps.basics.title)
    })
  })
})
