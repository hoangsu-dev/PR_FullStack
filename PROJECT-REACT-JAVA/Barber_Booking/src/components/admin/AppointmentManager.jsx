import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Space,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { getAuthHeaders } from "../../reduxToolKist/utils/authHeader";

const { Text } = Typography;

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy token từ localStorage hoặc nơi bạn lưu
  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8181/api/customer/appointments/all",
        getAuthHeaders()
      );
      setAppointments(res.data);
    } catch (err) {
      message.error("Lỗi khi tải lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    console.log("🧹 Xóa lịch hẹn với ID:", id);

    if (!id || isNaN(id)) {
      message.error("ID lịch hẹn không hợp lệ");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8181/api/customer/appointments/${id}`,
        getAuthHeaders()
      );
      message.success("Đã xóa lịch hẹn");
      fetchAppointments();
    } catch (err) {
      message.error("Không thể xóa lịch hẹn");
      console.error("❌ Lỗi khi xóa lịch:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const columns = [
    {
      title: "Mã lịch hẹn",
      dataIndex: "appointmentId",
      key: "appointmentId",
      width: 80,
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Nhân viên",
      dataIndex: "staffName",
      key: "staffName",
    },
    {
      title: "Thời gian",
      dataIndex: "startTime",
      key: "startTime",
      render: (value) => new Date(value).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status === "Đã hủy" ? "volcano" : "green";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (note) => <Text ellipsis>{note || "Không có"}</Text>,
    },
    {
      title: "Hành động",
      render: (text, record) => (
        <Popconfirm
          title="Bạn chắc chắn muốn xóa lịch hẹn này?"
          onConfirm={() => deleteAppointment(record.appointmentId)} // ✅ Chắc chắn `record.id` là số
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>🗓️ Quản lý lịch hẹn</h2>
      <Button
        type="default"
        icon={<ReloadOutlined />}
        onClick={fetchAppointments}
        loading={loading}
        style={{ marginBottom: 16 }}
      >
        Tải lại
      </Button>
      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }} // ✅ Thêm dòng này để phân trang
      />
    </div>
  );
};

export default AppointmentManager;
