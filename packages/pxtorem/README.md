# ⚡ lightningcss-plugin-pxtorem

The `lightningcss-plugin-pxtorem` plugin is designed to convert pixel units to rem units in your CSS, making it easier to maintain responsive and scalable designs.

> [!NOTE]
> WIP - This plugin is still a work in progress.

## ✨ Features

- ✅ Converts pixel units to rem units.
- ✅ Helps maintain responsive and scalable designs.
- ✅ Customizable options for root value, precision, properties, and more.

## ⬇️ Installation

You can install the `lightningcss-plugin-pxtorem` plugin using npm or yarn:

```sh
npm install lightningcss-plugin-pxtorem
```

or

```sh
pnpm add lightningcss-plugin-pxtorem
```

## 🚀 Usage

To use the `lightningcss-plugin-pxtorem` you need to include it in your `vite.config.js` file:

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

This plugin also is compatible with others tools that use Vite.

## 🤝 Contributing

If you wish to contribute to this project, you can do so by reading the [contribution guide](../../CONTRIBUTING.md).

## 🙌 Credits

This plugin was highly inspired by [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem).

## 📄 License

This project is licensed under the MIT License. See the [license file](../../LICENSE) for more details.
