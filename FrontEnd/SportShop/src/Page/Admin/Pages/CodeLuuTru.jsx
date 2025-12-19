// import React, { useState, useEffect } from "react";

// import {
//   Table,
//   Button,
//   Space,
//   Tag,
//   message,
//   Image,
//   Popconfirm,
//   Modal,
//   Form,
//   Input,
//   Select,
//   InputNumber,
// } from "antd";

// import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

// import "../Css/ProductManager.css";

// // Import API

// import {
//   getAllProduct,
//   deleteProduct,
//   createProduct,
//   updateProduct,

//   // getVariantsByProductId,

//   // updateProductVariant,

//   // deleteProductVariant,
// } from "../../../Api/Product";

// import { getAllCategory } from "../../../Api/Category";

// import { getAllBrand } from "../../../Api/Brand";

// import { getAllSize } from "../../../Api/Size"; // Đảm bảo bạn đã tạo file này

// import { getAllColor } from "../../../Api/Color"; // Đảm bảo bạn đã tạo file này

// const ProductManager = () => {
//   // --- STATE QUẢN LÝ DỮ LIỆU ---

//   const [data, setData] = useState([]);

//   const [loading, setLoading] = useState(false);

//   // State cho bộ lọc & Select box

//   const [categories, setCategories] = useState([]);

//   const [brands, setBrands] = useState([]);

//   const [sizes, setSizes] = useState([]);

//   const [colors, setColors] = useState([]);

//   // State cho Modal (Form Thêm/Sửa)

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const [editingProduct, setEditingProduct] = useState(null);

//   const [form] = Form.useForm();

//   // const [variantList, setVariantList] = useState([]); // State chứa danh sách biến thể để sửa

//   // // State cho Modal sửa biến thể (Mini Modal)

//   // const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

//   // const [currentVariant, setCurrentVariant] = useState(null); // Lưu dòng biến thể đang sửa

//   // const [formVariant] = Form.useForm(); // Form riêng cho biến thể

//   // --- 1. HÀM LẤY DANH SÁCH SẢN PHẨM ---

//   const fetchProducts = async () => {
//     setLoading(true);

//     try {
//       const response = await getAllProduct();

//       // Xử lý dữ liệu trả về tùy theo cấu trúc API (có wrapper hay không)

//       if (response.data && Array.isArray(response.data.data)) {
//         setData(response.data.data);
//       } else if (Array.isArray(response.data)) {
//         setData(response.data);
//       } else {
//         setData([]);
//       }
//     } catch (error) {
//       message.error("Lỗi khi tải danh sách sản phẩm!");

//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- 2. HÀM LẤY DỮ LIỆU BỔ TRỢ (Danh mục, Brand, Size, Color) ---

//   const fetchFilters = async () => {
//     try {
//       const [resCate, resBrand, resSize, resColor] = await Promise.all([
//         getAllCategory(),

//         getAllBrand(),

//         getAllSize(),

//         getAllColor(),
//       ]);

//       // Xử lý Danh mục

//       const cateList = resCate.data
//         ? Array.isArray(resCate.data)
//           ? resCate.data
//           : resCate.data.data || []
//         : [];

//       setCategories(cateList);

//       // Xử lý Thương hiệu

//       const brandList = resBrand.data
//         ? Array.isArray(resBrand.data)
//           ? resBrand.data
//           : resBrand.data.data || []
//         : [];

//       setBrands(brandList);

//       // Xử lý Size

//       const sizeList = resSize.data
//         ? Array.isArray(resSize.data)
//           ? resSize.data
//           : resSize.data.data || []
//         : [];

//       setSizes(sizeList);

//       // Xử lý Màu

//       const colorList = resColor.data
//         ? Array.isArray(resColor.data)
//           ? resColor.data
//           : resColor.data.data || []
//         : [];

//       setColors(colorList);
//     } catch (error) {
//       console.error("Lỗi lấy dữ liệu bộ lọc:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();

//     fetchFilters();
//   }, []);

//   // --- 3. XỬ LÝ XÓA ---

//   const handleDelete = async (id) => {
//     if (!id) return;

