import * as fs from "fs";
import * as path from "path";

export abstract class FileProcess {
  protected dirName: string;
  protected fileRegExp: RegExp;
  protected recurse: boolean;

  protected constructor(
    dirName: string,
    filePattern: string,
    recurse: boolean = false
  ) {
    this.dirName = dirName;
    this.fileRegExp = new RegExp(filePattern);
    this.recurse = recurse;
  }

  protected async run() {
    await this.processDirectory(this.dirName);
    this.printTotal();
  }

  private async processDirectory(filePath: string) {
    if (this.isDirectory(filePath)) {
      if (this.isReadable(filePath)) {
        const files = fs.readdirSync(filePath);

        for (let file of files) {
          const fullPath = path.join(filePath, file);
          if (this.isFile(fullPath)) {
            if (this.isReadable(fullPath)) {
              await this.processFile(fullPath);
            } else {
              this.unreadableFile(fullPath);
            }
          }
        }

        if (this.recurse) {
          for (let file of files) {
            const fullPath = path.join(filePath, file);
            if (this.isDirectory(fullPath)) {
              await this.processDirectory(fullPath);
            }
          }
        }
      }
      this.unreadableDirectory(filePath);
      return;
    }
    this.nonDirectory(filePath);
  }

  protected isDirectory(path: string): boolean {
    try {
      return fs.statSync(path).isDirectory();
    } catch (error) {
      return false;
    }
  }

  protected isFile(path: string): boolean {
    try {
      return fs.statSync(path).isFile();
    } catch (error) {
      return false;
    }
  }

  protected isReadable(path: string): boolean {
    try {
      fs.accessSync(path, fs.constants.R_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  protected unreadableFile(fullPath: string): void {
    console.log(`File ${fullPath} is unreadable`);
  }

  protected nonDirectory(dirName: string): void {
    console.log(`${dirName} is not a directory`);
  }

  protected unreadableDirectory(dirName: string): void {
    console.log(`Directory ${dirName} is unreadable`);
  }

  protected abstract processFile(filePath: string): void;
  protected abstract printTotal(): void;
}
