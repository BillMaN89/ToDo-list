import Task from "./modules/task.js";


//console test code
const task1 = new Task(
    "Finish Odin Project",
    "Complete the To Do List assignment",
    "2025-04-01",
    "high"
  );

console.log("Initial summary:", task1.getSummary());
console.log("Initial completed status:", task1.completedStatus);
console.log("Overdue check:", task1.isOverdue());

task1.toggleComplete();
console.log("After toggle:", task1.completedStatus);
console.log("Overdue check (should say completed):", task1.isOverdue());

task1.update({
    title: "Finish Final Odin Project",
    priority: "medium",
  });

  console.log("After update:", task1.getSummary());
  task1.update({ dueDate: "2025-05-10" }); // σωστή
  console.log("After DATE update:", task1.getSummary());

const pastTask = new Task("Old Task", "Expired", "2020-01-01", "low");
console.log(pastTask.isOverdue()); // πρέπει να λέει ότι έχει λήξει
