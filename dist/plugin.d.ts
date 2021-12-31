import { ApolloClient } from '@apollo/client/core';

declare const _default: any;

declare module '#app' {
    interface NuxtApp {
        $apollo: {
            [key: string]: ApolloClient<any>;
        };
    }
}

export { _default as default };
