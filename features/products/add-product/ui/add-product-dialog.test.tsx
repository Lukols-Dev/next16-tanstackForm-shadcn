import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { messages } from "@/messages"

import { AddProductDialog } from "./add-product-dialog"

const form = messages.productForm
const fields = form.fields
const errors = form.errors

type StepId = keyof typeof form.steps

const STEP_NUMBERS: Record<StepId, number> = {
  basics: 1,
  pricing: 2,
  availability: 3,
}

function setup() {
  const user = userEvent.setup()
  const onCreated = vi.fn()
  render(
    <AddProductDialog
      existingSkus={new Set(["MBP14M3PRO"])}
      onCreated={onCreated}
    />
  )
  return { user, onCreated }
}

function getDialog() {
  return screen.getByRole("dialog", { name: form.dialog.title })
}

function field(label: string) {
  return within(getDialog()).getByLabelText(label)
}

function combobox(label: string) {
  return within(getDialog()).getByRole("combobox", { name: label })
}

function checkbox(name: string) {
  return within(getDialog()).getByRole("checkbox", { name })
}

function button(name: string) {
  return within(getDialog()).getByRole("button", { name })
}

function expectCurrentStep(step: StepId) {
  const title = form.steps[step].title
  expect(
    within(getDialog()).getByRole("listitem", { current: "step" })
  ).toHaveTextContent(title)
  expect(
    within(getDialog()).getByText(
      `${form.progress(STEP_NUMBERS[step], 3)}: ${title}`
    )
  ).toBeInTheDocument()
}

async function expectDialogClosed() {
  await waitFor(() =>
    expect(
      screen.queryByRole("dialog", { name: form.dialog.title })
    ).not.toBeInTheDocument()
  )
}

async function openDialog(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: messages.products.add }))
  return screen.findByRole("dialog", { name: form.dialog.title })
}

async function selectOption(user: UserEvent, label: string, option: string) {
  await user.click(combobox(label))
  await user.click(await screen.findByRole("option", { name: option }))
}

async function fillBasicsStep(user: UserEvent) {
  await user.type(field(fields.name.label), "iPhone 16")
  await user.type(field(fields.sku.label), "IP16")
  await selectOption(user, fields.manufacturer.label, "Apple")
  await selectOption(user, fields.category.label, "Telefony")
  await user.click(checkbox("Bluetooth"))
}

async function goToPricing(user: UserEvent) {
  await openDialog(user)
  await fillBasicsStep(user)
  await user.click(button(form.actions.next))
  return within(getDialog()).findByLabelText(fields.priceNet.label)
}

async function goToAvailability(user: UserEvent) {
  const priceNet = await goToPricing(user)
  await user.type(priceNet, "100")
  await user.click(button(form.actions.next))
  return within(getDialog()).findByRole("checkbox", {
    name: fields.isLimited.label,
  })
}

async function replaceValue(
  user: UserEvent,
  input: HTMLElement,
  value: string
) {
  await user.clear(input)
  await user.type(input, value)
}

