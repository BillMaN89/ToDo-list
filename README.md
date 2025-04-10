# ToDo-list

ToDo list is a practice project, derived from "The Odin Project" JavaScript Course.
It is created with Webpack, making use of the following libraries:

    1. date-fns
    2. localStorage

You can check it out through this Live [Demo](https://billman89.github.io/ToDo-list/).

Functionality

- You can add new Projects, and whithin each Project, you can add new Tasks.

- Projects: You can edit the title or delete them entirely. (Options accessible via the dropdown menu)

- Tasks: You can edit, mark as complete and delete them. (Options accessible via the dropdown menu)
    Every task has 4 properties:

    1. Title
    2. Description
    3. Due date.
    4. Priority, which is color-coded as follows:
        a. Green for low priority.
        b. Yellow for medium priorty.
        c. Light Red for high priority.
    If a Task is overdue, then a warning sign appears on the bottom of the task.

- Added Task counter for each Project and an Overall Stats Counter, to keep track of completed and overdue tasks across all projects.

- Added Filter buttons.
