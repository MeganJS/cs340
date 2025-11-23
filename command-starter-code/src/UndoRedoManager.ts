import { Command, CommandStack } from "./Command";

export class UndoRedoManager {
  private undoStack: CommandStack;
  private redoStack: CommandStack;

  constructor() {
    this.undoStack = new CommandStack();
    this.redoStack = new CommandStack();
  }

  execute(command: Command) {
    command.do();
    this.undoStack.push(command);
  }
  undo() {
    if (this.canUndo()) {
      let command: Command = this.undoStack.pop()!;
      command.undo();
      this.redoStack.push(command);
    }
  }
  redo() {
    if (this.canRedo()) {
      let command: Command = this.redoStack.pop()!;
      command.do();
      this.undoStack.push(command);
    }
  }
  canUndo(): boolean {
    return !this.undoStack.isEmpty();
  }
  canRedo() {
    return !this.redoStack.isEmpty();
  }
}
