import Task from "./modules/task.js";
import Project from "./modules/project.js";
import ProjectManager from "./modules/projectManager.js";
import Storage from "./modules/storage.js";

//Project test code
// 1. Δημιουργία ProjectManager
const manager = new ProjectManager();

const project1 = new Project("Personal");
const task1 = new Task("Go shopping", "Buy groceries", "2025-04-01", "medium");
const task2 = new Task("Call mom", "Quick check-in", "2025-04-02", "low");

project1.addTask(task1);
project1.addTask(task2);

manager.addProject(project1);

//localStorage test
const saved = Storage.save(manager);

if (saved) {
  console.log("✅ Data saved successfully!");
} else {
  console.warn("❌ Saving failed.");
}

const restoredManager = Storage.load();

if (restoredManager) {
  console.log("✅ Data loaded successfully!");

  // Δείξε τον αριθμό των projects
  console.log("Number of projects:", restoredManager.projects.length);

  // Δείξε το όνομα του current project
  const current = restoredManager.getCurrentProject();
  console.log("Current project name:", current ? current.name : "None");

  // Δείξε τα tasks του πρώτου project
  console.log("Tasks in first project:");
  console.table(restoredManager.projects[0].tasksList);
  
} else {
  console.warn("❌ No data found in localStorage.");
}


// // 5. Έλεγχος projects και currentProject
// console.table(manager.projects);
// console.log("Current project index:", manager.currentProject);

// //manager.setCurrentProject(1);
// console.log(manager.getCurrentProject());


// // 6. Διαγραφή project με άκυρο index
// console.log(manager.removeProject(10)); // ❌ Invalid index

// // 7. Διαγραφή του current project (που είναι index 0)
// console.log(manager.removeProject(0)); // ✅ Project removed
// console.table(manager.projects);
// console.log("Current project index after removal:", manager.currentProject);

// // 8. Διαγραφή του τελευταίου project
// console.log(manager.removeProject(0)); // ✅ Project removed
// console.log("Projects after full deletion:", manager.projects);
// console.log("Current project (should be null):", manager.currentProject);

//test code
// const myProject = new Project("Daily Tasks");

// const task1 = new Task(
//     "Buy groceries",
//     "Milk, Eggs, Bread",
//     "2025-04-01",
//     "medium"
// );

// const task2 = new Task(
//     "Go to the gym",
//     "It's time for personal",
//     "2025-03-27",
//     "high"
// );

// const task3 = new Task(
//     "Do the dishes",
//     "you know you want to",
//     "2025-03-26",
//     "low"
// );

// const task4 = new Task(
//     "Do the laundry",
//     "it's been 2 days",
//     "2025-03-28",
//     "medium"
// )

// const result = myProject.addTask(task1);
// console.log(result); // Πρέπει να δεις "Task 'Buy groceries' added successfully!"
// myProject.addTask(task2);
// myProject.addTask(task3);
// myProject.addTask(task4);
// console.log("All tasks in project:");
// console.table(myProject.tasksList);

// task2.toggleComplete();
// task4.toggleComplete();

// console.log("Completed Tasks:");
// console.table(myProject.getCompletedTasks());

// console.log("Pending Tasks: ");
// console.table(myProject.getPendingTasks());

// const removal = myProject.clearCompletedTasks();
// console.log(removal);
// console.table(myProject.tasksList);


