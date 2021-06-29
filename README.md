# Drag and drop using Typescript

A simple website built with Typescript that implements drag and drop API.

## Development

1. Clone the repository.
2. `cd` into the cloned repository and run `npm install`
3. Then run `npm run dev` to start a development server using webpack.
4. Any changes made in the TS files will automatically trigger a recompilling from webpack.

## Build

To output a single files from multiple files and stores it in `dist` folder.

```shell
$ npm run build
```

## Learn

### General

- Learn how to separate code into separate `modules` to easily rework those in separation of other files.
- Learn how to use **OOP** approach to render and manage the state of an elements.
- Using a singleton pattern to manage a state. [Singleton in Typescript](https://refactoring.guru/design-patterns/singleton/typescript/example)

### TS:

- Learn how to use `interfaces`, `types`, `decorators`.
- Learn how to use `abstract` classes
- Learn **visibility** of members/fields and methods in a class using `private`, `protected` or `public`.
- Using `modules` in TS via `namespaces` or using es6 modules `import` and `export`

### HTML:

- `<template>` tags in HTML.

> The `<template>` HTML element is a mechanism for holding HTML _that is not to be rendered immediately_ when a page is loaded but _may be instantiated subsequently during runtime using JavaScript_.
>
> Source: [MDN Template Tags](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)

- `drag drop` API for an element.
  - how to use `dragStart` , `dragEnd`, `drop` handlers and others.
  - how to use the `dataTransfer` for a draggable element.
    > Source: [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

### Webpack:

- Bundling multiple files into a single file to reduce `HTTP` request and improve loading performance in `production` build.
- How to set up a workflow using `webpack` for typescript with `ts-loader`
- Setting up 2 configuration for either a `development` or `production` build.
