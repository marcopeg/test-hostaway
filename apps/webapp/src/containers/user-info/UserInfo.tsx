import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { UserInfoUI } from './UserInfoUI'

const GET_ME = gql`
  query GetTodos {
    me: auth_users {
      username
    }
  }
`

type MeQuery = {
  me: Array<{
    username: string
  }>
}

export const UserInfo = () => {
  const {
    data: meData,
    loading: isLoadingMe,
    error: meError,
  } = useQuery<MeQuery>(GET_ME)

  const username = meData?.me.at(0)?.username ?? 'Unknown user'
  const role = __GRAPHQL_CONFIG__.headers.role ?? 'Unknown role'
  const userId = __GRAPHQL_CONFIG__.headers['user-id'] ?? 'Unknown user id'

  return (
    <UserInfoUI
      errorMessage={meError?.message}
      isLoading={isLoadingMe}
      role={role}
      userId={userId}
      username={username}
    />
  )
}
