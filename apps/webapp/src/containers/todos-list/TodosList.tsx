import { gql } from '@apollo/client'
import { useSubscription } from '@apollo/client/react'
import { TodosListUI } from './TodosListUI'

const GET_TODOS = gql`
  subscription GetTodos {
    data_todos {
      id
      notes
      title
    }
  }
`

type Todo = {
  id: string
  notes: string | null
  title: string
}

type TodosSubscription = {
  data_todos: Array<Todo>
}

export const TodosList = () => {
  const {
    data: todosData,
    loading: isLoadingTodos,
    error: todosError,
  } = useSubscription<TodosSubscription>(GET_TODOS)

  const todos = todosData?.data_todos ?? []

  return (
    <TodosListUI
      errorMessage={todosError?.message}
      isLoading={isLoadingTodos}
      todos={todos}
    />
  )
}
