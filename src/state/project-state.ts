import { Project, ProjectStatus } from '../models/project';

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
export class ProjectState extends State<Project> {
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

export const projectState = ProjectState.getInstance();
