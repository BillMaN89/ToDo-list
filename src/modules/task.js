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
    const changes = [];
    const parsedDate = dueDate ? new Date(dueDate) : null;

    if (title && title !== this.title) {
        this.title = title;
        changes.push("title");
    }

    if (description && description !== this.description) {
        this.description = description;
        changes.push("description");
    }

    if (
        parsedDate &&
        !isNaN(parsedDate.getTime()) &&
        parsedDate.getTime() !== this.dueDate.getTime()
    ) {
        this.dueDate = parsedDate;
        changes.push("dueDate");
    }

    if (priority && priority !== this.priority) {
        this.priority = priority;
        changes.push("priority");
    }

    return changes.length > 0 ? changes : null;
    }

}

export default Task;