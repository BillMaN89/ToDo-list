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
            title.textContent = `📝 ${task.title}`;
            const dueDate = document.createElement("span");
            const formattedDate = format(new Date(task.dueDate), "dd/MM/yyyy");
            dueDate.textContent = ` | 📅 ${formattedDate}`;
            const priority = document.createElement("span");
            priority.textContent = ` | 🚦 ${task.priority} `;
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
            dltBtn.innerHTML = '<i class="fa-solid fa-xmark" title="Delete Project"></i>';

            completeBtn.addEventListener("click", () => {
                task.toggleComplete();
                this.renderTaskList();
            });

            dltBtn.addEventListener("click", () => {
                current.removeTask(index);
                this.renderTaskList();
            })
           
            listItem.appendChild(title);
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

    }
}

export default UI;