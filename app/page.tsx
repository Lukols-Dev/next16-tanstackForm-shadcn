import { ProductsView } from "@/features/products"

export default function Page() {
  return (
    <main className="min-h-dvh bg-muted/50 px-4 py-6 lg:py-12">
      <div className="mx-auto max-w-310">
        <ProductsView />
      </div>
    </main>
  )
}
