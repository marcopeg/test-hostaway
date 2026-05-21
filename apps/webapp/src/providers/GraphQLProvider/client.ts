import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const graphqlConfig = __GRAPHQL_CONFIG__

const hasuraHeaders = Object.fromEntries([
  ['x-hasura-admin-secret', graphqlConfig.password],
  ...Object.entries(graphqlConfig.headers).map(([key, value]) => [
    `x-hasura-${key}`,
    value,
  ]),
])

const httpLink = new HttpLink({
  uri: '/v1/graphql',
  headers: hasuraHeaders,
})

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${protocol}//${window.location.host}/v1/graphql`,
    connectionParams: {
      headers: hasuraHeaders,
    },
  }),
)

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

export const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})
