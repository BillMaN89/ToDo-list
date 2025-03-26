import { differenceInDays, isToday, isPast } from "date-fns";

class Task {
    constructor(title, description, dueDate, priority, completed = false) {
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
        this.completed = Boolean(completed);
    }

    toggleComplete(){
        this.completed = !this.completed;
    }

    get completedStatus() {
        return this.completed ? "Yes" : "No";
    }

    getSummary() {
        return `Task -> ${this.title}, "${this.description}", it is Due on: ${this.dueDate}`;
    }

    isOverdue() {
        if (this.completed){
            return "This task is completed";
        }
        if (isToday(this.dueDate)){
            return `${this.title} ends today!`;
        }
        else if (isPast(this.dueDate)){
            return `${this.title} is past its due Date!!`;
        }
        else {
            const daysLeft = differenceInDays(this.dueDate, new Date());
            return `${this.title} ends in ${daysLeft} days!`
        }
    }

    update({ title, description, dueDate, priority }) {
        const parsedDate = new Date(dueDate);

        if ((title !== undefined) && (title !== "")){
            this.title = title;
            console.log("Task title successfully updated!");
        }
        if ((description !== undefined) && (description !== "")){
            this.description = description;
            console.log("Task description successfully updated!");
        }
        if (!isNaN(parsedDate.getTime())) {
            this.dueDate = parsedDate;
            console.log("Due date successfully updated!");
          }
          
        if ((priority !== undefined) && (priority !== "")){
            this.priority = priority;
            console.log("Priority successfully updated!")
        }
    }
}

export default Task;