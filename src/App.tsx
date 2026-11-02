import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Todo = {
  id: number
  text: string
  completed: boolean
}

const STORAGE_KEY = 'todo-vanancy-items'

const readTodos = (): Todo[] => {
  if (typeof window === 'undefined') return []

  try {
    const savedTodos = window.localStorage.getItem(STORAGE_KEY)
    if (!savedTodos) return []

    const parsedTodos = JSON.parse(savedTodos) as Todo[]
    return Array.isArray(parsedTodos) ? parsedTodos : []
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(readTodos)
  const [newTodo, setNewTodo] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (event: FormEvent) => {
    event.preventDefault()

    const trimmed = newTodo.trim()
    if (!trimmed) {
      setError('Введите текст задачи')
      return
    }

    setTodos((currentTodos) => [
      { id: Date.now(), text: trimmed, completed: false },
      ...currentTodos,
    ])
    setNewTodo('')
    setError('')
  }

  const toggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const removeTodo = (id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <main className="app-shell">
      <section className="todo-card">
        <header className="todo-header">
          <div>
            <p className="eyebrow">Список задач</p>
            <h1>Мои задачи</h1>
          </div>
          <span className="counter-badge">{todos.length}</span>
        </header>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            type="text"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Добавить новую задачу..."
            aria-label="Новая задача"
          />
          <button type="submit">Добавить</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="summary-row">
          <span>Выполнено: {completedCount}</span>
          <span>Осталось: {todos.length - completedCount}</span>
        </div>

        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty-state">Пока задач нет. Добавьте первую!</li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
                <label className="todo-check">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span>{todo.text}</span>
                </label>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeTodo(todo.id)}
                  aria-label={`Удалить задачу ${todo.text}`}
                >
                  Удалить
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  )
}

export default App
