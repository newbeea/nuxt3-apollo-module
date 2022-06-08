import * as _nuxt_schema from '@nuxt/schema';
import { ApolloClientOptions } from '@apollo/client/core';

declare type ClientConfig = Partial<ApolloClientOptions<any>> & {
    authenticationType?: string;
};
interface ApolloModuleOptions {
    [name: string]: ClientConfig | any;
    default?: ClientConfig;
    clientConfigs?: {
        default: ClientConfig;
        [name: string]: ClientConfig;
    };
    cookieAttributes?: {
        expires?: number;
        path?: string;
        domain?: string;
        secure?: boolean;
    };
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
