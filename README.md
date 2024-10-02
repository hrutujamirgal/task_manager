# Task Management Application

## Overview

The Task Management Application is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. It allows users to effectively manage tasks, providing functionalities for task creation, updates, assignment, and tracking.

## Features

1. **User Authentication**: 
   - Secure user registration, login, and logout.
   - JWT-based authentication with hashed passwords for enhanced security.

2. **Task Management**: 
   - Create, update, and delete tasks with fields for:
     - Title
     - Description
     - Due Date
     - Status (To Do, In Progress, Completed)
     - Assigned User
     - Priority (Low, Medium, High)
   - View tasks in a paginated list with search and filtering options based on status, priority, or assigned users.

3. **Task Assignment**:
   - Admin users can assign tasks to registered users.
   - Non-admin users can only view tasks assigned to them or tasks they created.

4. **Task Summary Report**:
   - Generate a summary report of tasks based on various filters (e.g., by status, user, or date), returned as JSON or CSV.

## Technical Stack

- **Backend**: Node.js with Express, MongoDB 
- **Frontend**: React.js 
- **API Requests**: fetch
- **State Management**: Context API 
- **Error Handling & Validation**: Joi 

### Deployment URL:
https://task-manager-lake-three.vercel.app/
