import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Modal,
  Form,
  Input,
  Image,
  Select,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SketchOutlined,
} from "@ant-design/icons";

// Import API
import { getAllBrand, createBrand, deleteBrand } from "../../../Api/Brand";

// Import CSS
import "../Css/BrandManager.css";

const BrandManager = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const availableImages = [
    "adidas_logo.png",
    "nike_logo.png",
    "puma_logo.png",
    "asics_logo.png",
    "columbia_logo.png",
    "crocs_logo.png",
    "hoka_logo.png",
    "on_logo.png",
    "speedo_logo.png",
    "teva_logo.png",
  ];

  // --- LẤY DỮ LIỆU ---
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await getAllBrand();
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
      message.error("Lỗi tải danh sách hãng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // --- XÓA THƯƠNG HIỆU ---
  const handleDelete = async (id) => {
    try {
      await deleteBrand(id);
      message.success("Đã xóa thương hiệu thành công!");
      fetchBrands();
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Xóa thất bại! Có thể hãng này đang có sản phẩm.");
      }
    }
  };

  // --- MỞ MODAL THÊM MỚI ---
  const handleAddNew = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  // --- LƯU (THÊM MỚI) ---
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        logo: values.logo,
      };

      await createBrand(payload);
      message.success("Thêm mới thành công!");

      setIsModalOpen(false);
      fetchBrands();
    } catch (error) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Có lỗi xảy ra!");
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
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 100,
      render: (logoName) => {
        if (!logoName) return null;

        let imgSrc = logoName;
        // Tự động thêm đường dẫn nếu là file nội bộ
        if (!logoName.startsWith("http")) {
          imgSrc = `/Brand/${logoName}`;
        }

        return (
          <Image
            width={60}
            src={imgSrc}
            alt="logo"
            style={{ objectFit: "contain" }}
            fallback="https://via.placeholder.com/60"
          />
        );
      },
    },
    {
      title: "Tên Thương Hiệu",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Popconfirm
          title="Xóa hãng này?"
          description="Hành động này không thể hoàn tác!"
          onConfirm={() => handleDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            className="action-btn-delete"
          >
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      {/* Header trang */}
      <div className="brand-page-header">
        <h2>
          <SketchOutlined style={{ marginRight: 8 }} />
          Quản lý Thương Hiệu
        </h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm hãng mới
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        rowKey="id" // Antd tự lấy trường .id
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />

      {/* Modal Form */}
      <Modal
        title="Thêm thương hiệu mới"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Thêm mới"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[{ required: true, message: "Vui lòng nhập tên hãng!" }]}
          >
            <Input placeholder="VD: Nike, Adidas..." />
          </Form.Item>

          <Form.Item name="logo" label="Logo thương hiệu">
            <Select placeholder="Chọn logo có sẵn..." allowClear showSearch>
              {availableImages.map((imgName) => (
                <Select.Option key={imgName} value={imgName}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`/Brand/${imgName}`}
                      alt={imgName}
                      style={{
                        width: 30,
                        marginRight: 10,
                        objectFit: "contain",
                      }}
                    />
                    {imgName}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandManager;
