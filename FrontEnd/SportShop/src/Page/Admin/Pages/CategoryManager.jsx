import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Modal,
  Form,
  Input,
  Image,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

// Import CSS
import "../Css/CategoryManager.css";

// Import API
import {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../Api/Category";

const CategoryManager = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  // Danh sách ảnh có sẵn
  const availableImages = [
    "AoKhoac.png",
    "AoThun.png",
    "BaLo.png",
    "DoBoi.png",
    "GiayChayBo.png",
    "GiayLuyenTap.png",
    "GiayThoiTrang.png",
    "QuanDai.png",
    "QuanNgan.png",
    "XangDan.png",
  ];

  // --- 1. LẤY DANH SÁCH ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategory();
      const rawData = res.data;

      // Xử lý dữ liệu trả về (Wrapper object hoặc mảng trực tiếp)
      if (Array.isArray(rawData)) {
        setData(rawData);
      } else if (rawData && Array.isArray(rawData.data)) {
        setData(rawData.data);
      } else {
        setData([]);
      }
    } catch (error) {
      message.error("Lỗi tải danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- 2. XÓA DANH MỤC ---
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success("Đã xóa danh mục!");
      fetchCategories();
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Xóa thất bại! Có thể danh mục này đang chứa sản phẩm.");
      }
    }
  };

  // --- 3. MỞ MODAL THÊM MỚI ---
  const handleAddNew = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // --- 4. MỞ MODAL SỬA ---
  const handleEdit = (record) => {
    setEditingCategory(record);
    setIsModalOpen(true);

    // Điền dữ liệu cũ vào form
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      image: record.image,
    });
  };

  // --- 5. LƯU (THÊM HOẶC SỬA) ---
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        description: values.description,
        image: values.image,
      };

      if (editingCategory) {
        // == CẬP NHẬT ==
        const id = editingCategory.id;
        await updateCategory(id, { ...payload, id });
        message.success("Cập nhật thành công!");
      } else {
        // == THÊM MỚI ==
        await createCategory(payload);
        message.success("Thêm mới thành công!");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Có lỗi xảy ra, vui lòng kiểm tra lại!");
      }
    }
  };

  // --- CẤU HÌNH CỘT BẢNG ---
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (id) => id,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (imageName) => {
        if (!imageName) {
          return (
            <Image
              width={50}
              src="error"
              fallback="https://via.placeholder.com/50"
            />
          );
        }

        let imgSrc = imageName;
        // Tự động thêm đường dẫn nếu là file nội bộ
        if (!imageName.startsWith("http")) {
          imgSrc = `/Category/${imageName}`;
        }

        return (
          <Image
            width={50}
            src={imgSrc}
            alt="img"
            fallback="https://via.placeholder.com/50"
          />
        );
      },
    },
    {
      title: "Tên Danh Mục",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            className="action-btn-edit"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa danh mục này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="action-btn-delete"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="category-page-header">
        <h2>
          <AppstoreOutlined style={{ marginRight: 8 }} />
          Quản lý Danh Mục
        </h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        rowKey="id" // Antd tự lấy trường .id
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />

      {/* === MODAL FORM === */}
      <Modal
        title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Ví dụ: Giày bóng đá..." />
          </Form.Item>

          <Form.Item name="image" label="Chọn hình ảnh">
            <Select
              placeholder="Chọn ảnh có sẵn hoặc nhập link..."
              allowClear
              showSearch
            >
              {availableImages.map((imgName) => (
                <Select.Option key={imgName} value={imgName}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`/Category/${imgName}`}
                      alt={imgName}
                      style={{ width: 20, marginRight: 10 }}
                    />
                    {imgName}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả (Tùy chọn)">
            <Input.TextArea rows={3} placeholder="Nhập mô tả cho danh mục..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManager;
