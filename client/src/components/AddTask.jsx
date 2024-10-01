import { useState, useEffect } from "react";
import { Form, Input, Button, Radio, Select, DatePicker, notification } from "antd";
import { useAuth } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";

const { TextArea } = Input;
const { Option } = Select;

const AddTask = () => {
  const [detail, setDetail] = useState({
    title: "",
    description: "",
    dueDate: null,
    assignedUser: "",
    assigningUser: "",
    status: "To Do",
    priority: "Low",
  });

  const navi = useNavigate();
  const { user, all, allUser } = useAuth();
  const { addTask } = useTasks();

  useEffect(()=>{
    const fetch = async()=>{
        if(user && user.status === 'Admin'){
            await allUser();
        }
    }
    fetch()
  }, [user, allUser])

  const handleChange = (event) => {
    const { name, value } = event.target || event;

    setDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setDetail({
      ...detail,
      dueDate: date,
    });
  };

  const handleUserAssignment = () => {
    if (user) {
      if (user.status === "Admin") {
        setDetail((prevDetail) => ({
          ...prevDetail,
          assigningUser: user.id,
          assignedUser: prevDetail.assignedUser, 
        }));
      } else {
        setDetail((prevDetail) => ({
          ...prevDetail,
          assignedUser: user.id,
          assigningUser: user.id, 
        }));
      }
    }
  };

  

  const handleSubmit = async () => {
    if (new Date(detail.dueDate) < new Date()) {
      notification.error({
        message: "Due Date Error",
        description: "Due date cannot be in the past!",
      });
      return;
    }


    await addTask(detail);
    
    setDetail({
      title: "",
      description: "",
      dueDate: null,
      assignedUser: "",
      assigningUser: "",
      status: "To Do",
      priority: "Low",
    });
    navi("/tasks");
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }} className="font-serif text-xl">
        Add Task
      </h1>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <Input name="title" value={detail.title} onChange={handleChange} />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input your description!" }]}
        >
          <TextArea
            name="description"
            value={detail.description}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item label="Due Date" name="due_date">
          <DatePicker
            value={detail.dueDate}
            onChange={handleDateChange}
            style={{ width: "100%" }}
            required
          />
        </Form.Item>
        {(user && user.status === "Admin") ? (
          <Form.Item
            label="Assigned User"
            name="assignedUser"
            rules={[{ required: true, message: "Please select the assigned user!" }]}
          >
            <Select
              name="assignedUser"
              value={detail.assignedUser}
              onChange={(value) => {
                handleChange({ target: { name: "assignedUser", value } });
                handleUserAssignment(); 
              }}
            >
              {all.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ):(
          <Form.Item
            label="Assigned User"
            name="assignedUser"
            rules={[{ required: true, message: "Please select the assigned user!" }]}
          >
            <Select
              name="assignedUser"
              value={user.name}
              onChange={(value) => {
                handleChange({ target: { name: "assignedUser", value } });
                handleUserAssignment(); 
              }}
            >
                <Option key={user.id} value={user.id}>
                  {user.name}
                </Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item label="Status">
          <Radio.Group name="status" value={detail.status} onChange={handleChange}>
            <Radio value="To Do">To Do</Radio>
            <Radio value="In Progress">In Progress</Radio>
            <Radio value="Completed">Completed</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Priority">
          <Radio.Group name="priority" value={detail.priority} onChange={handleChange}>
            <Radio value="Low">Low</Radio>
            <Radio value="Medium">Medium</Radio>
            <Radio value="High">High</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Task
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTask;
