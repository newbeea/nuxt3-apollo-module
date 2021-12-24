import * as _nuxt_schema from '@nuxt/schema';

interface ApolloModuleOptions {
    uri: string;
}
declare const _default: _nuxt_schema.NuxtModule<ApolloModuleOptions>;

declare module '@nuxt/schema' {
    interface NuxtConfig {
        apollo?: ApolloModuleOptions;
    }
    interface NuxtOptions {
        apollo?: ApolloModuleOptions;
    }
}

export { ApolloModuleOptions, _default as default };
