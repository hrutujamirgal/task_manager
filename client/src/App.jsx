import { UserProvider } from './context/UserContext'
import { TaskProvider } from './context/TaskContext'

// import { useAuth } from './context/UserContext'
import Home from "./components/Home"

function App() {
  // const { id } = useAuth()

  return (
    <>
      <UserProvider>
        <TaskProvider>
          <Home />
        </TaskProvider>
      </UserProvider>
    </>
  )
}

export default App
