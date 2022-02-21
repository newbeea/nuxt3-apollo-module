# @nuxt3/apollo-module

Apollo module for nuxt3

## Demo
[nuxt3-apollo-starter](https://github.com/newbeea/nuxt3-apollo-starter)

## Installation

```bash
npm i -D @nuxt3/apollo-module
```

## Configuration
```js
// nuxt.config.js
import '@nuxt3/apollo-module' // import to remove config warning, not necessary
export default {
  buildModules: [
    '@nuxt3/apollo-module'
  ],
  apollo: {
    default: {
      // see https://www.apollographql.com/docs/react/api/core/ApolloClient/#ApolloClient.constructor
    },
    client1: {
      // multiple client
    },
    client2: {
      // multiple client
    }
  }
}
```

## Usage
Query code(You can use[@nuxt3/graphql-codegen-module](https://github.com/newbeea/nuxt3-graphql-codegen-module) to generate code)
```
import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'

export const HelloDocument = gql`
  query Hello {
    world
  }

`

export function useHelloQuery() {
  return VueApolloComposable.useQuery<any, any>(HelloDocument, {}, {
    // prefetch: false, // prefetch: false will fetch on client
  })
}
```

Fetch in setup
```
<script setup lang="ts">
import { useHelloQuery } from '@/api'

// default client
const { result, loading } = await useHelloQuery() 
// result: { "world": "Hello world!" }

// use client by id
const { result, loading } = await useHelloQuery({
  clientId: 'client1'
}) 
// result: { "world": "Hello world!" }

// client only 
const { result, loading } = await useHelloQuery({
  prefetch: false
}) 
// result: { "world": "Hello world!" } (check 'result && result.world' in template is necessary)
</script>
```


## Dev

```
pnpm i
```

```
pnpm run build
```



## License

MIT License © 2021-PRESENT [Phil xu](https://github.com/newbeea)
