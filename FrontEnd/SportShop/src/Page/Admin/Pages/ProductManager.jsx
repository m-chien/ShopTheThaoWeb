import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  message,
  Image,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SkinOutlined,
} from "@ant-design/icons";

import "../Css/ProductManager.css";

import {
  getAllProduct,
  deleteProduct,
  createProduct,
  updateProduct,
  getVariantsByProductId,
  updateProductVariant,
  deleteProductVariant,
  createProductVariant,
} from "../../../Api/Product";
import { getAllCategory } from "../../../Api/Category";
import { getAllBrand } from "../../../Api/Brand";
import { getAllSize } from "../../../Api/Size";
import { getAllColor } from "../../../Api/Color";

const ProductManager = () => {
  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho bộ lọc & Select box
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  // State cho Modal (Form Thêm/Sửa Chính)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // State chứa danh sách biến thể
  const [variantList, setVariantList] = useState([]);

  // State cho Modal sửa biến thể (Mini Modal)
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [formVariant] = Form.useForm();

  // State cho Modal Thêm Biến Thể Mới
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);
  const [formAddVariant] = Form.useForm();

  // --- 1. HÀM LẤY DANH SÁCH SẢN PHẨM ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProduct();
      const rawData = response.data;

      // Xử lý dữ liệu trả về (Wrapper object hoặc mảng trực tiếp)
      if (Array.isArray(rawData)) {
        setData(rawData);
      } else if (rawData && Array.isArray(rawData.data)) {
        setData(rawData.data);
      } else {
        setData([]);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm!");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HÀM LẤY DỮ LIỆU BỔ TRỢ (DANH MỤC, THƯƠNG HIỆU...) ---
  const fetchFilters = async () => {
    try {
      const [resCate, resBrand, resSize, resColor] = await Promise.all([
        getAllCategory(),
        getAllBrand(),
        getAllSize(),
        getAllColor(),
      ]);

      // Helper function để lấy mảng data an toàn
      const extractData = (res) => {
        if (Array.isArray(res.data)) return res.data;
        if (res.data && Array.isArray(res.data.data)) return res.data.data;
        return [];
      };

      setCategories(extractData(resCate));
      setBrands(extractData(resBrand));
      setSizes(extractData(resSize));
      setColors(extractData(resColor));
    } catch (error) {
      message.error("Lỗi tải dữ liệu bộ lọc");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, []);

  // --- 3. XỬ LÝ XÓA SẢN PHẨM CHA ---
  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteProduct(id);
      message.success("Đã xóa sản phẩm thành công!");
      fetchProducts();
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Xóa thất bại! Có thể sản phẩm đang có đơn hàng.";
      message.error(msg);
    }
  };

  // --- 4. XỬ LÝ MỞ MODAL THÊM MỚI ---
  const handleAddNew = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // --- 5. XỬ LÝ SỬA (Mở Modal và điền dữ liệu) ---
  const handleEdit = async (record) => {
    setEditingProduct(record);
    setIsModalOpen(true);

    // Điền dữ liệu vào Form
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      categoryID: record.categoryID,
      brandID: record.brandID,
    });

    // Lấy danh sách biến thể
    try {
      setVariantList([]);
      const res = await getVariantsByProductId(record.productID);
      const variants = res.data;

      if (Array.isArray(variants)) {
        setVariantList(variants);
      } else if (variants && Array.isArray(variants.data)) {
        setVariantList(variants.data);
      }
    } catch (error) {
      message.error("Lỗi tải thông tin biến thể!");
    }
  };

  // --- 6. XỬ LÝ LƯU THÔNG TIN CHUNG ---
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editingProduct) {
        // Cập nhật
        const id = editingProduct.productID;
        await updateProduct(id, { id: id, ...values });
        message.success("Cập nhật thông tin thành công!");
      } else {
        // Thêm mới
        await createProduct({
          name: values.name,
          description: values.description,
          categoryID: values.categoryID,
          brandID: values.brandID,
          price: values.price,
          stockQuantity: values.stockQuantity,
          sizeID: values.sizeID,
          colorID: values.colorID,
          image: values.image,
        });
        message.success("Tạo sản phẩm thành công!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      message.error("Thất bại! Vui lòng kiểm tra lại dữ liệu.");
    }
  };

  // =======================================================
  // === CÁC HÀM XỬ LÝ BIẾN THỂ (MASTER-DETAIL LOGIC) ===
  // =======================================================

  const refreshVariants = async (parentId) => {
    try {
      const res = await getVariantsByProductId(parentId);
      if (Array.isArray(res.data)) setVariantList(res.data);
      else if (res.data?.data) setVariantList(res.data.data);
    } catch (e) {
      /* Ignore */
    }
  };

  const handleDeleteVariant = async (variantId) => {
    try {
      await deleteProductVariant(variantId);
      message.success("Đã xóa biến thể!");
      refreshVariants(editingProduct.productID);
    } catch (error) {
      message.error("Lỗi khi xóa biến thể!");
    }
  };

  const handleEditVariant = (record) => {
    setCurrentVariant(record);
    setIsVariantModalOpen(true);
    formVariant.setFieldsValue({
      price: record.price,
      stockQuantity: record.stockQuantity,
    });
  };

  const handleSaveVariant = async () => {
    try {
      const values = await formVariant.validateFields();
      await updateProductVariant(currentVariant.id, {
        price: values.price,
        stockQuantity: values.stockQuantity,
      });
      message.success("Cập nhật thành công!");
      setIsVariantModalOpen(false);
      refreshVariants(editingProduct.productID);
    } catch (error) {
      message.error("Cập nhật thất bại!");
    }
  };

  const handleAddNewVariant = async () => {
    try {
      const values = await formAddVariant.validateFields();
      const parentId = editingProduct.productID;

      const payload = {
        ProductId: Number(parentId),
        SizeId: Number(values.sizeID),
        ColorId: Number(values.colorID),
        Price: Number(values.price),
        StockQuantity: Number(values.stockQuantity),
        Image: values.image,
      };

      await createProductVariant(payload);
      message.success("Thêm biến thể mới thành công!");
      setIsAddVariantModalOpen(false);
      formAddVariant.resetFields();
      refreshVariants(parentId);
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.message) {
        message.error(errData.message);
      } else {
        message.error("Lỗi: Dữ liệu không hợp lệ hoặc đã tồn tại!");
      }
    }
  };

  // --- CẤU HÌNH CỘT BẢNG CHÍNH ---
  const columns = [
    { title: "ID", dataIndex: "productID", key: "productID", width: 60 },
    {
      title: "Hình ảnh",
      dataIndex: "images",
      key: "images",
      width: 100,
      render: (images) => {
        const firstImage = images && images.length > 0 ? images[0] : null;
        return (
          <Image
            width={50}
            src={
              firstImage
                ? `/Product/${firstImage}`
                : "https://via.placeholder.com/50"
            }
            fallback="https://via.placeholder.com/50"
          />
        );
      },
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (text) => <div className="description-cell">{text}</div>,
    },
    {
      title: "Danh Mục",
      dataIndex: "categoryName",
      key: "categoryName",
      filters: categories.map((c) => ({ text: c.name, value: c.name })),
      onFilter: (value, record) => record.categoryName === value,
    },
    {
      title: "Thương Hiệu",
      dataIndex: "brandName",
      key: "brandName",
      filters: brands.map((b) => ({ text: b.name, value: b.name })),
      onFilter: (value, record) => record.brandName === value,
    },
    {
      title: "Size",
      dataIndex: "sizes",
      key: "sizes",
      render: (sizes) => (
        <Space size={[0, 4]} wrap className="w-100">
          {sizes?.map((s, index) => (
            <Tag key={index} color="purple">
              {s.sizeName}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Màu sắc",
      dataIndex: "colors",
      key: "colors",
      width: 100,
      render: (colors) => (
        <Space size={[0, 8]} wrap>
          {colors?.map((c, index) => (
            <Tag key={index} color="blue">
              {c.colorName}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "prices",
      key: "prices",
      width: 120,
      render: (prices) => {
        if (!prices || prices.length === 0) return "Liên hệ";
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? (
          <span className="price-display">{min.toLocaleString()}</span>
        ) : (
          <span className="price-display">
            {min.toLocaleString()} - {max.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
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
            title="Xóa sản phẩm?"
            description="Hành động này sẽ xóa tất cả size/màu liên quan!"
            onConfirm={() => handleDelete(record.productID)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="action-btn-delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="product-page-header">
        <h2>
          <SkinOutlined style={{ marginRight: 8 }} />
          Quản lý Sản Phẩm
        </h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(data) ? data : []}
        rowKey="productID"
        loading={loading}
        pagination={{ pageSize: 6 }}
      />

      {/* ========================================= */}
      {/* === MODAL 1: FORM CHÍNH (THÊM / SỬA) === */}
      {/* ========================================= */}
      <Modal
        title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={800}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          {/* --- CÁC TRƯỜNG CHUNG --- */}
          <div className="form-row">
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              className="form-item-flex"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <Input placeholder="Nhập tên sản phẩm..." />
            </Form.Item>

            {!editingProduct && (
              <Form.Item
                name="image"
                label="Tên file ảnh"
                className="form-item-flex"
                rules={[{ required: true, message: "Nhập tên file ảnh!" }]}
              >
                <Input placeholder="VD: nike.png" />
              </Form.Item>
            )}
          </div>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>

          <div className="form-row">
            <Form.Item
              name="categoryID"
              label="Danh mục"
              className="form-item-flex"
              rules={[{ required: true, message: "Chọn danh mục!" }]}
            >
              <Select placeholder="Chọn danh mục">
                {categories.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="brandID"
              label="Thương hiệu"
              className="form-item-flex"
              rules={[{ required: true, message: "Chọn thương hiệu!" }]}
            >
              <Select placeholder="Chọn thương hiệu">
                {brands.map((b) => (
                  <Select.Option key={b.id} value={b.id}>
                    {b.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* --- NẾU LÀ THÊM MỚI: HIỆN FORM NHẬP BIẾN THỂ ĐẦU TIÊN --- */}
          {!editingProduct && (
            <>
              <p className="section-title">Thông tin bán hàng (Size & Giá)</p>
              <div className="form-row">
                <Form.Item
                  name="sizeID"
                  label="Size"
                  className="form-item-flex"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Chọn Size">
                    {sizes.map((s) => (
                      <Select.Option key={s.id} value={s.id}>
                        {s.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="colorID"
                  label="Màu sắc"
                  className="form-item-flex"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Chọn Màu">
                    {colors.map((c) => (
                      <Select.Option key={c.id} value={c.id}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="form-row">
                <Form.Item
                  name="price"
                  label="Giá bán (VNĐ)"
                  className="form-item-flex"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    className="w-100"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="stockQuantity"
                  label="Số lượng tồn"
                  className="form-item-flex"
                  rules={[{ required: true }]}
                >
                  <InputNumber className="w-100" min={0} />
                </Form.Item>
              </div>
            </>
          )}

          {/* --- NẾU LÀ SỬA: HIỆN DANH SÁCH BIẾN THỂ --- */}
          {editingProduct && (
            <div className="variant-table-container">
              <p className="section-subtitle">
                Chi tiết các biến thể (Size/Màu/Giá)
              </p>

              <Table
                dataSource={Array.isArray(variantList) ? variantList : []}
                rowKey="id"
                pagination={false}
                size="small"
                bordered
                columns={[
                  {
                    title: "Size",
                    key: "sizeName",
                    width: 80,
                    render: (_, record) => (
                      <Tag color="purple">{record.size.name}</Tag>
                    ),
                  },
                  {
                    title: "Màu",
                    key: "colorName",
                    width: 80,
                    render: (_, record) => (
                      <Tag color="blue">{record.color.name}</Tag>
                    ),
                  },
                  {
                    title: "Giá tiền (VNĐ)",
                    dataIndex: "price",
                    key: "price",
                    render: (price) => (
                      <b className="text-red">{price?.toLocaleString()}</b>
                    ),
                  },
                  {
                    title: "Tồn kho",
                    dataIndex: "stockQuantity",
                    key: "stockQuantity",
                  },
                  {
                    title: "Hành động",
                    key: "action",
                    render: (_, record) => (
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          ghost
                          icon={<EditOutlined />}
                          onClick={() => handleEditVariant(record)}
                        >
                          Sửa giá
                        </Button>
                        <Popconfirm
                          title="Xóa biến thể này?"
                          onConfirm={() => handleDeleteVariant(record.id)}
                        >
                          <Button
                            type="dashed"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ]}
              />
              <Button
                type="dashed"
                className="w-100 mt-10"
                icon={<PlusOutlined />}
                onClick={() => setIsAddVariantModalOpen(true)}
              >
                Thêm biến thể mới (Size/Màu khác)
              </Button>
            </div>
          )}
        </Form>
      </Modal>

      {/* ========================================= */}
      {/* === MODAL 2: SỬA GIÁ / KHO === */}
      {/* ========================================= */}
      <Modal
        title={`Sửa giá: ${currentVariant?.size.name} - ${currentVariant?.color.name}`}
        open={isVariantModalOpen}
        onOk={handleSaveVariant}
        onCancel={() => setIsVariantModalOpen(false)}
        width={400}
        zIndex={1001}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <Form form={formVariant} layout="vertical">
          <Form.Item
            name="price"
            label="Giá tiền mới"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="w-100"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item
            name="stockQuantity"
            label="Tồn kho mới"
            rules={[{ required: true }]}
          >
            <InputNumber className="w-100" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ========================================= */}
      {/* === MODAL 3: THÊM BIẾN THỂ MỚI === */}
      {/* ========================================= */}
      <Modal
        title="Thêm Size/Màu mới"
        open={isAddVariantModalOpen}
        onOk={handleAddNewVariant}
        onCancel={() => setIsAddVariantModalOpen(false)}
        width={500}
        zIndex={1002}
        okText="Thêm mới"
        cancelText="Hủy"
      >
        <Form form={formAddVariant} layout="vertical">
          <div className="form-row">
            <Form.Item
              name="sizeID"
              label="Size"
              className="form-item-flex"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn Size">
                {sizes.map((s) => (
                  <Select.Option key={s.id} value={s.id}>
                    {s.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="colorID"
              label="Màu"
              className="form-item-flex"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn Màu">
                {colors.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="form-row">
            <Form.Item
              name="price"
              label="Giá"
              className="form-item-flex"
              rules={[{ required: true }]}
            >
              <InputNumber
                className="w-100"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>
            <Form.Item
              name="stockQuantity"
              label="Tồn kho"
              className="form-item-flex"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-100" />
            </Form.Item>
          </div>
          <Form.Item name="image" label="Ảnh biến thể (Tùy chọn)">
            <Input placeholder="VD: nike-red.png (Để trống nếu dùng ảnh chung)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;
