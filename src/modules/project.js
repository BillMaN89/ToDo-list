import Task from "./task.js";

class Project {
    constructor(name) {
        this.name = name === "" ? "Untitled Project" : name;
        this.tasks = [];
    }

    addTask(task){
        if (task instanceof Task){
            this.tasks.push(task);
            return `Task ${task.title} added successfully!`
        }else {
            console.warn("Not a valid Task object");
            return "Invalid Task, please try again";
        }
    }

    get tasksList(){
        return this.tasks;
    }
}

export default Project;