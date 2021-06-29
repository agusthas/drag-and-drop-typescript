/**
 * Enums for Project status.
 */
export enum ProjectStatus {
  /** Active project */
  Active,
  /** Finished project */
  Finished,
}

/**
 * Class for a single Project.
 * This class mostly used to insantiate a new Project.
 */
export class Project {
  constructor(
    public id: string,

    public title: string,

    public description: string,

    public people: number,

    public status: ProjectStatus
  ) {}
}
