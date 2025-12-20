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

// Import API và CSS
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

      console.log("CHECK DATA API:", res);

      const rawData = res.data;

      if (Array.isArray(rawData)) {
        setData(rawData);
      } else if (rawData && Array.isArray(rawData.data)) {
        setData(rawData.data);
      } else {
        console.log("Dữ liệu không phải là mảng:", rawData);
        setData([]);
      }
    } catch (error) {
      console.error("LỖI GỌI API:", error);
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

    // --- SỬA QUAN TRỌNG: Lấy đúng tên biến Ngày Tháng ---
    const startVal = record.startDate || record.StartDate;
    const endVal = record.endDate || record.EndDate;
    const nameVal = record.name || record.Name;
    const discountVal = record.discountPercent || record.DiscountPercent;
    const descVal = record.description || record.Description;
    const typeVal = record.type || record.Type;

    form.setFieldsValue({
      name: nameVal,
      discountPercent: discountVal,
      description: descVal,
      type: typeVal,
      startDate: startVal ? dayjs(startVal) : null,
      endDate: endVal ? dayjs(endVal) : null,
    });
    setIsModalOpen(true);
  };

  // --- 3. XỬ LÝ LƯU ---
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Chuẩn bị dữ liệu gửi đi
      const payload = {
        name: values.name,
        discountPercent: values.discountPercent,
        description: values.description,
        type: values.type || "Giảm giá",

        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
      };

      if (editingVoucher) {
        // Cập nhật
        const id = editingVoucher.id || editingVoucher.Id;
        await updateVoucher(id, { ...payload, id: id });
        message.success("Cập nhật voucher thành công!");
      } else {
        // Thêm mới
        await createVoucher(payload);
        message.success("Thêm voucher mới thành công!");
      }

      setIsModalOpen(false);
      fetchVouchers();
    } catch (error) {
      console.log("Lỗi:", error);
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
      message.error("Xóa thất bại!");
    }
  };

  // --- CẤU HÌNH CỘT (QUAN TRỌNG NHẤT) ---
  const columns = [
    {
      title: "ID",
      key: "id",
      width: 60,
      render: (_, record) => record.id || record.Id,
    },
    {
      title: "Tên Voucher",
      key: "name",
      render: (_, record) => <b>{record.name || record.Name}</b>,
    },
    {
      title: "Giảm giá",
      key: "discountPercent",
      render: (_, record) => {
        const val = record.discountPercent || record.DiscountPercent;
        return <Tag color="red">-{val}%</Tag>;
      },
    },
    {
      title: "Thời gian áp dụng",
      key: "duration",
      width: 220,
      render: (_, record) => {
        const start = record.startDate || record.StartDate;
        const end = record.endDate || record.EndDate;

        return (
          <div style={{ fontSize: 13 }}>
            <div>
              BĐ: {start ? dayjs(start).format("DD/MM/YYYY HH:mm") : "..."}
            </div>
            <div>KT: {end ? dayjs(end).format("DD/MM/YYYY HH:mm") : "..."}</div>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const start = record.startDate || record.StartDate;
        const end = record.endDate || record.EndDate;

        if (!start || !end) return <Tag>Không xác định</Tag>;

        const now = dayjs();
        const startDate = dayjs(start);
        const endDate = dayjs(end);

        // --- SỬA Ở ĐÂY: Dùng ClassName từ CSS thay vì Color mặc định ---
        if (now.isBefore(startDate)) {
          return <Tag className="status-upcoming">Sắp diễn ra</Tag>;
        } else if (now.isAfter(endDate)) {
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
      render: (_, record) => {
        const id = record.id || record.Id;
        return (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="action-btn-edit" // Class này đã có trong code bạn gửi
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xóa voucher này?"
              onConfirm={() => handleDelete(id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              {/* --- SỬA Ở ĐÂY: Thêm className action-btn-delete --- */}
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
        );
      },
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
        // rowKey quan trọng: Phải lấy đúng ID duy nhất
        rowKey={(record) => record.id || record.Id}
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
