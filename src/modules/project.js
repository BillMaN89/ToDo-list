import Task from "./task.js";

class Project {
    constructor(name) {
        this.name = name === "" ? "Untitled Project" : name;
        this.tasks = [];
    }

    addTask(task){
        if (task instanceof Task){
            this.tasks.push(task);
            console.log(`Task ${task.title} added successfully!`);
            return true;
        }else {
            console.warn("Not a valid Task object");
            return false;
        }
    }

    get tasksList(){
        return this.tasks;
    }

    removeTask(index){
        if ((index >= 0) && (index < this.tasks.length)){
            this.tasks.splice(index,1);
            console.log("Task removed successfully!")
            return true;
        }else {
            console.warn("Task not found on this index");
            return false;
        }
    }

    getCompletedTasks() {
        return this.tasks.filter((task) => task.completed);
    }

    getPendingTasks() {
        return this.tasks.filter((task) => !task.completed);
    }

    clearCompletedTasks() {
        const completedCount = this.tasks.filter(task => task.completed).length;
      
        if (completedCount > 0) {
          this.tasks = this.tasks.filter(task => !task.completed);
        }
      
        return completedCount;
      }
      
}

export default Project;