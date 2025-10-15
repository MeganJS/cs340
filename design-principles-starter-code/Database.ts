// 1. What design principle(s) does this code violate?
// This Course class has three functions related to databases. This violates Single Responsibility Principle.
// In addition, the names of the methods are not specific to courses and are thus too genera.
// 2. Explain how you would refactor this code to improve its design.
// improve the names of the static methods to include course (createCourse, findCourse, updateCourse)
// Put all three functions within a class like DatabaseHandler or another class to talk with the server.

export class Course {
  name: string;
  credits: number;

  constructor(name: string, credits: number) {
    this.name = name;
    this.credits = credits;
  }

  static async create(name: string, credits: number): Promise<Course> {
    // ... Code to insert a new Course object into the database ...
  }

  static async find(name: string): Promise<Course | undefined> {
    // ... Code to find a Course object in the database ...
  }

  async update(): Promise<void> {
    // ... Code to update a Course object in the database ...
  }
}
