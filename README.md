### Learn

`<template>` tags are default HTML tags supported by modern browser.
Not loaded immediately but instead can be reached by JS/TS and rendered it when we want it or to control with.

```html
<template id="project-input">
  <form>
    <div class="form-control">
      <label for="title">Title</label>
      <input type="text" id="title" />
    </div>
    <div class="form-control">
      <label for="description">Description</label>
      <textarea id="description" rows="3"></textarea>
    </div>
    <div class="form-control">
      <label for="people">People</label>
      <input type="number" id="people" step="1" min="0" max="10" />
    </div>
    <button type="submit">ADD PROJECT</button>
  </form>
</template>
```

```typescript
// take the template and render it to the div with id #app
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    // this take the template element content and assign it to a const
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // this create a field with the first element child of the importedNode, reason as to why this is a must because importedNode will be type of `DocumentFragment` not a `HTMLElement`
    this.element = importedNode.firstElementChild as HTMLFormElement;

    // immediately render `element` inside `templateElement`
    this.attach();
  }

  // Method to attach `this.element` into `this.hostElement` as a child of it.
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

// By instantiating a new instance of the `ProjectInput` class,
// we automatically rendered the template inside the #app div
const prjInput = new ProjectInput();
```