//     try {
//       await deleteProduct(id);

//       message.success("Đã xóa sản phẩm thành công!");

//       fetchProducts();
//     } catch (error) {
//       // Hiển thị thông báo lỗi cụ thể từ Backend (nếu có)

//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         message.error(error.response.data.message);
//       } else {
//         message.error("Xóa thất bại! Có thể sản phẩm đang có đơn hàng.");
//       }
//     }
//   };

//   // --- 4. XỬ LÝ MỞ MODAL THÊM MỚI ---

//   const handleAddNew = () => {
//     setEditingProduct(null); // Null nghĩa là đang thêm mới

//     form.resetFields(); // Xóa trắng form

//     setIsModalOpen(true);
//   };

//   // // --- 5. XỬ LÝ SỬA (Mở Modal và điền dữ liệu cũ) ---

//   // const handleEdit = async (record) => {

//   //   setEditingProduct(record);

//   //   // 1. Điền thông tin chung vào form

//   //   const id = record.productID || record.ProductID;

//   //   form.setFieldsValue({

//   //     name: record.name,

//   //     description: record.description,

//   //     categoryID: record.categoryID || record.CategoryID,

//   //     brandID: record.brandID || record.BrandID,

//   //   });

//   //   // 2. Gọi API lấy danh sách biến thể chi tiết

//   //   try {

//   //     const res = await getVariantsByProductId(id);

//   //     if (res.data) {

//   //       setVariantList(res.data); // Lưu vào state để hiển thị bảng con

//   //     }

//   //   } catch (error) {

//   //     message.error("Lỗi tải thông tin biến thể!");

//   //   }

//   //   setIsModalOpen(true);

//   // };

//   // --- 6. XỬ LÝ LƯU (KHI BẤM NÚT OK TRONG MODAL) ---

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();

//       if (editingProduct) {
//         // --- LOGIC SỬA ---

//         const id = editingProduct.productID || editingProduct.ProductID;

//         await updateProduct(id, {
//           id: id,

//           ...values, // Gửi name, description, categoryID, brandID
//         });

//         message.success("Cập nhật thông tin thành công!");
//       } else {
//         // --- LOGIC THÊM MỚI (Trọn gói: Product + Variant) ---

//         await createProduct({
//           // Thông tin Product

//           name: values.name,

//           description: values.description,

//           categoryID: values.categoryID,

//           brandID: values.brandID,

//           // Thông tin Variant đầu tiên

//           price: values.price,

//           stockQuantity: values.stockQuantity,

//           sizeID: values.sizeID,

//           colorID: values.colorID,

//           image: values.image,
//         });

//         message.success("Tạo sản phẩm thành công!");
//       }

//       setIsModalOpen(false);

//       fetchProducts();
//     } catch (error) {
//       console.error(error);

//       message.error("Thất bại! Vui lòng kiểm tra lại dữ liệu.");
//     }
//   };

//   // // --- A. XỬ LÝ XÓA BIẾN THỂ ---

//   // const handleDeleteVariant = async (variantId) => {

//   //   try {

//   //     await deleteProductVariant(variantId);

//   //     message.success("Đã xóa biến thể!");

//   //     // Quan trọng: Refresh lại cái bảng nhỏ (gọi lại API lấy list variants)

//   //     const parentId = editingProduct.productID || editingProduct.ProductID;

//   //     const res = await getVariantsByProductId(parentId);

//   //     setVariantList(res.data);

//   //   } catch (error) {

//   //     message.error("Lỗi khi xóa biến thể!");

//   //   }

//   // };

//   // // --- B. XỬ LÝ MỞ MODAL SỬA BIẾN THỂ ---

//   // const handleOpenEditVariant = (record) => {

//   //   setCurrentVariant(record);

//   //   formVariant.setFieldsValue({

//   //     price: record.price,

//   //     stockQuantity: record.stockQuantity,

//   //   });

//   //   setIsVariantModalOpen(true);

//   // };

//   // // --- C. XỬ LÝ LƯU BIẾN THỂ (Nút OK ở Modal nhỏ) ---

//   // const handleSaveVariant = async () => {

