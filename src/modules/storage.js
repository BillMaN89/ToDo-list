import ProjectManager from "./projectManager.js";
import Project from "./project.js";
import Task from "./task.js";

const Storage = (() => {
  const STORAGE_KEY = "todo-list-data";

  function save(manager) {
    if (!manager || !manager.projects) return false;

    const data = {
      projects: manager.projects,
      currentProject: manager.currentProject,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  }

  function load() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return null;
  
    const parsedData = JSON.parse(storedData);
    const manager = new ProjectManager();
  
    parsedData.projects.forEach(projectData => {
      const newProject = new Project(projectData.name);
  
      projectData.tasks.forEach(taskData => {
        const newTask = new Task(
          taskData.title,
          taskData.description,
          taskData.dueDate,
          taskData.priority,
          taskData.completed
        );
        newProject.addTask(newTask);
      });
  
      manager.addProject(newProject);
    });
  
    manager.setCurrentProject(parsedData.currentProject);
    return manager;
  }
  

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return { save, load, clear };
})();

export default Storage;
