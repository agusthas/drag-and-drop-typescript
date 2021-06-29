import { DragTarget } from '../models/drag-drop';
import { Project, ProjectStatus } from '../models/project';
import { Component } from './base-component';
import { autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';
import { ProjectItem } from './project-item';

/**
 * A list of Project as a class
 * @extends Component
 * @implements DragTarget
 */
export class ProjectList
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
