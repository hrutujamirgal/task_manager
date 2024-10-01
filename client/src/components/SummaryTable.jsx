import { useEffect, useState } from 'react';
import { Table, notification } from 'antd';
import { useTasks } from '../context/TaskContext';

const SummaryTable = () => {
  const [summaryData, setSummaryData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const { summary } = useTasks();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await summary();
        setSummaryData(data.summary); 
      } catch (error) {
        notification.error({
          message: 'Error Fetching Summary',
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [summary]); 

  const columns = [
    {
      title: 'User',
      dataIndex: 'username', 
      key: 'username',
    },
    {
      title: 'Assigned Tasks',
      dataIndex: 'totalAssignedTasks',
      key: 'totalAssignedTasks',
    },
    {
      title: 'To-Do Tasks',
      dataIndex: 'toDoTasks',
      key: 'toDoTasks',
    },
    {
      title: 'In-Progress Tasks',
      dataIndex: 'inProgressTasks',
      key: 'inProgressTasks',
    },
    {
      title: 'Completed Tasks',
      dataIndex: 'completedTasks',
      key: 'completedTasks',
    },
    {
      title: 'High Priority Tasks',
      dataIndex: 'highPriorityTasks',
      key: 'highPriorityTasks',
    },
    {
      title: 'Medium Priority Tasks',
      dataIndex: 'mediumPriorityTasks',
      key: 'mediumPriorityTasks',
    },
    {
      title: 'Low Priority Tasks',
      dataIndex: 'lowPriorityTasks',
      key: 'lowPriorityTasks',
    },
  ];

  return (
    <div className='p-5'>
      <Table
        columns={columns}
        dataSource={summaryData} 
        loading={loading}
        pagination={false}
        rowKey="username" 
      />
    </div>
  );
};

export default SummaryTable;
