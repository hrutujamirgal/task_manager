import { Table, Button, Spin, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/UserContext";
import { useState } from "react";
import TaskFilter from "./TaskFilter";

const DataTable = () => {
  const { tasks, deleteTask, loading } = useTasks(); 
  const { user } = useAuth();
  const navi = useNavigate();

  
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  const filteredTasks = tasks
    .filter((task) => {
      if (!searchText) return true;
      return (
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description.toLowerCase().includes(searchText.toLowerCase())
      );
    })
    .filter((task) => {
      if (!statusFilter) return true;
      return task.status === statusFilter;
    })
    .filter((task) => {
      if (!priorityFilter) return true;
      return task.priority === priorityFilter;
    })
    .filter((task) => {
      if (!userFilter) return true;
      return task.assignedUser.username === userFilter;
    });

  

  const handleAssign = () => {
    navi("/add");
  };

  const handleUpdate = (taskId) => {
    navi(`/update/${taskId}`);
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handlePriorityFilterChange = (value) => {
    setPriorityFilter(value);
  };

  const handleUserFilterChange = (value) => {
    setUserFilter(value);
  };

  

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB");

  const commonColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: formatDate,
    },
    {
      title: "Assigned Date",
      dataIndex: "assigningDate",
      key: "assigningDate",
      render: formatDate,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },
  ];

  const userSpecificColumns =
    user && user.status === "NotAdmin"
      ? [
          {
            title: "Assigning By",
            dataIndex: "assigningUser",
            key: "assigningUser",
            render: (assigningUser) => assigningUser.username,
          },
        ]
      : [
          {
            title: "Assigned User",
            dataIndex: "assignedUser",
            key: "assignedUser",
            render: (assignedUser) => assignedUser.username,
          },
        ];

  const actionsColumn = {
    title: "Actions",
    key: "actions",
    render: (text, record) => (
      <>
        {record.assigningUser._id !== user.id && (
          <Button onClick={() => handleUpdate(record._id)} type="link">
            Update 
          </Button>
        )}
        {record.assigningUser._id === user.id && (
          <>
            <Button onClick={() => handleUpdate(record._id)} type="link">
              Update
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this task?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        )}
      </>
    ),
  };

  const columns = [...userSpecificColumns, ...commonColumns, actionsColumn];

  return (
    <div className="m-10">
      <div className="flex justify-between my-5">
        <p className="text-2xl font-bold font-serif">Task Manager</p>
        <Button
          type="primary"
          shape="round"
          className="ml-10"
          size="large"
          onClick={handleAssign}
        >
          Assign Task
        </Button>
      </div>

      <TaskFilter
        onSearch={handleSearch}
        onStatusFilterChange={handleStatusFilterChange}
        onPriorityFilterChange={handlePriorityFilterChange}
        onUserFilterChange={handleUserFilterChange}
        tasks={tasks}
      />

{loading ? ( 
        <Spin tip="Loading" size="large" className="m-10" />
      ) : (
        <div className="w-100 m-10 border border-veryLightBlue rounded-md">
          <Table columns={columns} dataSource={filteredTasks} rowKey="_id" />
        </div>
      )}
    </div>
  );
};

export default DataTable;
