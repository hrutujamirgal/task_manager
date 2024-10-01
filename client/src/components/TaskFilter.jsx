/* eslint-disable react/prop-types */

import { Input, Select } from "antd";

const { Search } = Input;
const { Option } = Select;

const TaskFilter = ({
  onSearch,
  onStatusFilterChange,
  onPriorityFilterChange,
  onUserFilterChange,
  tasks,
}) => {
  return (
    <div className="flex justify-between mb-4">
      <Search
        placeholder="Search by title or description"
        onSearch={onSearch}
        className="w-2/5 mr-10"
      />

      <Select
        placeholder="Filter by status"
        onChange={onStatusFilterChange}
        className="w-1/3 mr-10"
      >
        <Option value="">All</Option>
        <Option value="To Do">To Do</Option>
        <Option value="In Progress">In Progress</Option>
        <Option value="Completed">Completed</Option>
      </Select>

      <Select
        placeholder="Filter by priority"
        onChange={onPriorityFilterChange}
        className="w-1/3 mr-10"
      >
        <Option value="">All</Option>
        <Option value="Low">Low</Option>
        <Option value="Medium">Medium</Option>
        <Option value="High">High</Option>
      </Select>

      <Select
        placeholder="Filter by assigned user"
        onChange={onUserFilterChange}
        className="w-1/3"
      >
        <Option value="">All</Option>
        {tasks.map((task) => (
          <Option key={task.assignedUser._id} value={task.assignedUser.username}>
            {task.assignedUser.username}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default TaskFilter;
