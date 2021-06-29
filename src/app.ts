interface Draggable {
  /**
   * A handler that will be called when an element is dragged by the user.
   * @param event The event that is given to the function as argument, defaults to typeof `DragEvent`
   */
  dragStartHandler(event: DragEvent): void;

  /**
   * A hanlder that will be called when an element is dropped / is not being dragged by the user
   * @param event The event that is given to the function as argument, defaults to typeof `DragEvent`
   */
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  /**
   * To basically signal browser and JS that the thing you dragging something over is a valid drag target
   * If ommited, dropping is not possible
   */
  dragOverHandler(event: DragEvent): void;
  /**
   * React to the dropping of the thing, update the UI for example
   */
  dropHandler(event: DragEvent): void;
  /**
   * Giving some visual feedback to the user, well if no drop happen, we can use this to revert our visual update
   */
  dragLeaveHandler(event: DragEvent): void;
}

/**
 * Enums for Project status.
 */
enum ProjectStatus {
  /** Active project */
  Active,
  /** Finished project */
  Finished,
}

/**
 * Class for a single Project.
 * This class mostly used to insantiate a new Project.
 */
class Project {
  constructor(
    public id: string,

    public title: string,

    public description: string,

    public people: number,

    public status: ProjectStatus
  ) {}
}

type Listener<T> = (v: T[]) => void;

/* Here we are using Singleton Pattern */

/** Project State Management */

/**
 * Class for State
 */
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

/**
 * Class for a project state.
 * @extends State
 */
class ProjectState extends State<Project> {
  /**
   * List of all project as an array
   * @private
   */
  private projects: Project[] = [];

  /**
   * An instance that will be provided.
   *
   * This instance can only be one for the whole file. **singleton pattern**
   * @static
   * @private
   */
  private static instance: ProjectState;

  /**
   * Creates a state
   */
  private constructor() {
    super();
  }

  /**
   * Gets an instance of this class.
   *
   * Use this method to retrieve an instance for this class.
   *
   * @returns An instance of this class.
   */
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  /**
   * Method to add a new project at the end of the ProjectState
   * @param title The title of the project
   * @param description The description of the project
   * @param numOfPeople Number of people in the project
   */
  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      new Date().getTime().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  /**
   * Method that will be called when a project get moved.
   * This will flip the current project status with a new status provided in the params.
   *
   * @param projectId Identify which id the current Project is
   * @param newStatus And which status to be inserted as the new status
   */
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(({ id }) => id === projectId);

    // by adding project.status !== newStatus, it will not triggered a rerendered if the status is the same.
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  /**
   * Method that is used mainly to triggered the listener function for each Project in Projects.
   *
   * This method will cause a re-render of the elements.
   * @private
   */
  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

/* VALIDATION */

/**
 * An interface for a validatable Objects
 */
interface Validatable {
  /**
   * The value to be validate against each options.
   * @required
   */
  value: string | number;

  /**
   * Determines whether the value should not be empty. _(Optional)_
   */
  required?: boolean;

  /**
   * Determines the minimum length of the value, if value is a string. _(Optional)_
   */
  minLength?: number;

  /**
   * Determines the maximum length of the value, if value is a string. _(Optional)_
   */
  maxLength?: number;

  /**
   * Determines the minimum value of a number it can be _inclusive_, if value is a number. _(Optional)_
   */
  min?: number;

  /**
   * Determines the maximum value of a number it can be _inclusive_, if value is a number. _(Optional)_
   */
  max?: number;
}

/**
 * Returns a boolean indicating wheter the value was valid against the options
 * @param obj A validatable object
 */
function validate(obj: Validatable) {
  let isValid = true; // default

  if (obj.required) {
    isValid = isValid && obj.value.toString().trim().length !== 0;
  }

  if (obj.minLength != null && typeof obj.value === 'string') {
    isValid = isValid && obj.value.length >= obj.minLength;
  }

  if (obj.maxLength != null && typeof obj.value === 'string') {
    isValid = isValid && obj.value.length <= obj.maxLength;
  }

  if (obj.min != null && typeof obj.value === 'number') {
    isValid = isValid && obj.value >= obj.min;
  }

  if (obj.max != null && typeof obj.value === 'number') {
    isValid = isValid && obj.value <= obj.max;
  }

  return isValid;
}

/**
 * Decorators exclusive to Typescript
 */
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjDescriptor;
}

// Component Base Class
// A reusable instance of an UI Interface (like in React)

/**
 * An _abstract_ class representing a `Component`
 */
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

// ProjectItem class
/**
 * Class for a Project item.
 * @extends Component
 * @implements Draggable
 */
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  /**
   * The project that is stored inside the class.
   */
  private project: Project;

  /**
   * Getter for the how many person based on the project people.
   *
   * Checks whether the number of people is greater or equal to 1.
   * @returns A string representation of the number of people.
   */
  get persons() {
    if (this.project.people === 1) {
      return '1 person';
    } else {
      return `${this.project.people} persons`;
    }
  }

  /**
   * Construct and render Project Item inside the `hostElement`.
   *
   * @param hostID `id` that will be used for the host element.
   * @param project The project data as an object.
   */
  constructor(hostID: string, project: Project) {
    super('single-project', hostID, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(event: DragEvent) {
    event.preventDefault();
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

/**
 * A list of Project as a class
 * @extends Component
 * @implements DragTarget
 */
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  /**
   * A project list that will be rendered.
   */
  assignedProjects: Project[] = [];

  /**
   * Construct and render the `assignedProjects` to the `hostElement`
   * @param type Specify which type of the project status. `active` or `finished`. This will be used to describe the `id` of the project.
   */
  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      // default for drag and drop event is not to allow dropping.
      // this prevent default is to allow drop and trigger the drop event.
      event.preventDefault();

      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    event.preventDefault();
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      prjId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    projectState.addListener((projects) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        }

        return prj.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  /**
   * Method to render the list of assigned project.
   *
   * This will clear out the list before and renders a new list of assigned projects.
   * @private
   */
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    ) as HTMLUListElement;

    listEl.innerHTML = ''; // clears the list first

    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
    }
  }
}

/**
 * Class used to describe the ProjectInput
 */
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  /**
   * The input element for title.
   */
  titleInputElement!: HTMLInputElement;

  /**
   * The input element for description.
   */
  descriptionInputElement!: HTMLInputElement;

  /**
   * The input element for number of people.
   */
  peopleInputElement!: HTMLInputElement;

  /**
   * Construct and render the ProjectInput
   */
  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.configure();
  }

  configure() {
    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;
    this.element.addEventListener('submit', this.submitHandler); // using bind this will refer to the class itself -> replace with decorators
  }

  renderContent() {} // empty function just to satisfy the condition for TS

  /**
   * Validate and gather user input.
   * @returns Will give an `alert` if validation is invalid, else return a tuple of the user's input.
   */
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again!');
      return;
    } else {
      return [enteredTitle, enteredDescription, Number(enteredPeople)];
    }
  }

  /**
   * Clear the input elements value.
   */
  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  /**
   * Handler for the `submit` event.
   *
   * If userInput is valid, this will store the inputs as a project inside ProjectState class.
   */
  @autobind
  private submitHandler(evt: Event) {
    evt.preventDefault();

    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;

      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
