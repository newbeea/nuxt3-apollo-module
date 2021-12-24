# @nuxt3/apollo-module

Nuxt module for Apollo


## Installation

```bash
npm i -D @nuxt3/apollo-module
```

## Configuration
NOTICE: add @apollo/client, ts-invariant/process to 'transpile'
```js
// nuxt.config.js
import '@nuxt3/apollo-module' // import to remove config warning, not necessary
export default {
  build: {
    transpile: [
      '@apollo/client',
      'ts-invariant/process',
    ],
  },
  buildModules: [
    '@nuxt3/apollo-module'
  ],
  apollo: {
    uri: ''
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
const { result, loading } = await useHelloQuery()
// result: { "world": "Hello world!" }
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
