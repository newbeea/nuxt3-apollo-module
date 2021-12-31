
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloClientOptions,
} from '@apollo/client/core'
// @ts-expect-error #app resolved by Nuxt3
import { defineNuxtPlugin, NuxtApp } from '#app'
import { ApolloClients, provideApolloClient } from '@vue/apollo-composable'
import { ApolloModuleOptions } from './index'
// @ts-expect-error #build resolved by Nuxt3
import apolloOptions from '#build/apollo.options.mjs' // generated by index.ts
const apolloModuleOptions: ApolloModuleOptions = apolloOptions;
export default defineNuxtPlugin((nuxt: NuxtApp) => {

  

  const apolloClients: {
    [key: string]: ApolloClient<any>
  } = {};

  for (const key in apolloModuleOptions) {
    const httpLink = createHttpLink(apolloModuleOptions[key])
    const cache = new InMemoryCache();
    if (process.server) {
      const apolloClient = new ApolloClient(Object.assign(apolloModuleOptions[key], {
        ssrMode: true,
        link: httpLink,
        cache: new InMemoryCache()
      }))
      nuxt.hook("app:rendered", () => {
        // store the result
        // eslint-disable-next-line prefer-template
        nuxt.payload.data['apollo-' + key] = apolloClient.extract();
      });
      apolloClients[key] = apolloClient;
    } else {
      // restore to cache, so the client won't request
      // eslint-disable-next-line prefer-template
      cache.restore(JSON.parse(JSON.stringify(nuxt.payload.data['apollo-' + key])))
      const apolloClient = new ApolloClient(Object.assign(apolloModuleOptions[key], {
        link: httpLink,
        cache: cache,
        ssrForceFetchDelay: 100,
      }))
      apolloClients[key] = apolloClient;
    }
    
  }

  

  // provide client, used in useQuery()
  nuxt.vueApp.provide(ApolloClients, apolloClients)
  nuxt.provide("apollo", apolloClients)
})
// @ts-expect-error #app resolved by Nuxt3
declare module '#app' {
  interface NuxtApp {
    $apollo: {
      [key: string]: ApolloClient<any>
    }
  }
}