//   //   try {

//   //     const values = await formVariant.validateFields();

//   //     // Gọi API update

//   //     await updateProductVariant(currentVariant.id, {

//   //       price: values.price,

//   //       stockQuantity: values.stockQuantity,

//   //     });

//   //     message.success("Cập nhật giá/kho thành công!");

//   //     setIsVariantModalOpen(false);

//   //     // Refresh lại bảng nhỏ

//   //     const parentId = editingProduct.productID || editingProduct.ProductID;

//   //     const res = await getVariantsByProductId(parentId);

//   //     setVariantList(res.data);

//   //   } catch (error) {

//   //     message.error("Cập nhật thất bại!");

//   //   }

//   // };

//   // --- CẤU HÌNH CỘT BẢNG ---

//   const columns = [
//     { title: "ID", dataIndex: "productID", key: "productID", width: 60 },

//     {
//       title: "Hình ảnh",

//       dataIndex: "images",

//       key: "images",

//       width: 100,

//       render: (images) => {
//         const firstImage = images && images.length > 0 ? images[0] : null;

//         return (
//           <Image
//             width={50}
//             src={
//               firstImage
//                 ? `/Product/${firstImage}`
//                 : "https://via.placeholder.com/50"
//             }
//             fallback="https://via.placeholder.com/50"
//           />
//         );
//       },
//     },

//     {
//       title: "Tên Sản Phẩm",

//       dataIndex: "name",

//       key: "name",

//       render: (text) => <b>{text}</b>,
//     },

//     {
//       title: "Mô tả",

//       dataIndex: "description",

//       key: "description",

//       width: 150,

//       ellipsis: true,
//     },

//     {
//       title: "Danh Mục",

//       dataIndex: "categoryName",

//       key: "categoryName",

//       filters: categories.map((c) => ({ text: c.name, value: c.name })),

//       onFilter: (value, record) => record.categoryName === value,
//     },

//     {
//       title: "Thương Hiệu",

//       dataIndex: "brandName",

//       key: "brandName",

//       width: 120,

//       filters: brands.map((b) => ({ text: b.name, value: b.name })),

//       onFilter: (value, record) => record.brandName === value,
//     },

//     {
//       title: "Size",

//       dataIndex: "sizes",

//       key: "sizes",

//       width: 80,

//       render: (sizes) => (
//         <Space size={[0, 4]} wrap style={{ width: "100%" }}>
//           {sizes?.map((s, index) => (
//             <Tag key={index} color="purple">
//               {s.sizeName}
//             </Tag>
//           ))}
//         </Space>
//       ),
//     },

//     {
//       title: "Màu sắc",

//       dataIndex: "colors",

//       key: "colors",

//       width: 100,

//       render: (colors) => (
//         <Space size={[0, 8]} wrap>
//           {colors?.map((c, index) => (
//             <Tag key={index} color="blue">
//               {c.colorName}
//             </Tag>
//           ))}
//         </Space>
//       ),
//     },

//     {
//       title: "Giá",

//       dataIndex: "prices",

//       key: "prices",

//       width: 120,

//       render: (prices) => {
//         if (!prices || prices.length === 0) return "Liên hệ";

//         const min = Math.min(...prices);

//         const max = Math.max(...prices);

//         return min === max ? (
//           <span style={{ color: "#d4380d", fontWeight: "bold" }}>
//             {min.toLocaleString()} đ
//           </span>
//         ) : (
//           <span style={{ color: "#d4380d", fontWeight: "bold" }}>
//             {min.toLocaleString()} - {max.toLocaleString()} đ
//           </span>
//         );
//       },
//     },

//     {
//       title: "Hành động",

//       key: "action",

//       render: (_, record) => {
//         // Lấy ID an toàn (xử lý hoa/thường)

//         const id = record.productID || record.ProductID;

//         return (
//           <Space>
//             <Button
//               icon={<EditOutlined />}
//               size="small"
//               className="action-btn-edit"

//               // onClick={() => handleOpenEditVariant(record)}
//             >
//               Sửa
//             </Button>

