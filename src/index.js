import "./style.css";
import ProjectManager from "./modules/projectManager.js";
import Project from "./modules/project.js";
import Task from "./modules/task.js";
import Storage from "./modules/storage.js";
import UI from "./modules/ui.js";

//localStorage.removeItem("todo-list-data");
document.addEventListener("DOMContentLoaded", () => {
  let manager = Storage.load();

  // initial test data
  if (!manager) {
    manager = new ProjectManager();

    const testProject = new Project("Daily Routine");
    testProject.addTask(new Task("Wake up", "Open your eyes 😴", "2025-05-01", "low"));
    testProject.addTask(new Task("Go to the gym", "Leg day 💪", "2025-05-01", "high"));
    testProject.addTask(new Task("Study JavaScript", "Continue JavaScript course!", "2025-04-02", "medium"));
    manager.addProject(testProject);

    const uni = new Project("University Tasks");
    uni.addTask(new Task("Submit assignment", "Systems Analysis paper", "2025-05-03", "high"));
    uni.addTask(new Task("Read for networks", "Ch. 7 & 8", "2025-05-05", "medium"));
    uni.addTask(new Task("Group meeting", "Discuss project milestones", "2025-05-06", "low"));
    manager.addProject(uni);

    Storage.save(manager);
  }

  const ui = new UI(manager);
  ui.renderProjectList();
  ui.updateProjectTitle();
  ui.renderTaskList();
  ui.updateTaskStats();
  ui.updateOverallStats();
  ui.renderFilterControls();
  ui.setupEventListeners();

  window.addEventListener("beforeunload", () => {
    Storage.save(manager);
  });
});
