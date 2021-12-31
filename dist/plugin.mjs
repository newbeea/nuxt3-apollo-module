import { createHttpLink, InMemoryCache, ApolloClient } from '@apollo/client/core';
import { defineNuxtPlugin } from '#app';
import { ApolloClients } from '@vue/apollo-composable';
import apolloOptions from '#build/apollo.options.mjs';

const apolloModuleOptions = apolloOptions;
const plugin = defineNuxtPlugin((nuxt) => {
  const apolloClients = {};
  for (const key in apolloModuleOptions) {
    const httpLink = createHttpLink(apolloModuleOptions[key]);
    const cache = new InMemoryCache();
    if (process.server) {
      const apolloClient = new ApolloClient(Object.assign(apolloModuleOptions[key], {
        ssrMode: true,
        link: httpLink,
        cache: new InMemoryCache()
      }));
      nuxt.hook("app:rendered", () => {
        nuxt.payload.data["apollo-" + key] = apolloClient.extract();
      });
      apolloClients[key] = apolloClient;
    } else {
      cache.restore(JSON.parse(JSON.stringify(nuxt.payload.data["apollo-" + key])));
      const apolloClient = new ApolloClient(Object.assign(apolloModuleOptions[key], {
        link: httpLink,
        cache,
        ssrForceFetchDelay: 100
      }));
      apolloClients[key] = apolloClient;
    }
  }
  nuxt.vueApp.provide(ApolloClients, apolloClients);
  nuxt.provide("apollo", apolloClients);
});

export { plugin as default };
