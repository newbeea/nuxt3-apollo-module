import * as _nuxt_schema from '@nuxt/schema';
import { ApolloClientOptions } from '@apollo/client/core';

interface ApolloModuleOptions {
    default: Partial<ApolloClientOptions<any>>;
    [name: string]: Partial<ApolloClientOptions<any>>;
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
