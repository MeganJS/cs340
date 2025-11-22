import { CommandStack } from "./Command";

export class UndoRedoManager {
  private undoStack: CommandStack;
  private redoStack: CommandStack;

  constructor() {
    this.undoStack = new CommandStack();
    this.redoStack = new CommandStack();
  }

  execute();
  undo();
  redo();
  canUndo();
  canRedo();
}
