import TodoTable from "./components/todo/TodoTable"
import { Toaster } from "./components/ui/sonner"


function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2"> Todo Application</h1>
        </header>
        <main>
          <TodoTable />
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default App