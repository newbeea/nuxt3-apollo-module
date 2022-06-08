'use strict';

const core = require('@apollo/client/core');
const _app = require('#app');
const apolloComposable = require('@vue/apollo-composable');
const context = require('@apollo/client/link/context');
const cookieEs = require('cookie-es');
const apolloOptions = require('#build/apollo.options.mjs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e["default"] : e; }

const apolloOptions__default = /*#__PURE__*/_interopDefaultLegacy(apolloOptions);

const apolloModuleOptions = apolloOptions__default;
const DEFAULT_CLIENT_ID = "default";
const plugin = _app.defineNuxtPlugin((nuxt) => {
  const apolloClients = {};
  const clientConfigs = apolloModuleOptions.clientConfigs ? apolloModuleOptions.clientConfigs : apolloModuleOptions;
  const defaultCookieAttributes = apolloModuleOptions.cookieAttributes;
  function getTokenName(clientId) {
    return "apollo_" + clientId + "_token";
  }
  function getToken(name, opts = {}) {
    if (process.server) {
      const cookies = cookieEs.parse(nuxt.ssrContext?.req.headers.cookie || "", opts);
      return cookies[name];
    } else if (process.client) {
      const cookies = cookieEs.parse(document.cookie, opts);
      return cookies[name];
    }
  }
  function getAuthLink(clientId, authenticationType = "Bearer") {
    const authLink = context.setContext(async (_, { headers }) => {
      const token = getToken(getTokenName(clientId));
      const authorizationHeader = token ? { Authorization: authenticationType ? "Bearer " + token : token } : {};
      return {
        headers: {
          ...headers,
          ...authorizationHeader
        }
      };
    });
    return authLink;
  }
  function serializeCookie(name, value, opts = {}) {
    if (value == null) {
      return cookieEs.serialize(name, "", { ...opts, maxAge: -1 });
    }
    return cookieEs.serialize(name, value, opts);
  }
  function writeClientCookie(name, value, opts = {}) {
    if (process.client) {
      document.cookie = serializeCookie(name, value, opts);
    }
  }
  for (const clientId in clientConfigs) {
    const options = clientConfigs[clientId];
    const authLink = getAuthLink(clientId, options.authenticationType);
    const httpLink = core.createHttpLink(options);
    const cache = new core.InMemoryCache();
    if (process.server) {
      const apolloClient = new core.ApolloClient(Object.assign(options, {
        ssrMode: true,
        link: core.concat(authLink, httpLink),
        cache: new core.InMemoryCache()
      }));
      nuxt.hook("app:rendered", () => {
        nuxt.payload.data["apollo-" + clientId] = apolloClient.extract();
      });
      apolloClients[clientId] = apolloClient;
    } else {
      cache.restore(JSON.parse(JSON.stringify(nuxt.payload.data["apollo-" + clientId])));
      const apolloClient = new core.ApolloClient(Object.assign(options, {
        link: core.concat(authLink, httpLink),
        cache,
        ssrForceFetchDelay: 100
      }));
      apolloClients[clientId] = apolloClient;
    }
  }
  const apolloHelpers = {
    onLogin: async (token, clientId, cookieAttributes, skipResetStore = false) => {
      clientId = clientId || DEFAULT_CLIENT_ID;
      cookieAttributes = cookieAttributes || defaultCookieAttributes;
      if (typeof cookieAttributes === "number")
        cookieAttributes = { expires: cookieAttributes };
      if (typeof cookieAttributes.expires === "number") {
        cookieAttributes.expires = new Date(Date.now() + 86400 * 1e3 * cookieAttributes.expires);
      }
      writeClientCookie(getTokenName(clientId), token, cookieAttributes);
      if (!skipResetStore) {
        try {
          await apolloClients[clientId].resetStore();
        } catch (e) {
          console.log("%cError on cache reset (setToken)", "color: orange;", e.message);
        }
      }
    },
    onLogout: async (clientId = DEFAULT_CLIENT_ID, skipResetStore = false) => {
      writeClientCookie(getTokenName(clientId), null);
      if (!skipResetStore) {
        try {
          await apolloClients[clientId].resetStore();
        } catch (e) {
          console.log("%cError on cache reset (logout)", "color: orange;", e.message);
        }
      }
    },
    getToken: (clientId = DEFAULT_CLIENT_ID) => {
      return getToken(getTokenName(clientId));
    }
  };
  nuxt.vueApp.provide(apolloComposable.ApolloClients, apolloClients);
  nuxt.provide("apollo", apolloClients);
  nuxt.provide("apolloHelpers", apolloHelpers);
});

module.exports = plugin;
