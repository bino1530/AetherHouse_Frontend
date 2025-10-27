# Aether House – Frontend (React/Vite)

Repo **Frontend** cho hệ thống e‑commerce Aether House. Giao diện người dùng dùng **React + Vite + Bootstrap 5 (CSS thường)** và gọi API từ Backend.

Hỗ trợ: duyệt danh mục, danh sách/chi tiết sản phẩm, biến thể (màu/hex), giỏ hàng, checkout, voucher, hồ sơ & lịch sử đơn hàng (read/write qua API).

## Mục lục
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt nhanh](#cài-đặt-nhanh)
- [Biến môi trường](#biến-môi-trường)
- [Scripts thường dùng](#scripts-thường-dùng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Luồng tính năng chính](#luồng-tính-năng-chính)
- [Ghi chú phát triển](#ghi-chú-phát-triển)
- [Khắc phục sự cố](#khắc-phục-sự-cố)
- [Giấy phép](#giấy-phép)

---

## Yêu cầu hệ thống
- Node.js **>= 18** (khuyến nghị **20/22**)
- npm hoặc pnpm/yarn
- **API** đang chạy tại `http://localhost:3000` (để Frontend gọi dữ liệu)

## Cài đặt nhanh
```bash
# 1) Clone & cài deps
git clone <YOUR_FE_REPO_URL>
cd <YOUR_FE_DIR>
npm install

# 2) Tạo .env (1 dòng duy nhất)
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# 3) Chạy dev cổng 8000
npm run dev -- --port 8000
```
Mở: http://localhost:8000

> Nhớ cấu hình CORS ở API cho origin `http://localhost:8000`.

## Yêu cầu hệ thống
- Node.js **>= 18** (khuyến nghị **20/22**)
- npm hoặc pnpm/yarn
- Backend đang chạy ở `http://localhost:3000`

## Cài đặt nhanh
```bash
# 1) Clone & cài deps
git clone <YOUR_FE_REPO_URL>
cd <YOUR_FE_DIR>
npm install

# 2) Tạo .env (1 dòng duy nhất)
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# 3) Chạy dev cổng 8000
npm run dev -- --port 8000
```
Mở trình duyệt: http://localhost:8000

> Nhớ bật CORS ở Backend cho origin `http://localhost:8000`.

## Biến môi trường
**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Scripts thường dùng
- `dev` – chạy Vite dev server (thêm `--port 8000`)


## Cấu trúc thư mục
```
AETHERHOUSE_FRONTEND/
├─ public/
│  └─ (favicon, assets tĩnh)
├─ src/
│  ├─ components/       # Header, Footer, ProductCard, Modal, Pagination…
│  ├─ Layouts/          # MainLayout, layout khác nếu có
│  ├─ lib/              # axios instance, helpers, hooks
│  ├─ pages/            # Home, Category, ProductDetail, Cart, Checkout, Profile…
│  ├─ App.css
│  ├─ App.jsx
│  └─ main.jsx          # entry Vite; mount React + import Bootstrap
├─ .env                 # VITE_API_BASE_URL=http://localhost:3000/api
├─ index.html
├─ vite.config.js
├─ package.json
└─ README.md
```

### Gợi ý import Bootstrap trong entry
```js
// src/main.jsx
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
```

## Luồng tính năng chính
- **Danh mục & tìm kiếm**: trang danh sách có filter/sort/pagination
- **Chi tiết sản phẩm**: biến thể màu (hex), gallery ảnh (URL từ backend/Cloudinary)
- **Giỏ hàng & Checkout**: lưu localStorage + state, áp mã voucher
- **Hồ sơ**: xem/sửa thông tin, địa chỉ mặc định, lịch sử đơn hàng

## Ghi chú phát triển
- **HTTP**: tạo `axiosInstance` với `baseURL = import.meta.env.VITE_API_BASE_URL`
- **Routing**: SPA (React Router); khi deploy nhớ cấu hình fallback `index.html`
- **Style**: ưu tiên class Bootstrap + CSS thường cho tùy biến
- **State**: đồng bộ giỏ hàng giữa state và `localStorage`

## Khắc phục sự cố
**1) CORS blocked**
- Backend phải whitlelist `http://localhost:8000`

**2) 404 khi F5**
- Bật SPA fallback về `index.html` trên host

**3) Ảnh không hiện**
- Kiểm tra URL ảnh trả về từ API, kiểm tra tab Network

**4) 401/403**
- Kiểm tra token (Bearer) khi gọi API cần auth

## Giấy phép
MIT © Aether House Team

