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

    }

    renderProjectList(projectManager) {
        this.projectListElement.textContent = "";

        this.manager.projects.forEach((project, index) => {
            const listItem = document.createElement("li");
            const wrapper = document.createElement("div");
            wrapper.classList.add("project-entry");

            const titleSpan = document.createElement("span");
            titleSpan.textContent = project.name;

            listItem.addEventListener("click", () => {
                this.manager.setCurrentProject(index);
                this.renderTaskList();
                this.updateProjectTitle();
            })

            const dltBtn = document.createElement("button");
            dltBtn.classList.add("icon-btn");
            dltBtn.innerHTML = '<i class="fas fa-trash" title="Delete Project"></i>';
            dltBtn.addEventListener("click", () => {
                this.manager.removeProject(index);
                this.renderProjectList();
                this.renderTaskList();
                this.updateProjectTitle();
            });

            wrapper.appendChild(titleSpan);
            wrapper.appendChild(dltBtn);
            listItem.appendChild(wrapper);
            this.projectListElement.appendChild(listItem);
        });
    }

    renderTaskList() {
        this.taskListElement.innerHTML = "";
        const current = this.manager.getCurrentProject();
        if (!current) {
            this.taskListElement.innerHTML = "No current project!";
            return false;
        };

        current.tasks.forEach((task, index) => {
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

            //drop-down list
            const dropdown = this.createTaskDropdown(index, task);

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
            Storage.save(this.manager);
        });

        //Delete
        const dltOption = document.createElement("li");
        dltOption.innerHTML = '<i class="fas fa-trash" title="Delete Task"></i> Delete';
        dltOption.addEventListener("click", () => {
            const current = this.manager.getCurrentProject();
            current.removeTask(index);
            this.renderTaskList();
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
    
            const newProject = new Project(title);
            this.manager.addProject(newProject);
    
            if (setCurrent){
                const index = this.manager.projects.length - 1;
                this.manager.setCurrentProject(index);
            };
    
            this.renderProjectList();
            this.updateProjectTitle();
            this.renderTaskList();
            Storage.save(this.manager);
    
            this.projectForm.reset();
            this.projectModal.classList.add("hidden");
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

            if(this.editingTaskIndex !== null) {
                const task = current.tasks[this.editingTaskIndex];
                task.update({ title, description, dueDate, priority });

                this.editingTaskIndex = null;
            } else {
                const newTask = new Task(title, description, dueDate, priority);
                current.addTask(newTask);
            };

            this.renderTaskList();
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
}

export default UI;