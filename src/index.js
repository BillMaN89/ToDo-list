import Task from "./modules/task.js";
import Project from "./modules/project.js";

//test code
const myProject = new Project("Daily Tasks");

const task1 = new Task(
    "Buy groceries",
    "Milk, Eggs, Bread",
    "2025-04-01",
    "medium"
);

const task2 = new Task(
    "Go to the gym",
    "It's time for personal",
    "2025-03-27",
    "high"
);

const task3 = new Task(
    "Do the dishes",
    "you know you want to",
    "2025-03-26",
    "low"
);

const task4 = new Task(
    "Do the laundry",
    "it's been 2 days",
    "2025-03-28",
    "medium"
)

const result = myProject.addTask(task1);
console.log(result); // Πρέπει να δεις "Task 'Buy groceries' added successfully!"
myProject.addTask(task2);
myProject.addTask(task3);
myProject.addTask(task4);
console.log("All tasks in project:");
console.table(myProject.tasksList);

task2.toggleComplete();
task4.toggleComplete();

console.log("Completed Tasks:");
console.table(myProject.getCompletedTasks());

console.log("Pending Tasks: ");
console.table(myProject.getPendingTasks());

const removal = myProject.clearCompletedTasks();
console.log(removal);
console.table(myProject.tasksList);