//             <Popconfirm
//               title="Xóa sản phẩm?"
//               description="Hành động này sẽ xóa tất cả size/màu liên quan!"
//               onConfirm={() => handleDelete(id)}
//               okText="Xóa"
//               cancelText="Hủy"
//             >
//               <Button
//                 danger
//                 icon={<DeleteOutlined />}
//                 size="small"
//                 className="action-btn-delete"
//               >
//                 Xóa
//               </Button>
//             </Popconfirm>
//           </Space>
//         );
//       },
//     },
//   ];

//   return (
//     <div>
//       <div className="product-page-header">
//         <h2>Quản lý sản phẩm</h2>

//         {/* Nút thêm mới gọi hàm handleAddNew */}

//         <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
//           Thêm mới
//         </Button>
//       </div>

//       <Table
//         columns={columns}
//         dataSource={data}
//         // Fix lỗi rowKey: Nhận cả productID (thường) và ProductID (hoa)

//         rowKey={(record) => record.productID || record.ProductID}
//         loading={loading}
//         pagination={{ pageSize: 6 }}
//       />

//       {/* --- MODAL FORM (THÊM / SỬA) --- */}

//       <Modal
//         title={
//           editingProduct ? "Cập nhật thông tin chung" : "Thêm sản phẩm mới"
//         }
//         open={isModalOpen}
//         onOk={handleSave}
//         onCancel={() => setIsModalOpen(false)}
//         width={800} // Form rộng ra cho dễ nhìn
//         okText="Lưu"
//         cancelText="Hủy"
//       >
//         <Form form={form} layout="vertical">
//           {/* Hàng 1: Tên + Ảnh */}

//           <div style={{ display: "flex", gap: "16px" }}>
//             <Form.Item
//               name="name"
//               label="Tên sản phẩm"
//               style={{ flex: 1 }}
//               rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
//             >
//               <Input placeholder="Nhập tên sản phẩm..." />
//             </Form.Item>

//             {/* Chỉ hiện nhập ảnh khi thêm mới, khi sửa thì logic khác */}

//             {!editingProduct && (
//               <Form.Item
//                 name="image"
//                 label="Tên file ảnh"
//                 style={{ flex: 1 }}
//                 rules={[{ required: true, message: "Nhập tên file ảnh!" }]}
//               >
//                 <Input placeholder="VD: nike.png (trong public/Product)" />
//               </Form.Item>
//             )}
//           </div>

//           <Form.Item name="description" label="Mô tả">
//             <Input.TextArea rows={2} />
//           </Form.Item>

//           {/* Hàng 2: Danh mục + Thương hiệu */}

//           <div style={{ display: "flex", gap: "16px" }}>
//             <Form.Item
//               name="categoryID"
//               label="Danh mục"
//               style={{ flex: 1 }}
//               rules={[{ required: true, message: "Chọn danh mục!" }]}
//             >
//               <Select placeholder="Chọn danh mục">
//                 {categories.map((c) => (
//                   <Select.Option key={c.id} value={c.id}>
//                     {c.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item
//               name="brandID"
//               label="Thương hiệu"
//               style={{ flex: 1 }}
//               rules={[{ required: true, message: "Chọn thương hiệu!" }]}
//             >
//               <Select placeholder="Chọn thương hiệu">
//                 {brands.map((b) => (
//                   <Select.Option key={b.id} value={b.id}>
//                     {b.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </div>

//           {/* --- PHẦN NHẬP BIẾN THỂ (Chỉ hiện khi THÊM MỚI) --- */}

//           {!editingProduct && (
//             <>
//               <p
//                 style={{
//                   fontWeight: "bold",

//                   borderBottom: "1px solid #eee",

//                   paddingBottom: 5,

//                   marginTop: 20,

//                   color: "#1677ff",
//                 }}
//               >
//                 Thông tin bán hàng (Size & Giá)
//               </p>

