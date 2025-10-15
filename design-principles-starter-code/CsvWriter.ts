// 1. Explain why/how this program violates the Single Responsibility Principle
// This program writes, but also decides where the write (the console). We don't want it to decide where to write, that's not its job.
//
// 2. Explain how you would refactor the program to improve its design.
//If we can pass in the file location to write to in the public write function, that would be better.

export class CsvWriter {
  public write(lines: string[][]) {
    for (let i = 0; i < lines.length; i++) this.writeLine(lines[i]);
  }

  private writeLine(fields: string[]) {
    if (fields.length == 0) console.log();
    else {
      this.writeField(fields[0]);

      for (let i = 1; i < fields.length; i++) {
        console.log(",");
        this.writeField(fields[i]);
      }
      console.log();
    }
  }

  private writeField(field: string) {
    if (field.indexOf(",") != -1 || field.indexOf('"') != -1)
      this.writeQuoted(field);
    else console.log(field);
  }

  private writeQuoted(field: string) {
    console.log('"');
    for (let i = 0; i < field.length; i++) {
      let c: string = field.charAt(i);
      if (c == '"') console.log('""');
      else console.log(c);
    }
    console.log('"');
  }
}
