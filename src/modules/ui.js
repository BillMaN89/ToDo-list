import Task from "./task.js";
import Project from "./project.js";
import ProjectManager from "./projectManager.js";
import Storage from "./storage.js";
import { format } from "date-fns";

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

        // task modal
        this.taskModal = document.querySelector("#task-modal");
        this.taskForm = document.querySelector("#task-form");
        this.taskTitleInput = document.querySelector("#task-title");
        this.taskDescInput = document.querySelector("#task-desc");
        this.taskDateInput = document.querySelector("#task-date");
        this.taskPrioritySelect = document.querySelector("#task-priority");
        this.taskCancelBtn = document.querySelector("#cancel-task");
        this.taskAddBtn = document.querySelector("#add-task-btn");

    }

    renderProjectList(projectManager) {
        this.projectListElement.textContent = "";

        this.manager.projects.forEach((project, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = project.name;

            listItem.addEventListener("click", () => {
                this.manager.setCurrentProject(index);
                this.renderTaskList();
                this.updateProjectTitle();
            })

            const dltBtn = document.createElement("button");
            dltBtn.innerHTML = '<i class="fas fa-trash" title="Delete Project"></i>';
            dltBtn.addEventListener("click", () => {
                this.manager.removeProject(index);
                this.renderProjectList();
                this.renderTaskList();
                this.updateProjectTitle();
            });

            listItem.appendChild(dltBtn);
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
            const title = document.createElement("span");
            title.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> ${task.title}`;
            const description = document.createElement("span");
            description.innerHTML = ` | <i class="fa-solid fa-clipboard"></i> ${task.description}`
            const dueDate = document.createElement("span");
            const formattedDate = format(new Date(task.dueDate), "dd/MM/yyyy");
            dueDate.innerHTML = ` | <i class="fa-solid fa-calendar-days"></i>  ${formattedDate}`;
            const priority = document.createElement("span");
            priority.innerHTML = ` | <i class="fa-solid fa-traffic-light"></i>  ${task.priority} `;
            const completed = document.createElement("span");
            completed.textContent = task.completed;

            if (task.completed) listItem.classList.add("completed");

            if (task.priority === "high"){
                listItem.classList.add("high");
            } 
            else if (task.priority === "medium"){
                listItem.classList.add("medium");
            } else {
                listItem.classList.add("low");
            };

            const completeBtn = document.createElement("button");
            completeBtn.innerHTML = task.completed ? "✅ Completed" : "Mark ✅";
            completeBtn.title = "Mark as Complete";
            const dltBtn = document.createElement("button");
            dltBtn.innerHTML = '<i class="fa-solid fa-xmark" title="Delete Task"></i>';

            completeBtn.addEventListener("click", () => {
                task.toggleComplete();
                this.renderTaskList();
            });

            dltBtn.addEventListener("click", () => {
                current.removeTask(index);
                this.renderTaskList();
            })
           
            listItem.appendChild(title);
            listItem.appendChild(description);
            listItem.appendChild(dueDate);
            listItem.appendChild(priority);
            listItem.appendChild(completeBtn);
            listItem.appendChild(dltBtn);
            this.taskListElement.appendChild(listItem);
        })
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

            const newTask = new Task(title, description, dueDate, priority);
            current.addTask(newTask);

            this.renderTaskList();
            Storage.save(this.manager);

            this.taskForm.reset();
            this.taskModal.classList.add("hidden");
        });

        this.taskCancelBtn.addEventListener("click", () =>{
            this.taskForm.reset();
            this.taskModal.classList.add("hidden");
        });
    }
}

export default UI;