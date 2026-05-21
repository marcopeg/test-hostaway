import { gql } from '@apollo/client'
import { useSubscription } from '@apollo/client/react'
import { useParams } from '@tanstack/react-router'
import { TodoDetailsUI } from './TodoDetailsUI'

const GET_TODO = gql`
  subscription GetTodo($id: uuid!) {
    data_todos_by_pk(id: $id) {
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

type TodoSubscription = {
  data_todos_by_pk: Todo | null
}

export const TodoDetails = () => {
  const { todoId } = useParams({ from: '/$todoId' })
  const { data, loading, error } = useSubscription<TodoSubscription>(GET_TODO, {
    variables: { id: todoId },
  })
  const todo = data?.data_todos_by_pk

  return (
    <TodoDetailsUI
      errorMessage={error?.message}
      isLoading={loading}
      notes={todo?.notes}
      title={todo?.title}
      todoId={todoId}
    />
  )
}
