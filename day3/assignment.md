# Day 3: Todo Application Assignment

**Deadline:** October 23, 2025 at 11:00 AM

---

## Project Overview

Build a fully functional todo application using vanilla JavaScript, HTML, and CSS. This assignment tests your understanding of DOM manipulation, event handling, and asynchronous JavaScript.

---

## Core Requirements

### 1. **DOM Manipulation**

Create an interactive todo app with:

- An **input field** for entering new tasks
- A **list container** to display all tasks
- Each task must include:
  - A **checkbox** to mark completion
  - A **delete button** to remove tasks
  - Visual indication when marked complete (e.g., strikethrough text)

### 2. **Event Handling**

Implement event listeners for:

- Adding new tasks (button click or Enter key)
- Marking tasks as complete/incomplete (checkbox toggle)
- Deleting tasks (delete button click)

Example structure:

```html
<input id="taskInput" type="text" placeholder="Enter a new task" />
<button onclick="addTask()">Add Task</button>
<ul id="taskList"></ul>
```

### 3. **Async Operations** (Optional Bonus)

Fetch initial todos from the API and display them:

- **API Endpoint:** `https://dummyjson.com/todos`
- Use `fetch()` with async/await or promises
- Handle loading and error states gracefully

---

## Git Workflow Requirements

### Repository Setup

1. Create a public GitHub repository: `todo-application`
2. Initialize with a README.md

### Branch Strategy

Create and work with these branches:

**Main Branches:**

- `main` - Production-ready code
- `development` - Integration branch

**Feature Branches:**

- `feature/add-task` - Implement add/delete task functionality
- `feature/fetch-task` - API integration and data fetching
- `feature/style-task` - CSS styling and UI polish

### Workflow Steps

1. Create each feature branch from `development`
2. Add a `README.md` in each feature branch with the branch name as the title
3. Complete your feature work in the respective branch
4. Merge all feature branches → `development`
5. Finally merge `development` → `main`

**Tip:** Use pull requests for merging to practice professional Git workflow.

---

## Learning Resources

Complete videos 1-10 of [React JS Full Course by Codevolution](https://youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3&si=ZOTpbX8zSJNYpRaw)

These videos cover React basics that will prepare you for upcoming lessons.

---

## Expected Functionality

**Your app should:**

- ✅ Add new tasks dynamically without page refresh
- ✅ Toggle task completion with visual feedback
- ✅ Delete tasks from the list
- ✅ (Bonus) Load initial todos from API
- ✅ Maintain clean, readable code with proper indentation
- ✅ Follow the Git branching strategy exactly

**Bonus Points:**

- Persist tasks in localStorage
- Add task editing functionality
- Implement search/filter options
- Responsive mobile design

---

## Submission Checklist

- [] Repository is public and named `todo-application`
- [ ] All 5 branches created (main, development, 3 features)
- [ ] Each feature branch has a README.md
- [ ] All features merged to development, then to main
- [ ] Application works without console errors
- [ ] Code is well-commented
- [ ] Repository URL submitted on time

**Submit your GitHub repository link before the deadline.**

Good luck!
