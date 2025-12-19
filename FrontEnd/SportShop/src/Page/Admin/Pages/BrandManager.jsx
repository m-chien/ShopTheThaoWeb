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
  Space,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

// Import API
import { getAllBrand, createBrand, deleteBrand } from "../../../Api/Brand";

// --- 1. IMPORT FILE CSS ---
import "../Css/BrandManager.css";

const BrandManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const availableImages = [
    "adidas_logo.png",
    "nike_logo.png",
    "puma_logo.png",
    "mizuno_logo.png",
    "kamito_logo.png",
    "jorgabola_logo.png",
    "grandSport_logo.png",
    "UnderArmour.png",
    "NewBalance.png",
  ];

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await getAllBrand();
      if (res.data) {
        if (Array.isArray(res.data)) setData(res.data);
        else if (res.data.data && Array.isArray(res.data.data))
          setData(res.data.data);
        else setData([]);
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

  const handleDelete = async (id) => {
    try {
      await deleteBrand(id);
      message.success("Đã xóa thương hiệu thành công!");
      fetchBrands();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Xóa thất bại! Có thể hãng này đang có sản phẩm.");
      }
    }
  };

  const handleAddNew = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

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
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message.error(error.response.data.message);
      } else {
        message.error("Có lỗi xảy ra!");
      }
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (id, record) => id || record.ID,
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 100,
      render: (_, record) => {
        let imgName = record.logo || record.Logo;
        if (!imgName) return null;

        let imgSrc = imgName;
        if (!imgName.startsWith("http")) {
          imgSrc = `/Brand/${imgName}`;
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
      render: (_, record) => {
        const id = record.id || record.ID;
        return (
          <Popconfirm
            title="Xóa hãng này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleDelete(id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            {/* --- 2. SỬA NÚT XÓA Ở ĐÂY --- */}
            {/* Bỏ type="primary" để nó ăn style viền đỏ của class css */}
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              className="action-btn-delete"
            >
              Xóa
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div>
      {/* --- 3. SỬA HEADER Ở ĐÂY --- */}
      <div className="product-page-header">
        <h2>Quản lý Thương Hiệu</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm hãng mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        rowKey={(record) => record.id || record.ID}
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />

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
