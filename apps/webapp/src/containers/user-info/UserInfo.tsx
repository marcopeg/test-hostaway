import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { UserInfoUI } from './UserInfoUI'

const GET_ME = gql`
  query GetCurrentUser {
    me: auth_users {
      icon
      id
      name
    }
  }
`

type MeQuery = {
  me: Array<{
    icon: string
    id: string
    name: string
  }>
}

export const UserInfo = () => {
  const {
    data: meData,
    loading: isLoadingMe,
    error: meError,
  } = useQuery<MeQuery>(GET_ME)

  const user = meData?.me.at(0)
  const username = user?.name ?? 'Unknown user'
  const icon = user?.icon
  const role = __GRAPHQL_CONFIG__.headers.role ?? 'Unknown role'
  const tenantId = __GRAPHQL_CONFIG__.headers['tenant-id'] ?? 'Unknown tenant'
  const userId = __GRAPHQL_CONFIG__.headers['user-id'] ?? 'Unknown user id'

  return (
    <UserInfoUI
      errorMessage={meError?.message}
      icon={icon}
      isLoading={isLoadingMe}
      role={role}
      tenantId={tenantId}
      userId={userId}
      username={username}
    />
  )
}
