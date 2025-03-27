import Project from "./project.js";

class ProjectManager {
    constructor(){
        this.projects = [];
        this.currentProject = null;
    }

    addProject(project) {
        if (project instanceof Project) {
          this.projects.push(project);
          if (this.projects.length === 1) {
            this.currentProject = 0;
          }
            console.log(`Project "${project.name}" added!`);
            return true;
        } else {
            console.log("Invalid information, could not add project.");
          return false;
        }
    }
      

    removeProject(index){
        if ((index >= 0) && (index < this.projects.length)) {
            this.projects.splice(index, 1);

            if (this.projects.length === 0) {
                this.currentProject = null;
            } else if (this.currentProject === index) {
                this.currentProject = index > 0 ? index - 1 : 0;
            }
            console.log("Project removed successfully!")
            return true;
        } else {
            console.log("Invalid index, no project has been removed!")
            return false;
        }
    }

    setCurrentProject(index) {
        if ((index >= 0) && (index < this.projects.length)){
            this.currentProject = index;
            console.log(`Current project set to: "${this.projects[index].name}".`)
            return true;
        } else {
            console.log("Project does not exist.");
            return false;
        }
    }

    getCurrentProject(){
        if (this.currentProject === null){
            console.log("No project selected!")
            return null;
        } else {
            return this.projects[this.currentProject];
        }
    }

}

export default ProjectManager;