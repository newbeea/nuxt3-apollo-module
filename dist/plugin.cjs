'use strict';

const core = require('@apollo/client/core');
const _app = require('#app');
const apolloComposable = require('@vue/apollo-composable');
const apolloOptions = require('#build/apollo.options.mjs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const apolloOptions__default = /*#__PURE__*/_interopDefaultLegacy(apolloOptions);

const apolloModuleOptions = apolloOptions__default;
const plugin = _app.defineNuxtPlugin((nuxt) => {
  const apolloClients = {};
  for (const key in apolloModuleOptions) {
    const httpLink = core.createHttpLink(apolloModuleOptions[key]);
    const cache = new core.InMemoryCache();
    if (process.server) {
      const apolloClient = new core.ApolloClient(Object.assign(apolloModuleOptions[key], {
        ssrMode: true,
        link: httpLink,
        cache: new core.InMemoryCache()
      }));
      nuxt.hook("app:rendered", () => {
        nuxt.payload.data["apollo-" + key] = apolloClient.extract();
      });
      apolloClients[key] = apolloClient;
    } else {
      cache.restore(JSON.parse(JSON.stringify(nuxt.payload.data["apollo-" + key])));
      const apolloClient = new core.ApolloClient(Object.assign(apolloModuleOptions[key], {
        link: httpLink,
        cache,
        ssrForceFetchDelay: 100
      }));
      apolloClients[key] = apolloClient;
    }
  }
  nuxt.vueApp.provide(apolloComposable.ApolloClients, apolloClients);
  nuxt.provide("apollo", apolloClients);
});

module.exports = plugin;
