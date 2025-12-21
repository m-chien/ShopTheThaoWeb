import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Popconfirm,
  Tag,
  Space,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Import API & CSS
import {
  getAllVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../../../Api/Voucher";
import "../Css/VoucherManager.css";

const { TextArea } = Input;

const VoucherManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();

  // --- 1. LẤY DỮ LIỆU ---
  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await getAllVouchers();
      const rawData = res.data;

      // Xử lý dữ liệu trả về từ API (hỗ trợ cả dạng mảng và dạng wrapper object)
      if (Array.isArray(rawData)) {
        setData(rawData);
      } else if (rawData && Array.isArray(rawData.data)) {
        setData(rawData.data);
      } else {
        setData([]);
      }
    } catch (error) {
      message.error("Lỗi tải danh sách voucher!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // --- 2. XỬ LÝ MỞ FORM ---
  const handleAddNew = () => {
    setEditingVoucher(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingVoucher(record);

    // Đổ dữ liệu vào form (Dùng đúng tên biến camelCase)
    form.setFieldsValue({
      name: record.name,
      discountPercent: record.discountPercent,
      description: record.description,
      type: record.type,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
    });
    setIsModalOpen(true);
  };

  // --- 3. XỬ LÝ LƯU ---
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Chuẩn bị payload sạch sẽ
      const payload = {
        name: values.name,
        discountPercent: values.discountPercent,
        description: values.description,
        type: values.type || "Giảm giá",
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };

      if (editingVoucher) {
        // Cập nhật: Truyền thêm ID vào URL và body (nếu cần)
        await updateVoucher(editingVoucher.id, {
          ...payload,
          id: editingVoucher.id,
        });
        message.success("Cập nhật voucher thành công!");
      } else {
        // Thêm mới
        await createVoucher(payload);
        message.success("Thêm voucher mới thành công!");
      }

      setIsModalOpen(false);
      fetchVouchers();
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra! Vui lòng kiểm tra lại.");
    }
  };

  // --- 4. XỬ LÝ XÓA ---
  const handleDelete = async (id) => {
    try {
      await deleteVoucher(id);
      message.success("Đã xóa voucher!");
      fetchVouchers();
    } catch (error) {
      message.error("Xóa thất bại (Có thể đang được sử dụng)!");
    }
  };

  // --- CẤU HÌNH CỘT ---
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (id) => id,
    },
    {
      title: "Tên Voucher",
      dataIndex: "name",
      key: "name",
      render: (name) => <b>{name}</b>,
    },
    {
      title: "Giảm giá",
      dataIndex: "discountPercent",
      key: "discountPercent",
      render: (val) => <Tag color="red">-{val}%</Tag>,
    },
    {
      title: "Thời gian áp dụng",
      key: "duration",
      width: 220,
      render: (_, record) => (
        <div style={{ fontSize: 13 }}>
          <div>
            BĐ:{" "}
            {record.startDate
              ? dayjs(record.startDate).format("DD/MM/YYYY HH:mm")
              : "..."}
          </div>
          <div>
            KT:{" "}
            {record.endDate
              ? dayjs(record.endDate).format("DD/MM/YYYY HH:mm")
              : "..."}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        if (!record.startDate || !record.endDate)
          return <Tag>Không xác định</Tag>;

        const now = dayjs();
        const start = dayjs(record.startDate);
        const end = dayjs(record.endDate);

        if (now.isBefore(start)) {
          return <Tag className="status-upcoming">Sắp diễn ra</Tag>;
        } else if (now.isAfter(end)) {
          return <Tag className="status-expired">Đã kết thúc</Tag>;
        } else {
          return <Tag className="status-active">Đang diễn ra</Tag>;
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="action-btn-edit"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa voucher này?"
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="voucher-page-header">
        <h2>
          <TagsOutlined style={{ marginRight: 8 }} />
          Quản lý Voucher
        </h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm Voucher
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id" // Antd tự lấy trường .id
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
      />

      {/* --- MODAL FORM --- */}
      <Modal
        title={editingVoucher ? "Cập nhật Voucher" : "Thêm Voucher Mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText={editingVoucher ? "Lưu thay đổi" : "Thêm mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Voucher (Mã)"
            rules={[{ required: true, message: "Vui lòng nhập tên voucher!" }]}
          >
            <Input placeholder="VD: SUMMER2024..." />
          </Form.Item>

          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="discountPercent"
              label="Phần trăm giảm (%)"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Nhập số % giảm!" }]}
            >
              <InputNumber min={1} max={100} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại khuyến mãi"
              style={{ flex: 1 }}
              initialValue="Giảm giá"
            >
              <Input />
            </Form.Item>
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Chọn ngày bắt đầu!" }]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              style={{ flex: 1 }}
              rules={[{ required: true, message: "Chọn ngày kết thúc!" }]}
            >
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Mô tả chi tiết">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherManager;
