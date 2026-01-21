import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addStaff,
  getAllStaff,
  editStaff,
  removeStaff,
} from "../../reduxToolKist/staff/staffSlice";

const { Option } = Select;

const StaffManagement = () => {
  const dispatch = useDispatch();
  const { staffs, loading } = useSelector((state) => state.staff);
  const [openModal, setOpenModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getAllStaff());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingStaff(null);
    form.resetFields();
    setOpenModal(true);
  };

  const handleEdit = (record) => {
    setEditingStaff(record);
    form.setFieldsValue(record);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa nhân viên này?",
      okType: "danger",
      onOk: () => {
        dispatch(removeStaff(id)).then(() => {
          message.success("Xóa thành công");
        });
      },
    });
  };

  const handleSubmit = (values) => {
    if (editingStaff) {
      dispatch(editStaff({ id: editingStaff.id, data: values })).then(() => {
        message.success("Cập nhật thành công");
        closeModal();
      });
    } else {
      dispatch(addStaff(values)).then(() => {
        message.success("Thêm nhân viên thành công");
        dispatch(getAllStaff()); // 🛠️ reload lại dữ liệu
        closeModal();
      });
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingStaff(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "avatarUrl",
      render: (url) => (
        <img
          src={url}
          alt="avatar"
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ),
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      render: (gender) =>
        gender === "Nam" ? "👨 Nam" : gender === "Nữ" ? "👩 Nữ" : "⚧ Khác",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) =>
        role === "ROLE_STAFF"
          ? "Nhân viên"
          : role === "ROLE_ADMIN"
          ? "Quản trị"
          : role,
    },
    {
      title: "Trạng thái",
      dataIndex: "isAvailable",
      render: (isAvailable) =>
        isAvailable ? (
          <span style={{ color: "green" }}>✔️ Hoạt động</span>
        ) : (
          <span style={{ color: "red" }}>❌ Nghỉ</span>
        ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>✏️ Sửa</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            🗑️ Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý nhân viên</h2>
        <Button type="primary" onClick={handleAdd}>
          ➕ Thêm nhân viên
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={staffs}
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }} // ✅ Thêm dòng này để phân trang mỗi trang 5 nhân viên
      />

      <Modal
        open={openModal}
        onCancel={closeModal}
        onOk={() => form.submit()}
        title={editingStaff ? "Cập nhật nhân viên" : "Thêm nhân viên"}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Ảnh đại diện (URL)" name="avatarUrl">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            label="Đang hoạt động"
            name="isAvailable"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default StaffManagement;