//               <div style={{ display: "flex", gap: "16px" }}>
//                 <Form.Item
//                   name="sizeID"
//                   label="Size"
//                   style={{ flex: 1 }}
//                   rules={[{ required: true, message: "Chọn Size!" }]}
//                 >
//                   <Select placeholder="Chọn Size">
//                     {sizes.map((s) => (
//                       <Select.Option key={s.id} value={s.id}>
//                         {s.name}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   name="colorID"
//                   label="Màu sắc"
//                   style={{ flex: 1 }}
//                   rules={[{ required: true, message: "Chọn Màu!" }]}
//                 >
//                   <Select placeholder="Chọn Màu">
//                     {colors.map((c) => (
//                       <Select.Option key={c.id} value={c.id}>
//                         {c.name}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </div>

//               <div style={{ display: "flex", gap: "16px" }}>
//                 <Form.Item
//                   name="price"
//                   label="Giá bán (VNĐ)"
//                   style={{ flex: 1 }}
//                   rules={[{ required: true, message: "Nhập giá!" }]}
//                 >
//                   <InputNumber
//                     style={{ width: "100%" }}
//                     formatter={(value) =>
//                       `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//                     }
//                     parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
//                   />
//                 </Form.Item>

//                 <Form.Item
//                   name="stockQuantity"
//                   label="Số lượng tồn"
//                   style={{ flex: 1 }}
//                   rules={[{ required: true, message: "Nhập số lượng!" }]}
//                 >
//                   <InputNumber style={{ width: "100%" }} min={0} />
//                 </Form.Item>
//               </div>
//             </>
//           )}

//           {/* {editingProduct && (

//             <div style={{ marginTop: 20 }}>

//               <p

//                 style={{

//                   fontWeight: "bold",

//                   color: "#1677ff",

//                   borderBottom: "1px solid #ddd",

//                   paddingBottom: 5,

//                 }}

//               >

//                 Danh sách biến thể hiện có

//               </p>

//               <Table

//                 dataSource={variantList}

//                 rowKey="id" // ID của bảng ProductVariant

//                 pagination={false} // Bảng nhỏ không cần phân trang

//                 size="small"

//                 bordered

//                 columns={[

//                   { title: "Size", dataIndex: "sizeName", key: "sizeName" },

//                   { title: "Màu", dataIndex: "colorName", key: "colorName" },

//                   {

//                     title: "Giá tiền",

//                     dataIndex: "price",

//                     key: "price",

//                     render: (price) => price.toLocaleString(),

//                   },

//                   {

//                     title: "Tồn kho",

//                     dataIndex: "stockQuantity",

//                     key: "stockQuantity",

//                   },

//                   {

//                     title: "Hành động",

//                     render: (_, record) => (

//                       <Button

//                         type="link"

//                         size="small"

//                         danger

//                         onClick={() =>

//                           message.info("Chức năng sửa dòng này đang làm...")

//                         }

//                       >

//                         Sửa giá/kho

//                       </Button>

//                     ),

//                   },

//                 ]}

//               />

//               <Button

//                 type="dashed"

//                 style={{ marginTop: 10, width: "100%" }}

//                 icon={<PlusOutlined />}

//               >

//                 Thêm biến thể mới (Size/Màu khác)

//               </Button>

//             </div>

//           )} */}
//         </Form>
//       </Modal>

//       {/* <Modal

//         title="Cập nhật Biến thể"

//         open={isVariantModalOpen}

//         onOk={handleSaveVariant}

//         onCancel={() => setIsVariantModalOpen(false)}

//         width={400}

//         zIndex={1001} // Quan trọng: Để nó nổi lên trên Modal to

//       >

//         <Form form={formVariant} layout="vertical">

//           <Form.Item

//             name="price"

//             label="Giá tiền mới"

//             rules={[{ required: true }]}

//           >

//             <InputNumber

//               style={{ width: "100%" }}

//               formatter={(value) =>

//                 `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

//               }

//               parser={(value) => value.replace(/\$\s?|(,*)/g, "")}

//             />

//           </Form.Item>

//           <Form.Item

//             name="stockQuantity"

//             label="Tồn kho mới"

//             rules={[{ required: true }]}

//           >

//             <InputNumber style={{ width: "100%" }} />

//           </Form.Item>

//         </Form>

//       </Modal> */}
//     </div>
//   );
// };

// export default ProductManager;
