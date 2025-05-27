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
        <button className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700 transition-all duration-200 py-2 px-4 rounded">
          Learn More
        </button>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Advanced Topics</h2>
        <p className="mb-4">Ready to dive deeper? Explore our advanced topics:</p>
        <button className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700 transition-all duration-200 py-2 px-4 rounded">
          Learn More
        </button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">API Documentation</h2>
        <p className="mb-4">Need to integrate with our API? See our detailed documentation:</p>
        <button className="bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700 transition-all duration-200 py-2 px-4 rounded">
          Learn More
        </button>
      </section>
    </div>
  )
}

export default LearnPage
