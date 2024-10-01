import { Button, notification } from 'antd';
import { useTasks } from '../context/TaskContext';

const Download = () => {

  const {report} = useTasks();

  const handleDownload = async () => {
    try {
      const blob = await report()
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks_report.csv'); 
      document.body.appendChild(link);
      link.click(); 
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      notification.error({
        message: 'Error Downloading Report',
        description: error.message,
      });
    }
  };

  return (
    <Button type="primary" onClick={handleDownload}>
      Download and View Tasks Report
    </Button>
  );
};

export default Download;
