[![pxtorem](https://raw.githubusercontent.com/felixicaza/lightningcss-plugins/HEAD/.github/assets/pxtorem.jpg)](https://npmx.dev/package/lightningcss-plugin-pxtorem)

# ⚡ lightningcss-plugin-pxtorem

[![npm version](https://img.shields.io/npm/v/lightningcss-plugin-pxtorem?color=f49813&logo=npm&logoColor=888888&labelColor=ffffff)](https://npmx.dev/package/lightningcss-plugin-pxtorem)
[![GitHub actions workflow tests status](https://img.shields.io/github/actions/workflow/status/felixicaza/lightningcss-plugins/tests.yml?color=f49813&logo=rocket&logoColor=888888&label=tests&labelColor=ffffff)](https://github.com/felixicaza/lightningcss-plugins/actions/workflows/tests.yml)
[![license](https://img.shields.io/badge/license-MIT-f49813?logo=googledocs&logoColor=888888&labelColor=ffffff)](https://github.com/felixicaza/lightningcss-plugins/blob/main/LICENSE)

The [`lightningcss-plugin-pxtorem`][pxtorem] plugin is designed to convert pixel units to rem units in your CSS, making it easier to maintain responsive and scalable designs.

## ✨ Features

- 📏 Converts pixel units to rem units.
- 📱 Helps maintain responsive and scalable designs.
- ⚡ Works seamlessly with LightningCSS and Vite ecosystem.
- ⚙️ Customizable options.

## 📦 Installation

You can install [`lightningcss-plugin-pxtorem`][pxtorem] using npm:

```sh
$ npm install lightningcss-plugin-pxtorem
```

<details>
  <summary>Using a different package manager?</summary>
  <br/>

  Using pnpm:
  ```sh
  $ pnpm add lightningcss-plugin-pxtorem
  ```

  Using yarn:
  ```sh
  $ yarn add lightningcss-plugin-pxtorem
  ```

  Using bun:
  ```sh
  $ bun add lightningcss-plugin-pxtorem
  ```
</details>

## ⚡ Usage

Add the plugin in your project.

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
  visitor: composeVisitors([pxtorem()]),
});

console.log(result.code.toString()); // .foo { padding: 1.25rem 0.75rem; }
```

Add the plugin in your `vite.config.js` file:

```js
// vite.config.js
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

> [!TIP]
> Since it's a LightningCSS plugin, it's compatible with the Vite ecosystem like [UI Frameworks](https://patak.dev/vite/ecosystem.html) and [App Frameworks](https://patak.dev/vite/ecosystem.html#app-frameworks), allowing you to use it seamlessly in your projects.

### ⚙️ Options

The plugin accepts an object options:

#### `rootValue` (number) — optional (default: 16)

The root font size to use for the conversion. This is typically set to `16px`, which is the default font size in most browsers.

#### `unitPrecision` (number) — optional (default: 4)

The number of decimal places to use for the converted values.

#### `minValue` (number) — optional (default: 0)

The minimum value to convert. Also supports `negative` and `float` values.

#### `propList` (string | RegExp)[] — optional (default: ['font', 'font-size', 'line-height', 'letter-spacing', 'word-spacing'])

A list of properties to convert. You can use a string or an array of strings and/or regex patterns.

- Use `*` as a wildcard to match every property. Example: `['*']`
- Place `*` before or after a term to match partial property names. Example: `['*position*']` matches `background-position-y`
- Prefix a property with `!` to exclude it from matching. Example: `['*', '!letter-spacing']`
- The exclusion prefix can be combined with wildcard patterns. Example: `['*', '!font*']`

#### `ignoreSelectors` (string | RegExp)[] — optional (default: [])

A list of selectors to ignore conversion. You can use a string or an array of strings and/or regex patterns.

- When the value is a string, the selector is considered a match if it includes that string. Example: `['body']` matches `.body-class`.
- When the value is a regular expression, the selector is tested against that pattern. Example: `[/^body$/]` matches `body`, but does not match `.body`.

#### `mediaQuery` (boolean) — optional (default: false)

Whether to convert pixel units in media queries.

<details>
  <summary>Example</summary>
  <br/>

  ```js
  // vite.config.js
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
            propList: ['*', '!letter-spacing'],
            ignoreSelectors: ['body', /^\.no-convert$/],
            mediaQuery: true,
          }),
        ]),
      },
    },
  });
  ```
</details>

See more examples in [tests folder](https://github.com/felixicaza/lightningcss-plugins/blob/main/packages/pxtorem/tests).

## 🏆 Credits

This plugin is the LightningCSS version of [@cuth/postcss-pxtorem](https://github.com/cuth/postcss-pxtorem).

## 🤝 Contributing

Contributions to this library are welcome! If you have any ideas for improvements or new features, please feel free to open an issue or submit a pull request, I appreciate your help in making [lightningcss-plugin-pxtorem][pxtorem] better for everyone. Please read the [CONTRIBUTING.md](https://github.com/felixicaza/lightningcss-plugins/blob/main/CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/felixicaza/lightningcss-plugins/blob/main/LICENSE) file for details.

[pxtorem]: https://npmx.dev/package/lightningcss-plugin-pxtorem
