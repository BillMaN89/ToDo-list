import ProjectManager from "./modules/projectManager.js";
import Project from "./modules/project.js";
import Storage from "./modules/storage.js";
import Task from "./modules/task.js";
import UI from "./modules/ui.js";



// 1. Φόρτωση δεδομένων από localStorage ή νέο manager
const manager = Storage.load() || new ProjectManager();


// 2. Δημιουργία instance του UI
const ui = new UI(manager);

// 3. Αρχικό rendering
ui.renderProjectList();
ui.renderTaskList();
ui.updateProjectTitle();

// 4. Σύνδεση events
ui.setupEventListeners();

// 5. Προαιρετικά: save ώστε να αποθηκεύονται τα δεδομένα όταν αλλάζουν
window.addEventListener("beforeunload", () => {
  Storage.save(manager);
});


if (manager.projects.length === 0) {
  const testProject = new Project("Daily Routine");

  const task1 = new Task("Wake up", "Open your eyes 😴", "2025-04-01", "low");
  const task2 = new Task("Go to the gym", "Leg day 💪", "2025-04-01", "high");
  const task3 = new Task("Study JavaScript", "Continue UI logic!", "2025-04-02", "medium");

  testProject.addTask(task1);
  testProject.addTask(task2);
  testProject.addTask(task3);

  manager.addProject(testProject);

  const uni = new Project("University Tasks");
  uni.addTask(new Task("Submit assignment", "Systems Analysis paper", "2025-04-03", "high"));
  uni.addTask(new Task("Read for networks", "Ch. 7 & 8", "2025-04-05", "medium"));
  uni.addTask(new Task("Group meeting", "Discuss project milestones", "2025-04-06", "low"));
  manager.addProject(uni);
}
