import { Draggable } from '../models/drag-drop.js';
import { Project } from '../models/project.js';
import { Component } from './base-component.js';
import { autobind } from '../decorators/autobind.js';

// ProjectItem class
/**
 * Class for a Project item.
 * @extends Component
 * @implements Draggable
 */
export class ProjectItem
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
