import { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Spin, notification } from "antd";
import { useParams } from "react-router-dom";
import { useTasks } from "../context/TaskContext";

const { Title, Text } = Typography;

const Profile = () => {
  const { userId } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const {profile} = useTasks()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await profile(userId);
        setSummary(data.summary); 
        setLoading(false);
      } catch (error) {
        notification.error({
          message: "Error Fetching Profile Data",
          description: error.message,
        });
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>User Profile</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Task Summary" bordered>
            <Text strong>Total Assigned Tasks: </Text>
            <Text>{summary.totalAssignedTasks}</Text>
            <br />
            <Text strong>Total Assigned Tasks By Me: </Text>
            <Text>{summary.totalAssignedTasksByUser}</Text>
            <br />
            <Text strong>To Do Tasks: </Text>
            <Text>{summary.toDoTasks}</Text>
            <br />
            <Text strong>In Progress Tasks: </Text>
            <Text>{summary.inProgressTasks}</Text>
            <br />
            <Text strong>Completed Tasks: </Text>
            <Text>{summary.completedTasks}</Text>
            <br />
            <Text strong>High Priority Tasks: </Text>
            <Text>{summary.highPriorityTasks}</Text>
            <br />
            <Text strong>Low Priority Tasks: </Text>
            <Text>{summary.lowPriorityTasks}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
