import { IDocument } from "../document/IDocument";
import * as readline from "readline";
import { UserInputReader } from "./UserInputReader";
import { Command } from "../Command";
import { UndoRedoManager } from "../UndoRedoManager";

export class TextEditor {
  private _document: IDocument;
  private consoleReader: readline.Interface;
  private manager: UndoRedoManager;

  constructor(document: IDocument) {
    this._document = document;
    this.consoleReader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.manager = new UndoRedoManager();
  }

  public get document(): IDocument {
    return this._document;
  }

  run(): void {
    this.consoleReader.question(this.getOptions(), (input) => {
      const option = UserInputReader.validateNumberInput(input);
      switch (option) {
        case -1:
          console.log(
            "\x1b[36m%s\x1b[0m", //cyan
            "User option returned -1."
          );
          break;
        case 1:
          this.manager.execute(new InsertCommand(this));
          //this.insert();
          break;
        case 2:
          this.manager.execute(new DeleteCommand(this));
          //this.delete();
          break;
        case 3:
          this.manager.execute(new ReplaceCommand(this));
          //this.replace();
          break;
        case 4:
          console.log(this._document.getContents());
          break;
        case 5:
          this.save();
          break;
        case 6:
          this.manager.execute(new OpenCommand(this));
          //this.open();
          break;
        case 7:
          this.manager.execute(new StartCommand(this));
          //this._document.clear();
          break;
        case 8:
          this.manager.undo();
          console.log("Undo");
          break;
        case 9:
          this.manager.redo();
          console.log("Redo");
          break;
        case 10:
          process.exit(1);
      }
      console.log();
      this.run();
    });
  }

  private getOptions(): string {
    return `
SELECT AN OPTION (1 - 10):

1. Insert a string at a specified index in the document
2. Delete a sequence of characters at a specified index
3. Replace a sequence of characters at a specified index with a new string
4. Display the current contents of the document
5. Save the document to a file
6. Open a document from a file
7. Start a new, empty document
8. Undo
9. Redo
10. Quit

Your selection: `;
  }
  /*
  private insert(): void {
    const insertionInput = UserInputReader.getUserInput("Start index: ");
    const insertionIndex = UserInputReader.validateNumberInput(insertionInput);
    const sequenceInput = UserInputReader.getUserInput("Sequence to insert: ");
    this._document.insert(insertionIndex, sequenceInput);
  }
    */
  /*
  private delete(): void {
    const deletionIndexInput = UserInputReader.getUserInput("Start index: ");
    const deletionIndex =
      UserInputReader.validateNumberInput(deletionIndexInput);

    const deletionDistanceInput = UserInputReader.getUserInput(
      "Number of characters to delete: "
    );

    const deletionDistance = UserInputReader.validateNumberInput(
      deletionDistanceInput
    );

    if (this._document.delete(deletionIndex, deletionDistance) == null) {
      console.log("Deletion unsuccessful");
    }
  }
    */

  /*
  private replace(): void {
    const replaceIndexInput = UserInputReader.getUserInput("Start index: ");
    const replaceIndex = UserInputReader.validateNumberInput(replaceIndexInput);

    let replaceDistance: number = 0;
    let replacementString: string = "";

    if (replaceIndex != -1) {
      const replaceDistanceInput = UserInputReader.getUserInput(
        "Number of characters to replace: "
      );
      replaceDistance =
        UserInputReader.validateNumberInput(replaceDistanceInput);

      if (replaceDistance != -1) {
        replacementString = UserInputReader.getUserInput(
          "Replacement string: "
        );
      }

      this._document.delete(replaceIndex, replaceDistance);
      this._document.insert(replaceIndex, replacementString);
    }
  }
    */

  private save(): void {
    const saveFileName = UserInputReader.getUserInput("Name of file: ");

    if (this._document.fileExists(saveFileName)) {
      console.log("Overwriting existing file.");
    } else {
      console.log("Writing to new file.");
    }

    this._document.save(saveFileName);
  }

  /*
  private open(): void {
    const openFileName = UserInputReader.getUserInput("Name of file to open: ");
    this._document.open(openFileName);
  }
    */
}

class StartCommand implements Command {
  private contents: string = "";
  constructor(private editor: TextEditor) {}

  do() {
    this.contents = this.editor.document.getContents();
    this.editor.document.clear();
  }

  undo() {
    this.editor.document.clear(); // is this correct?
    this.editor.document.insert(0, this.contents);
  }
}

class InsertCommand implements Command {
  constructor(
    private editor: TextEditor,
    private insertionInput = UserInputReader.getUserInput("Start index: "),
    private insertionIndex = UserInputReader.validateNumberInput(
      this.insertionInput
    ),
    private sequenceInput = UserInputReader.getUserInput("Sequence to insert: ")
  ) {}

  do() {
    this.editor.document.insert(this.insertionIndex, this.sequenceInput);
  }

  undo() {
    this.editor.document.delete(this.insertionIndex, this.sequenceInput.length);
  }
}

class DeleteCommand implements Command {
  private deletedSequence: string = "";

  constructor(
    private editor: TextEditor,
    private deletionIndexInput = UserInputReader.getUserInput("Start index: "),
    private deletionIndex = UserInputReader.validateNumberInput(
      this.deletionIndexInput
    ),
    private deletionDistanceInput = UserInputReader.getUserInput(
      "Sequence to insert: "
    ),
    private deletionDistance = UserInputReader.validateNumberInput(
      this.deletionDistanceInput
    )
  ) {}

  do() {
    this.deletedSequence = this.editor.document.delete(
      this.deletionIndex,
      this.deletionDistance
    );
    if (this.deletedSequence == null) {
      console.log("Deletion unsuccessful");
      this.deletedSequence = "";
    }
  }

  undo() {
    this.editor.document.insert(this.deletionIndex, this.deletedSequence);
  }
}

class ReplaceCommand implements Command {
  private replacedSequence: string = "";
  private replaceDistance: number = 0;
  constructor(
    private editor: TextEditor,
    private replaceIndexInput = UserInputReader.getUserInput("Start index: "),
    private replaceIndex = UserInputReader.validateNumberInput(
      this.replaceIndexInput
    )
  ) {}

  do() {
    //let replaceDistance: number = 0;
    let replacementString: string = "";

    if (this.replaceIndex != -1) {
      const replaceDistanceInput = UserInputReader.getUserInput(
        "Number of characters to replace: "
      );
      this.replaceDistance =
        UserInputReader.validateNumberInput(replaceDistanceInput);

      if (this.replaceDistance != -1) {
        replacementString = UserInputReader.getUserInput(
          "Replacement string: "
        );
      }

      this.replacedSequence = this.editor.document.delete(
        this.replaceIndex,
        this.replaceDistance
      );
      if (this.replacedSequence == null) {
        this.replacedSequence = "";
      }
      this.editor.document.insert(this.replaceIndex, replacementString);
    }
  }

  undo() {
    this.editor.document.delete(this.replaceIndex, this.replaceDistance);
    this.editor.document.insert(this.replaceIndex, this.replacedSequence);
  }
}

class OpenCommand implements Command {
  constructor(
    private editor: TextEditor,
    private openFileName = UserInputReader.getUserInput(
      "Name of file to open: "
    )
  ) {}

  do() {
    this.editor.document.open(this.openFileName);
  }

  undo() {
    this.editor.document.save(this.openFileName);
  }
}
