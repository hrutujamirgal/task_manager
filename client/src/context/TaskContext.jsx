/* eslint-disable no-unused-vars */
import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./UserContext";
import { notification } from "antd";

const TaskContext = createContext();

// eslint-disable-next-line react/prop-types
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const task = import.meta.env.VITE_ROUTE;
  const route = `${task}/api/tasks`;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        let response;
        if (user.status === "Admin") {
          response = await fetch(`${route}/getTasks/${user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
        } else {
          response = await fetch(`${route}/getMyTasks/${user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
        }

        const data = await response.json();
        setTasks(data);
      } catch (e) {
        console.error("Error fetching tasks:", e);
        notification.error({
          message: "Task Fetch Error",
          description: "Failed to fetch tasks from the server.",
        });
      } finally {
        setLoading(false); 
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Add a new task
  const addTask = async (newTask) => {
    try {
      const response = await fetch(`${route}/addTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        const addedTask = await response.json();
        setTasks([...tasks, addedTask.task]);
        notification.success({
          message: "Task Added Successfully",
          description: "Your task has been added!",
        });
      } else {
        console.error("Error adding task");
        notification.error({
          message: "Error adding task",
          description: "Error adding task",
        });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      notification.error({
        message: "Error adding Task",
        description: "Error in adding Task!",
      });
    }
  };



const updateTask = async (updatedTask) => {
  try {
    const { _id, assigningDate, ...taskData } = updatedTask;

    console.log("task here", taskData); 
    const response = await fetch(`${route}/update/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      const updatedTaskResponse = await response.json();
      setTasks(
        tasks.map((task) =>
          task._id === updatedTaskResponse._id ? updatedTaskResponse : task
        )
      );

      notification.success({
        message: "Task Updated Successfully",
        description: "Your task has been updated!",
      });
    } else {
      console.error("Error updating task");
      notification.error({
        message: "Error updating task",
        description: "Error updating task",
      });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    notification.error({
      message: "Error updating task",
      description: "Error updating task",
    });
  }
};


  //get a task
  const getTask = async (id) => {
    try {
      const response = await fetch(`${route}/get/${id}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const taskData = await response.json();
      return taskData;
    } catch (error) {
      console.error("Error fetching task:", error);
      return null;
    }
  };

  //profile
  const profile = async (userId) => {
    try {
      const res = await fetch(`${route}/profile/${userId}`, {
        method: "GET",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching task:", error);
      return null;
    }
  };

  //profile
  const summary = async () => {
    try {
      const res = await fetch(`${route}/summary`, {
        method: "GET",
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching task:", error);
      return null;
    }
  };

  //report
  const report = async () => {
    try {
      const response = await fetch(`${route}/report`, { method: "GET" });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
      notification.error({
        message: "Error Downloading Report",
        description: error.message,
      });
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await fetch(`${route}/delete/${taskId}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
      notification.success({
        message: "Task Deleted Successfully",
        description: "Your task has been deleted!",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      notification.error({
        message: "Error deleting task",
        description: "Your task has been added!",
      });
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTask,
        profile,
        summary,
        report,
        loading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
