import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  addProduct,
  editProduct,
  deleteProduct,
} from "../../reduxToolKist/products/productSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const openAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setOpenModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setOpenModal(true);
  };

  const closeModal = () => {
    form.resetFields();
    setEditingProduct(null);
    setOpenModal(false);
  };

  const handleSubmit = (values) => {
    if (editingProduct) {
      dispatch(
        editProduct({ id: editingProduct.productId, data: values })
      ).then(() => {
        message.success("Cập nhật thành công");
        dispatch(getAllProducts());
        closeModal();
      });
    } else {
      dispatch(addProduct(values)).then(() => {
        message.success("Thêm sản phẩm thành công");
        dispatch(getAllProducts());
        closeModal();
      });
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Bạn chắc chắn muốn xoá sản phẩm này?",
      okType: "danger",
      onOk: () => {
        dispatch(deleteProduct(id)).then(() => {
          message.success("Xoá thành công");
        });
      },
    });
  };

  const columns = [
    // {
    //   title: "Ảnh",
    //   dataIndex: "imageUrl",
    //   render: (url) => (
    //     <img
    //       src={url}
    //       alt="product"
    //       className="w-14 h-14 object-cover rounded shadow"
    //     />
    //   ),
    // },
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      render: (url) => (
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #e5e7eb", // Tailwind's border-gray-200
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            margin: "auto",
          }}
        >
          <img
            src={url}
            alt="Ảnh sản phẩm"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ),
    },

    {
      title: "Tên sản phẩm",
      dataIndex: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      render: (price) => (
        <span className="text-blue-600 font-medium">
          {price?.toLocaleString("vi-VN")} ₫
        </span>
      ),
    },
    {
      title: "Kho hàng",
      dataIndex: "stock",
      render: (stock) =>
        stock > 0 ? (
          <span className="text-green-600">{stock}</span>
        ) : (
          <span className="text-red-500 font-semibold">Hết hàng</span>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEdit(record)}>✏️ Sửa</Button>
          <Button danger onClick={() => handleDelete(record.productId)}>
            🗑️ Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý sản phẩm</h2>
        <Button type="primary" onClick={openAdd}>
          ➕ Thêm sản phẩm
        </Button>
      </div>

      <Table
        rowKey="productId"
        dataSource={products}
        columns={columns}
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={openModal}
        onCancel={closeModal}
        onOk={() => form.submit()}
        title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Tên sản phẩm"
            name="title"
            rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Nhập giá sản phẩm" }]}
          >
            <InputNumber
              min={0}
              className="w-full"
              formatter={(val) =>
                `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item
            label="Kho hàng"
            name="stock"
            rules={[{ required: true, message: "Nhập số lượng kho" }]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Ảnh (URL)"
            name="imageUrl"
            rules={[{ required: true, message: "Nhập URL ảnh" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
