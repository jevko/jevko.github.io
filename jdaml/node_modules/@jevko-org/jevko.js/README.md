<img alt="Jevko logo" src="logo.svg" width="128" />

# jevko.js

[![](https://data.jsdelivr.com/v1/package/gh/jevko/jevko.js/badge)](https://www.jsdelivr.com/package/gh/jevko/jevko.js)

Implementation of [Jevko](https://jevko.org) in JavaScript.

Includes a Jevko parser/decoder (`jevkoFromString`) and a Jevko stringifier/encoder (`jevkoToString`).

<!-- as well as fns that can escape, stringtoheredoc -->
<!-- supports the heredoc grammar extension -->

## Installation

### Node.js

An [npm package](https://www.npmjs.com/package/@jevko-org/jevko.js) is available:

```
npm install @jevko-org/jevko.js
```

### Deno and the browser

Import from [jsDelivr](https://www.jsdelivr.com/):

```js
import {jevkoFromString} from 'https://cdn.jsdelivr.net/gh/jevko/jevko.js@v0.2.0/mod.js'
```

## Quickstart

```js
import {jevkoFromString} from 'https://cdn.jsdelivr.net/gh/jevko/jevko.js@v0.2.0/mod.js'

jevkoFromString(`hello [world]`) 
// -> {
//   "subjevkos": [
//     {
//       "prefix": "hello ",
//       "jevko": {
//         "subjevkos": [],
//         "suffix": "world"
//       }
//     }
//   ],
//   "suffix": ""
// }
```

## License

[MIT](LICENSE)
