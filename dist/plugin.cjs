'use strict';

const core = require('@apollo/client/core');
const _app = require('#app');
const apolloComposable = require('@vue/apollo-composable');
const apolloOptions = require('#build/apollo.options.mjs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const apolloOptions__default = /*#__PURE__*/_interopDefaultLegacy(apolloOptions);

const plugin = _app.defineNuxtPlugin((nuxt) => {
  const httpLink = core.createHttpLink({
    uri: apolloOptions__default.uri
  });
  let apolloClient;
  const cache = new core.InMemoryCache();
  if (process.server) {
    apolloClient = new core.ApolloClient({
      ssrMode: true,
      link: httpLink,
      cache: new core.InMemoryCache()
    });
    nuxt.hook("app:rendered", () => {
      nuxt.payload.data["apollo"] = apolloClient.extract();
    });
  } else {
    cache.restore(nuxt.payload.data["apollo"]);
    apolloClient = new core.ApolloClient({
      link: httpLink,
      cache
    });
  }
  apolloComposable.provideApolloClient(apolloClient);
  nuxt.provide("apollo", { DefaultApolloClient: apolloComposable.DefaultApolloClient, apolloClient });
});

module.exports = plugin;
