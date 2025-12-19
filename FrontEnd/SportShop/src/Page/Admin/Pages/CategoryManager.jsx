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
  Select, // Import thêm Select nếu bạn muốn dùng cái dropdown chọn ảnh
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

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

  // Danh sách ảnh có sẵn (nếu bạn muốn dùng Select chọn ảnh)
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
      if (res.data) {
        if (Array.isArray(res.data)) setData(res.data);
        else if (res.data.data && Array.isArray(res.data.data))
          setData(res.data.data);
        else setData([]);
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
      // Backend trả về message lỗi cụ thể thì hiển thị ra
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
    setTimeout(() => {
      form.setFieldsValue({
        name: record.name,
        description: record.description,
        image: record.image || record.Image,
      });
    }, 100);
  };

  // --- 5. LƯU (THÊM HOẶC SỬA) ---
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Chuẩn bị dữ liệu gửi đi
      const payload = {
        name: values.name,
        description: values.description,
        image: values.image,
      };

      if (editingCategory) {
        // == CẬP NHẬT ==
        const id =
          editingCategory.id ||
          editingCategory.ID ||
          editingCategory.categoryId;

        payload.id = id;

        await updateCategory(id, payload);
        message.success("Cập nhật thành công!");
      } else {
        // == THÊM MỚI ==
        await createCategory(payload);
        message.success("Thêm mới thành công!");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
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
      render: (id, record) => id || record.ID || record.categoryId,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (_, record) => {
        let imgName = record.image || record.Image;

        if (!imgName)
          return (
            <Image
              width={50}
              src="error"
              fallback="https://via.placeholder.com/50"
            />
          );

        let imgSrc = imgName;
        // Tự động thêm đường dẫn nếu là file nội bộ
        if (!imgName.startsWith("http")) {
          imgSrc = `/Category/${imgName}`;
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
      render: (_, record) => {
        const id = record.id || record.ID || record.categoryId;
        return (
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
              onConfirm={() => handleDelete(id)}
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
        );
      },
    },
  ];

  return (
    <div>
      <div className="category-page-header">
        <h2>Quản lý Danh Mục</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        rowKey={(record) => record.id || record.ID || record.categoryId}
        loading={loading}
        // --- SỬA Ở ĐÂY ---
        pagination={{ pageSize: 5 }} // Đổi từ 10 thành 5
        // ----------------
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

          {/* Dùng Select chọn ảnh cho tiện (hoặc dùng Input như cũ tùy bạn) */}
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
