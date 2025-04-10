import Task from "./task.js";
import Project from "./project.js";
import ProjectManager from "./projectManager.js";
import Storage from "./storage.js";
import { format, isBefore, startOfToday } from "date-fns";

class UI{
    constructor(manager) {
        this.manager = manager;
        this.projectListElement = document.querySelector("#project-list");
        this.taskListElement = document.querySelector("#task-list");
        this.projectTitleElement = document.querySelector("#project-title");

        this.taskCounter = document.querySelector("#task-stats");
        this.overallStats = document.querySelector("#overall-stats");

        this.filterControls = document.querySelector("#filter-controls");
        this.themeToggle = document.querySelector("#theme-toggle");
        this.currentFilter = "all";

        //project modal
        this.projectModal = document.querySelector("#project-modal");
        this.projectForm = document.querySelector("#project-form");
        this.projectTitleInput = document.querySelector("#project-name-input");
        this.projectCurrentCheckbox = document.querySelector("#make-current");
        this.projectCancelBtn = document.querySelector("#cancel-project");
        this.projectAddBtn = document.querySelector("#add-project-btn");
        this.projectSubmit = document.querySelector("#submit-project");

        // task modal
        this.taskModal = document.querySelector("#task-modal");
        this.taskForm = document.querySelector("#task-form");
        this.taskTitleInput = document.querySelector("#task-title");
        this.taskDescInput = document.querySelector("#task-desc");
        this.taskDateInput = document.querySelector("#task-date");
        this.taskPrioritySelect = document.querySelector("#task-priority");
        this.taskCancelBtn = document.querySelector("#cancel-task");
        this.taskAddBtn = document.querySelector("#add-task-btn");
        this.taskSubmitBtn = document.querySelector("#submit-task");

        this.editingTaskIndex = null;
        this.editingProjectIndex = null;

    }

