type GraphQLHeaders = {
  role?: string
  tenantId: string
  userId: string
}

type GraphQLError = {
  message: string
}

export type GraphQLResponse<T> = {
  data?: T
  errors?: GraphQLError[]
}

const endpoint =
  process.env.HASURA_GRAPHQL_URL ?? 'http://localhost:8080/v1/graphql'
const adminSecret = process.env.HASURA_ADMIN_SECRET ?? 'hasura'

export const graphql = async <T>(
  query: string,
  variables: Record<string, unknown>,
  headers: GraphQLHeaders,
) => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': adminSecret,
      'x-hasura-role': headers.role ?? 'user',
      'x-hasura-tenant-id': headers.tenantId,
      'x-hasura-user-id': headers.userId,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`Hasura request failed: ${response.status}`)
  }

  return (await response.json()) as GraphQLResponse<T>
}
