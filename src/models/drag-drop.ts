export interface Draggable {
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

export interface DragTarget {
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