    renderProjectList(projectManager) {
        this.projectListElement.textContent = "";

        this.manager.projects.forEach((project, index) => {
            const listItem = document.createElement("li");
            const wrapper = document.createElement("div");
            wrapper.classList.add("project-entry");

            const titleSpan = document.createElement("span");
            titleSpan.textContent = project.name;

            titleSpan.addEventListener("click", () => {
                this.manager.setCurrentProject(index);

                this.currentFilter = "all";
                this.renderFilterControls();
                
                this.renderTaskList();
                this.updateProjectTitle();
                this.updateTaskStats();
                this.updateOverallStats();
            })

            //menu button
            const menuBtn = document.createElement("button");
            menuBtn.classList.add("menu-btn");
            menuBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>';

            const dropdown = this.createProjectDropdown(index, project);

            menuBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
                    if (menu !== dropdown) {
                        menu.classList.remove("show");
                    }
                });
                dropdown.classList.toggle("show");
            });

            wrapper.appendChild(titleSpan);
            wrapper.appendChild(menuBtn);
            wrapper.appendChild(dropdown);
            listItem.appendChild(wrapper);
            this.projectListElement.appendChild(listItem);
        });
    }

    createProjectDropdown(index, project) {
        const dropdown = document.createElement("ul");
        dropdown.classList.add("dropdown-menu");

        //Edit
        const editOption = document.createElement("li");
        editOption.innerHTML = `<i class="fas fa-edit" title="Edit Project"></i> Edit`;
        editOption.addEventListener("click", () => {
            this.editingProjectIndex = index;
            this.projectTitleInput.value = project.name;
            this.projectSubmit.textContent = "Update Project";
            this.projectModal.classList.remove("hidden");
        });

        //Delete
        const dltOption = document.createElement("li");
        dltOption.innerHTML = '<i class="fas fa-trash" title="Delete Project"></i> Delete';
        dltOption.addEventListener("click", () => {
            this.manager.removeProject(index);
            this.renderProjectList();
            this.renderTaskList();
            this.updateOverallStats();
            this.updateProjectTitle();
        });

        dropdown.appendChild(editOption);
        dropdown.appendChild(dltOption);

        return dropdown;
    }

    renderTaskList() {
        this.taskListElement.innerHTML = "";
        const current = this.manager.getCurrentProject();
        if (!current) {
            this.taskListElement.innerHTML = "No current project!";
            return false;
        };

        let tasks = current.tasks;
        let filteredTasks = tasks;

        switch (this.currentFilter) {
            case "completed":
                filteredTasks = tasks.filter(task => task.completed);
                break;
            case "open":
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case "overdue":
                filteredTasks = tasks.filter(task => {
                    const due = new Date(task.dueDate);
                    return !task.completed && !isNaN(due) && isBefore(due, startOfToday());
                });
                break;                  
            case "all":
                default:
                filteredTasks = tasks;
                break;
        }

        filteredTasks.forEach((task, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("task-item");
            const title = document.createElement("span");
            title.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> ${task.title}`;
            const description = document.createElement("span");
            description.innerHTML = ` | <i class="fa-solid fa-clipboard"></i> ${task.description}`
            const dueDate = document.createElement("span");
            const formattedDate = format(new Date(task.dueDate), "dd/MM/yyyy");
            dueDate.innerHTML = ` | <i class="fa-solid fa-calendar-days"></i>  ${formattedDate}`;
            const priority = document.createElement("span");
            priority.innerHTML = ` | <i class="fa-solid fa-traffic-light"></i>  ${task.priority} `;
            const overdue = document.createElement("span");
            overdue.classList.add("overdue-msg");
            const completed = document.createElement("span");
            completed.textContent = task.completed;
            
            if (!task.completed && isBefore(new Date(task.dueDate), startOfToday())) {
                listItem.classList.add("overdue");
                overdue.innerHTML = `  <i class="fas fa-exclamation-triangle"></i> Task Overdue <i class="fas fa-exclamation-triangle"></i>`;
            }
              
            if (task.completed) listItem.classList.add("completed");

            if (task.priority === "high"){
                listItem.classList.add("high");
            } 
            else if (task.priority === "medium"){
                listItem.classList.add("medium");
            } else {
                listItem.classList.add("low");
            };

            //drop-down list
            const dropdown = this.createTaskDropdown(index, task);

            //menu button
            const menuBtn = document.createElement("button");
            menuBtn.classList.add("menu-btn");
            menuBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>';

            menuBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
                    if (menu !==dropdown) {
                        menu.classList.remove("show");
                    }
                });

                dropdown.classList.toggle("show");
            });

            const btnContainer = document.createElement("div");
            btnContainer.classList.add("task-buttons");
            btnContainer.appendChild(overdue);
            btnContainer.appendChild(menuBtn);
            btnContainer.appendChild(dropdown);
            
            listItem.appendChild(title);
            listItem.appendChild(description);
            listItem.appendChild(dueDate);
            listItem.appendChild(priority);
            listItem.appendChild(btnContainer);
            this.taskListElement.appendChild(listItem);
        });
    }

    createTaskDropdown(index, task) {
        const dropdown = document.createElement("ul");
        dropdown.classList.add("dropdown-menu");

        //Edit
        const editOption = document.createElement("li");
        editOption.innerHTML = `<i class="fas fa-edit"></i> Edit`;
        editOption.addEventListener("click", () => {
            this.editingTaskIndex = index;

            this.taskTitleInput.value = task.title;
            this.taskDescInput.value = task.description;
            this.taskDateInput.value = format(task.dueDate, "yyyy-MM-dd");
            this.taskPrioritySelect.value = task.priority;

            this.taskSubmitBtn.textContent = "Update Task";
            this.taskModal.classList.remove("hidden");
        });

        //Complete toggle
        const completeOption = document.createElement("li");
        completeOption.innerHTML = task.completed
            ? '<i class="fas fa-undo"></i> Undo Complete'
            : '<i class="fas fa-check"></i> Mark Complete';
        completeOption.addEventListener("click", () => {
            task.toggleComplete();
            this.renderTaskList();
            this.updateTaskStats();
            this.updateOverallStats();
            Storage.save(this.manager);
        });

        //Delete
        const dltOption = document.createElement("li");
        dltOption.innerHTML = '<i class="fas fa-trash" title="Delete Task"></i> Delete';
        dltOption.addEventListener("click", () => {
            const current = this.manager.getCurrentProject();
            current.removeTask(index);
            this.renderTaskList();
            this.updateTaskStats();
            this.updateOverallStats();
            Storage.save(this.manager);
        });

        dropdown.appendChild(editOption);
        dropdown.appendChild(completeOption);
        dropdown.appendChild(dltOption);

        return dropdown;
    }

    updateProjectTitle() {
        const current = this.manager.getCurrentProject();
        if (!current){
            this.projectTitleElement.textContent = "Select a Project";
        } else {
            this.projectTitleElement.textContent = current.name;
        }
    }

    setupEventListeners() {
        //global click listener
        document.addEventListener("click", () => {
            document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
                menu.classList.remove("show");
            });
        });
        
        //Add Project
        this.projectAddBtn.addEventListener("click", () => {
            this.projectModal.classList.remove("hidden");
        });

        this.projectForm.addEventListener("submit", (e) => {
            e.preventDefault();
        
            const title = this.projectTitleInput.value.trim();
            const setCurrent = this.projectCurrentCheckbox.checked;
        
            let project;
        
            if (this.editingProjectIndex !== null) {
                const existingProject = this.manager.projects[this.editingProjectIndex];
            
                if (existingProject) {
                    existingProject.updateProjectTitle({ name: title });
                    project = existingProject;
                } else {
                    console.warn("Editing project does not exist anymore.");
                    project = new Project(title);
                    this.manager.addProject(project);
                }
            
                this.editingProjectIndex = null;
            } else {
                project = new Project(title);
                this.manager.addProject(project);
            }
            
        
            let index = null;

            if (setCurrent) {
                index = this.editingProjectIndex !== null
                    ? this.editingProjectIndex
                    : this.manager.projects.length - 1;

                if (index !== -1) {
                    this.manager.setCurrentProject(index);
                }
            }

            this.editingProjectIndex = null; // Bonus cleanup

            this.renderProjectList();
            this.updateProjectTitle();
            this.renderTaskList();
            this.updateOverallStats();
            Storage.save(this.manager);
        
            this.projectForm.reset();
            this.projectModal.classList.add("hidden");
            this.projectSubmit.textContent = "Add Project";
        });
        

        this.projectCancelBtn.addEventListener("click", () => {
            this.projectForm.reset();
            this.projectModal.classList.add("hidden");
        });

        //Add Task
        this.taskAddBtn.addEventListener("click", () => {
            const current = this.manager.getCurrentProject();

            if (!current) {
                alert("There is no active project!");
                return;
            }

            this.taskModal.classList.remove("hidden");
        });

        this.taskForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const current = this.manager.getCurrentProject();
            if (!current) return; //safety check

            const title = this.taskTitleInput.value.trim();
            const description = this.taskDescInput.value;
            const dueDate = this.taskDateInput.value;
            const priority = this.taskPrioritySelect.value;

            if (Number.isInteger(this.editingTaskIndex)) {
                const task = current.tasks[this.editingTaskIndex];
                task.update({ title, description, dueDate, priority });
                this.editingTaskIndex = null;
            } else {
                const newTask = new Task(title, description, dueDate, priority);
                current.addTask(newTask);
            }

            this.renderTaskList();
            this.updateTaskStats();
            this.updateOverallStats();
            Storage.save(this.manager);

            this.taskForm.reset();
            this.taskModal.classList.add("hidden");
            this.taskSubmitBtn.textContent = "Add Task";

        });

        this.taskCancelBtn.addEventListener("click", () =>{
            this.taskForm.reset();
            this.taskModal.classList.add("hidden");
            this.editingTaskIndex = null;
            this.taskSubmitBtn.textContent = "Add Task";

        });
    }

    updateTaskStats() {
        const current = this.manager.getCurrentProject();
    
        if (!this.taskCounter) return;
    
        if (!current) {
            console.warn("No project selected!");
            this.taskCounter.innerHTML = `<i class="fas fa-exclamation-triangle"></i> No project selected <i class="fas fa-exclamation-triangle"></i>`;
            return false;
        }
    
        const total = current.tasks.length;
        if (total === 0) {
            this.taskCounter.textContent = `No tasks in this project yet :(`;
            return;
        }
        
        const completed = current.getCompletedTasks().length;
        this.taskCounter.innerHTML = `<i class="fa-sharp fa-solid fa-check"></i> ${completed} / ${total} Tasks Completed!`;
    }

    updateOverallStats() {
        if (!this.overallStats) return;

        const allProjects = this.manager.projects;
        let total = 0;
        let completed = 0;
        let overdue = 0;

        allProjects.forEach(project => {
            total += project.tasks.length;
            completed += project.getCompletedTasks().length;

            project.tasks.forEach((task) => {
                if ((!task.completed) && isBefore(new Date(task.dueDate), startOfToday())) {
                    overdue++;
                }
            });

            this.overallStats.innerHTML = `
            <span><i class="fa-solid fa-list"></i> ${total} Total Tasks </span> 
            <span><i class="fa-sharp fa-solid fa-check"></i> ${completed} Completed </span> 
            <span><i class="fas fa-exclamation-triangle"></i> ${overdue} Overdue </span>`;
        })
    }

    renderFilterControls() {
        this.filterControls.textContent = "";
        const filters = ["all", "completed", "open", "overdue"];

        filters.forEach((filter) => {
            const btn = document.createElement("button");
            btn.textContent = filter.charAt(0).toLocaleUpperCase() + filter.slice(1);
            btn.setAttribute("data-filter", filter);

            if (this.currentFilter === filter) {
                btn.classList.add("active-filter");
            };

            btn.addEventListener("click", () => {
                this.currentFilter = filter;
                this.renderTaskList();
                this.updateTaskStats();
                this.renderFilterControls();
            });

            this.filterControls.appendChild(btn);
        });
    }
    
}

export default UI;