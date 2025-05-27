import Button from "@/components/ui/button"

const LearnPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Learn</h1>
      <p className="mb-4">
        Welcome to the learn page! Here you can find resources to help you learn more about our platform.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
        <p className="mb-4">New to our platform? Check out our getting started guide:</p>
        <Button>Learn More</Button>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Advanced Topics</h2>
        <p className="mb-4">Ready to dive deeper? Explore our advanced topics:</p>
        <Button>Learn More</Button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">API Documentation</h2>
        <p className="mb-4">Need to integrate with our API? See our detailed documentation:</p>
        <Button>Learn More</Button>
      </section>
    </div>
  )
}

export default LearnPage
