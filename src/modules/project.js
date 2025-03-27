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

    removeTask(index){
        if ((index >= 0) && (index < this.tasks.length)){
            this.tasks.splice(index,1);
            return "Task removed successfully!";
        }else {
            console.warn("Task not found on this index");
            return "Invalid index, task not removed!";
        }
    }

    getCompletedTasks() {
        return this.tasks.filter((task) => task.completed);
    }

    getPendingTasks() {
        return this.tasks.filter((task) => !task.completed);
    }

    clearCompletedTasks() {
        this.tasks = this.tasks.filter((task) => !task.completed);
        return "Completed Tasks removed!"
    }
}

export default Project;