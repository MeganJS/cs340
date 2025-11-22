export interface Command {
  do(): void;
  undo(): void;
  //execute(): void;
}

export class CommandStack {
  private items: Command[];

  constructor() {
    this.items = [];
  }

  push(item: Command): void {
    this.items.push(item);
  }

  pop(): Command | undefined {
    return this.items.pop();
  }

  peek(): Command | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}
