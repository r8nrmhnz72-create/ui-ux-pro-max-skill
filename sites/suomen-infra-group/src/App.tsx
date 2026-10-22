import ShaderShowcase from "@/components/ui/hero"
import { QuoteForm } from "@/components/quote-form"
import { Facts, Footer, Services, Staffing } from "@/components/sections"

export default function App() {
  return (
    <>
      <div id="top">
        <ShaderShowcase />
      </div>
      <Facts />
      <main>
        <Services />
        <Staffing />
        <QuoteForm />
      </main>
      <Footer />
    </>
  )
}
