# ⚡ lightningcss-plugin-pxtorem

[![GitHub Release](https://img.shields.io/github/v/release/felixicaza/lightningcss-plugins?logo=npm)](https://www.npmjs.com/package/lightningcss-plugin-pxtorem)
[![CI](https://github.com/felixicaza/lightningcss-plugins/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/felixicaza/lightningcss-plugins/actions/workflows/test.yml)
[![Coveralls](https://img.shields.io/coverallsCoverage/github/felixicaza/lightningcss-plugins?logo=coveralls&link=https%3A%2F%2Fcoveralls.io%2Fgithub%2Ffelixicaza%2Flightningcss-plugins)](https://coveralls.io/github/felixicaza/lightningcss-plugins)
[![GitHub License](https://img.shields.io/github/license/felixicaza/lightningcss-plugins)](https://github.com/felixicaza/lightningcss-plugins/blob/main/LICENSE)

The `lightningcss-plugin-pxtorem` plugin is designed to convert pixel units to rem units in your CSS, making it easier to maintain responsive and scalable designs.

## ✨ Features

- ✅ Converts pixel units to rem units.
- ✅ Helps maintain responsive and scalable designs.
- ✅ Works seamlessly with LightningCSS and Vite ecosystem.
- ✅ Customizable options.

## ⬇️ Installation

You can install the `lightningcss-plugin-pxtorem` plugin using your preferred package manager:

NPM:
```sh
npm install lightningcss-plugin-pxtorem
```

PNPM:
```sh
pnpm add lightningcss-plugin-pxtorem
```

Yarn:
```sh
yarn add lightningcss-plugin-pxtorem
```

Bun:
```sh
bun add lightningcss-plugin-pxtorem
```

## ⚙️ Options

The plugin accepts the following options:

- `rootValue` (default: `16`): The root font size to use for the conversion. This is typically set to `16px`, which is the default font size in most browsers.
- `unitPrecision` (default: `4`): The number of decimal places to use for the converted values.
- `minValue` (default: `0`): The minimum value to convert. Also supports `negative` and `float` values.

## 🚀 Usage

Using `lightningcss-plugin-pxtorem` plugin in your project.

```js
import { transform, composeVisitors } from 'lightningcss';
import pxtorem from 'lightningcss-plugin-pxtorem';

const result = transform({
  filename: 'test.css',
  minify: true,
  code: Buffer.from(`
    .foo {
      padding: 20px 12px;
    }
  `),
  visitor: composeVisitors([
    pxtorem(),
  ]),
});

console.log(res.code.toString()); // .foo { padding: 1.25rem 0.75rem; }
```

Using `lightningcss-plugin-pxtorem` in your `vite.config.js` file:

```js
import { defineConfig } from "vite";
import { composeVisitors } from "lightningcss";
import pxtorem from "lightningcss-plugin-pxtorem";

export default defineConfig({
  css: {
    transformer: "lightningcss",
    lightningcss: {
      visitor: composeVisitors([pxtorem()]),
    },
  },
});
```

With custom options:

```js
import { defineConfig } from "vite";
import { composeVisitors } from "lightningcss";
import pxtorem from "lightningcss-plugin-pxtorem";

export default defineConfig({
  css: {
    transformer: "lightningcss",
    lightningcss: {
      visitor: composeVisitors([
        pxtorem({
          rootValue: 18,
          unitPrecision: 2,
          minValue: 10,
        }),
      ]),
    },
  },
});
```

This plugin is designed to work with [LightningCSS](https://lightningcss.dev/), a CSS processor that provides advanced features and optimizations. It's compatible with the Vite ecosystem like [UI Frameworks](https://patak.dev/vite/ecosystem.html) and [App Frameworks](https://patak.dev/vite/ecosystem.html#app-frameworks), allowing you to use it seamlessly in your projects.

## 📜 Example

With default options:

```css
/* input.css */
body {
  font-size: 16px;
  padding: 20px;
  margin: 10px;
}

h1 {
  font-size: 32px;
  line-height: 40px;
}
```

```css
/* output.css */
body {
  font-size: 1rem;
  padding: 1.25rem;
  margin: 0.625rem;
}

h1 {
  font-size: 2rem;
  line-height: 2.5rem;
}
```

See others examples in the [test folder](https://github.com/felixicaza/lightningcss-plugins/blob/main/packages/pxtorem/test).

## 🤝 Contributing

If you wish to contribute to this project, you can do so by reading the [contribution guide](https://github.com/felixicaza/lightningcss-plugins/blob/main/CONTRIBUTING.md).

## 🙌 Credits

This plugin was highly inspired by [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem).

## 📄 License

This project is licensed under the MIT License. See the [license file](https://github.com/felixicaza/lightningcss-plugins/blob/main/LICENSE) for more details.
