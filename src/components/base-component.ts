/**
 * An _abstract_ class representing a `Component`
 */
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  /**
   * A template element for the component
   *
   * This indicates an `template` tags inside the HTML
   */
  templateElement: HTMLTemplateElement;

  /**
   * The first child ot the `template` element as an HTMLElement.
   *
   * This is the element that will be inserted with JS/TS inside the `hostElement`
   */
  element: U;

  /**
   * The host element where the `element` should be inserted into. (this means inside)
   */
  hostElement: T;

  /**
   * Get the first child of the `template` tags, transform it to an HTML Element, and renders/attach it as a child of the `hostElement`.
   *
   * @param templateId the `id` of the `template` tags in the HTML
   *
   * @param hostElementId the `id` of the host element in HTML
   *
   * @param insertAtStart A boolean indicating where to insert the `element` in the `hostElement`.
   *
   * if **true** than it will be inserted `afterBegin`
   *
   * if **false** it will be inserted `beforeEnd`.
   *
   * NOTES: `afterBegin` is like prepend, where `beforeEnd` is like append.
   *
   * @param newElementId the `id` of the new element _(Optional)_
   * If ommited then the element will be rendered without an `id`.
   */
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    ) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId) as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  /**
   * Method to render/attach the element to the hostElement.
   * @param insertAtBeginning A boolean indicating where to insert the `element`
   */
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }

  /**
   * Method to configure how the element will behave.
   * @abstract
   */
  abstract configure(): void;
  /**
   * Method to specifiy which or what to render.
   * @abstract
   */
  abstract renderContent(): void;
}
