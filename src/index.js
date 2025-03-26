import Task from "./modules/task.js";
import Project from "./modules/project.js";

//test code
const task1 = new Task(
    "Buy groceries",
    "Milk, Eggs, Bread",
    "2025-04-01",
    "medium"
);
  
const myProject = new Project("Daily Tasks");
const result = myProject.addTask(task1);
console.log(result); // Πρέπει να δεις "Task 'Buy groceries' added successfully!"

console.log("All tasks in project:");
console.table(myProject.tasksList);

const result2 = myProject.addTask("go to gym"); // string, όχι Task object
console.log(result2); // Πρέπει να δεις το warning + "Invalid Task, please try again"


