import { dirname, resolve } from "pathe";
import { fileURLToPath } from "url";
import { defineNuxtModule, addTemplate, addPluginTemplate } from '@nuxt/kit'
import URI from 'urijs'

import type {
  InMemoryCache,
  ApolloClientOptions,
} from '@apollo/client/core'
// @ts-expect-error #app resolved by Nuxt3
import { NuxtApp } from '#app'

type ClientConfig = Partial<ApolloClientOptions<any>> & {
  authenticationType?: string
}
export interface ApolloModuleOptions {
  [name: string]: ClientConfig | any // <= 0.0.9
  serverUri?: string
  default?: ClientConfig // <= 0.0.9
  clientConfigs?: { // > 0.0.9
    default: ClientConfig
    [name: string]: ClientConfig
  }
  cookieAttributes?: {
    expires?: number
    path?: string
    domain?: string
    secure?: boolean
  }
}
export default defineNuxtModule<ApolloModuleOptions>({

  meta: {
    name: '@nuxt3/apollo-module',
    configKey: 'apollo',
  },
  setup(options, nuxt) {
    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    nuxt.options.build.transpile.push('@apollo/client', '@vue/apollo-composable', 'ts-invariant/process')

    const __dirname__ = dirname(fileURLToPath(import.meta.url));

    const server = nuxt.options.server
    options.serverUri = options.serverUri ?? new URI({
      protocol: server.https ? 'https' : 'http',
      hostname: server.host,
      port: server.port,
    }).toString()

    // save options to apollo.options.mjs
    addTemplate({
      filename: 'apollo.options.mjs',
      getContents: () => `export default ${JSON.stringify(options)}`,
    })

    // add apollo plugin ( see plugin.ts ) to server and client
    addPluginTemplate({
      src: resolve(__dirname__, "./plugin.mjs"),
      mode: 'all'
    });

  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    apollo?: ApolloModuleOptions
  }
  interface NuxtOptions {
    apollo?: ApolloModuleOptions
  }
}