describe("AddProductDialog", () => {
  it("opens on the first step with focus on the product name", async () => {
    const { user } = setup()

    await openDialog(user)

    expectCurrentStep("basics")
    await waitFor(() => expect(field(fields.name.label)).toHaveFocus())
  })

  describe("basics step", () => {
    it("shows every required field error and stays on the step when continuing empty", async () => {
      const { user } = setup()
      await openDialog(user)

      await user.click(button(form.actions.next))

      expect(field(fields.name.label)).toHaveAccessibleDescription(
        errors.name.required
      )
      expect(field(fields.sku.label)).toHaveAccessibleDescription(
        errors.sku.required
      )
      expect(combobox(fields.manufacturer.label)).toHaveAccessibleDescription(
        errors.manufacturer.required
      )
      expect(combobox(fields.category.label)).toHaveAccessibleDescription(
        errors.category.required
      )
      expect(
        within(getDialog()).getByRole("group", {
          name: fields.features.label,
          description: errors.features.required,
        })
      ).toBeInTheDocument()
      expectCurrentStep("basics")
      await waitFor(() => expect(field(fields.name.label)).toHaveFocus())
    })

    it.each([
      {
        case: "a name shorter than 3 characters",
        label: fields.name.label,
        value: "TV",
        message: errors.name.tooShort,
      },
      {
        case: "an SKU with Polish letters",
        label: fields.sku.label,
        value: "ŻÓŁW1",
        message: errors.sku.pattern,
      },
      {
        case: "an existing SKU typed in lowercase",
        label: fields.sku.label,
        value: "mbp14m3pro",
        message: errors.sku.duplicate,
      },
    ])(
      "shows why $case is rejected next to the field",
      async ({ label, value, message }) => {
        const { user } = setup()
        await openDialog(user)

        await user.type(field(label), value)
        await user.click(button(form.actions.next))

        expect(field(label)).toBeInvalid()
        expect(field(label)).toHaveAccessibleDescription(message)
        expectCurrentStep("basics")
      }
    )

    it("flags only the edited field while the user is typing", async () => {
      const { user } = setup()
      await openDialog(user)

      await user.type(field(fields.name.label), "TV")

      expect(field(fields.name.label)).toHaveAccessibleDescription(
        errors.name.tooShort
      )
      expect(field(fields.sku.label)).not.toBeInvalid()
      expect(combobox(fields.manufacturer.label)).not.toBeInvalid()
    })

    it("moves to pricing with focus on the net price when the data is valid", async () => {
      const { user } = setup()

      const priceNet = await goToPricing(user)

      expectCurrentStep("pricing")
      await waitFor(() => expect(priceNet).toHaveFocus())
    })
  })

  describe("pricing step", () => {
    it.each([
      { typed: "100", net: "100.00", gross: "123.00" },
      { typed: "99,99", net: "99.99", gross: "122.99" },
    ])(
      "calculates the gross price from a net price typed as $typed",
      async ({ typed, net, gross }) => {
        const { user } = setup()
        const priceNet = await goToPricing(user)

        await user.type(priceNet, typed)
        await user.tab()

        expect(priceNet).toHaveValue(net)
        expect(field(fields.priceGross.label)).toHaveValue(gross)
      }
    )

    it("calculates the net price from the gross price", async () => {
      const { user } = setup()
      await goToPricing(user)

      await user.type(field(fields.priceGross.label), "123")

      expect(field(fields.priceNet.label)).toHaveValue("100.00")
    })

    it("clears the gross price when the net price is cleared", async () => {
      const { user } = setup()
      const priceNet = await goToPricing(user)
      await user.type(priceNet, "100")
      expect(field(fields.priceGross.label)).toHaveValue("123.00")

      await user.clear(priceNet)

      expect(field(fields.priceGross.label)).toHaveValue("")
    })

    it("recalculates the gross price when the VAT rate changes", async () => {
      const { user } = setup()
      const priceNet = await goToPricing(user)
      await user.type(priceNet, "100")

      await selectOption(user, fields.vatRate.label, "8%")

      expect(field(fields.priceGross.label)).toHaveValue("108.00")
    })

    it("blocks continuing without prices", async () => {
      const { user } = setup()
      const priceNet = await goToPricing(user)

      await user.click(button(form.actions.next))

      expect(priceNet).toHaveAccessibleDescription(errors.priceNet.required)
      expect(field(fields.priceGross.label)).toHaveAccessibleDescription(
        errors.priceGross.required
      )
      expectCurrentStep("pricing")
    })

    it("blocks continuing with zero prices", async () => {
      const { user } = setup()
      const priceNet = await goToPricing(user)
      await user.type(priceNet, "0")

      await user.click(button(form.actions.next))

      expect(priceNet).toHaveAccessibleDescription(errors.priceNet.positive)
      expect(field(fields.priceGross.label)).toHaveAccessibleDescription(
        errors.priceGross.positive
      )
      expectCurrentStep("pricing")
    })
  })

  it("keeps entered values when going back and forward", async () => {
    const { user } = setup()
    const priceNet = await goToPricing(user)
    await user.type(priceNet, "100")
    await selectOption(user, fields.vatRate.label, "8%")
    await user.click(button(form.actions.next))
    await replaceValue(
      user,
      await within(getDialog()).findByLabelText(fields.minPerCart.label),
      "3"
    )

    await user.click(button(form.actions.back))

    expectCurrentStep("pricing")
    expect(field(fields.priceNet.label)).toHaveValue("100.00")
    expect(field(fields.priceGross.label)).toHaveValue("108.00")
    expect(combobox(fields.vatRate.label)).toHaveTextContent("8%")

    await user.click(button(form.actions.back))

    expectCurrentStep("basics")
    expect(field(fields.name.label)).toHaveValue("iPhone 16")
    expect(field(fields.sku.label)).toHaveValue("IP16")
    expect(combobox(fields.manufacturer.label)).toHaveTextContent("Apple")
    expect(combobox(fields.category.label)).toHaveTextContent("Telefony")
    expect(checkbox("Bluetooth")).toBeChecked()

    await user.click(button(form.actions.next))

    expect(
      await within(getDialog()).findByLabelText(fields.priceNet.label)
    ).toHaveValue("100.00")
    expect(field(fields.priceGross.label)).toHaveValue("108.00")

    await user.click(button(form.actions.next))

    expect(
      await within(getDialog()).findByLabelText(fields.minPerCart.label)
    ).toHaveValue("3")
  })

  describe("availability step", () => {
    it("shows and requires the stock quantity only while the product is limited", async () => {
      const { user, onCreated } = setup()
      const isLimited = await goToAvailability(user)
      const queryStock = () =>
        within(getDialog()).queryByLabelText(fields.stockQuantity.label)
      expect(queryStock()).not.toBeInTheDocument()

      await user.click(isLimited)
      await user.click(button(form.actions.submit))

      const stock = field(fields.stockQuantity.label)
      expect(stock).toHaveAccessibleDescription(errors.stockQuantity.required)
      await waitFor(() => expect(stock).toHaveFocus())
      expect(onCreated).not.toHaveBeenCalled()

      await user.click(isLimited)
      expect(queryStock()).not.toBeInTheDocument()

      await user.click(button(form.actions.submit))

      await expectDialogClosed()
      expect(onCreated).toHaveBeenCalledWith(
        expect.objectContaining({ isLimited: false })
      )
    })

    it("rejects a minimum per cart greater than the maximum", async () => {
      const { user, onCreated } = setup()
      await goToAvailability(user)

      await replaceValue(user, field(fields.minPerCart.label), "5")
      await replaceValue(user, field(fields.maxPerCart.label), "2")
      await user.click(button(form.actions.submit))

      expect(field(fields.minPerCart.label)).toHaveAccessibleDescription(
        errors.minPerCart.tooHigh
      )
      expect(field(fields.maxPerCart.label)).toHaveAccessibleDescription(
        errors.maxPerCart.tooLow
      )
      expect(onCreated).not.toHaveBeenCalled()
    })
  })

  it("saves the product and closes the dialog", async () => {
    const { user, onCreated } = setup()
    await openDialog(user)
    await fillBasicsStep(user)
    await user.type(field(fields.description.label), "Smartfon")
    await user.click(checkbox("USB-C"))
    await user.click(button(form.actions.next))
    await user.type(
      await within(getDialog()).findByLabelText(fields.priceNet.label),
      "99,99"
    )
    await selectOption(user, fields.currency.label, "EUR")
    await user.click(button(form.actions.next))
    await user.click(
      await within(getDialog()).findByRole("switch", {
        name: fields.isAvailable.label,
      })
    )
    await user.click(checkbox(fields.isLimited.label))
    await user.type(field(fields.stockQuantity.label), "25")
    await replaceValue(user, field(fields.minPerCart.label), "2")
    await replaceValue(user, field(fields.maxPerCart.label), "5")

    await user.click(button(form.actions.submit))

    await expectDialogClosed()
    expect(onCreated).toHaveBeenCalledOnce()
    expect(onCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        name: "iPhone 16",
        sku: "IP16",
        description: "Smartfon",
        manufacturer: "Apple",
        category: "Telefony",
        features: ["Bluetooth", "USB-C"],
        priceNet: 99.99,
        priceGross: 122.99,
        vatRate: 23,
        currency: "EUR",
        isAvailable: false,
        isLimited: true,
        stockQuantity: 25,
        minPerCart: 2,
        maxPerCart: 5,
      })
    )
  })

  describe("reset", () => {
    async function expectFreshWizard(user: UserEvent) {
      await openDialog(user)
      expectCurrentStep("basics")
      expect(field(fields.name.label)).toHaveValue("")
      expect(field(fields.sku.label)).toHaveValue("")
      expect(combobox(fields.manufacturer.label)).toHaveTextContent(
        fields.manufacturer.placeholder
      )
      expect(checkbox("Bluetooth")).not.toBeChecked()
    }

    it.each([
      {
        method: "Escape",
        close: (user: UserEvent) => user.keyboard("{Escape}"),
      },
      {
        method: "the close button",
        close: (user: UserEvent) => user.click(button(form.dialog.close)),
      },
    ])("starts over after closing mid-way with $method", async ({ close }) => {
      const { user } = setup()
      await goToPricing(user)

      await close(user)
      await expectDialogClosed()

      await expectFreshWizard(user)
    })

    it("starts over after a product was saved", async () => {
      const { user, onCreated } = setup()
      await goToAvailability(user)
      await user.click(button(form.actions.submit))
      await expectDialogClosed()
      expect(onCreated).toHaveBeenCalledOnce()

      await expectFreshWizard(user)
    })
  })
})
