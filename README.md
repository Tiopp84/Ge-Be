# Language BE

Backend Express API của hệ thống học tiếng Đức.

- Runtime: Node.js 20+
- Framework: Express + TypeScript
- Database/Auth/Storage: Supabase
- Deploy: server riêng (Docker)
- Frontend: repo `fe/`
- Tài liệu chung: xem thư mục `docs/` ở workspace root

## Chạy local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mặc định API chạy ở `http://localhost:4000`.

## Scripts

```bash
npm run dev        # tsx watch
npm run build      # biên dịch TypeScript
npm run start      # chạy dist
npm run typecheck  # tsc --noEmit
```

## Health check

```text
GET /health
GET /v1/health
```

## Supabase Auth

Cần đặt trong `.env.local`:

```bash
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=<anon-key>

# Tùy chọn: URL công khai của FE cho link xác nhận email.
# Để trống -> dùng Site URL trong Supabase Auth settings.
APP_PUBLIC_URL=http://localhost:3000
```

Endpoints hiện có:

```text
POST /v1/auth/register { email, password }
POST /v1/auth/login    { email, password }
POST /v1/auth/refresh  { refreshToken }
POST /v1/auth/logout   Authorization: Bearer <access-token>
GET  /v1/auth/me       Authorization: Bearer <access-token>
```

Login/refresh trả về `user` và `session` (access/refresh token). Backend không lưu
session; client chịu trách nhiệm giữ token. Logout thu hồi session hiện tại qua
Supabase GoTrue, không cần service role key.

### Đăng ký user thường

`POST /v1/auth/register` nhận `email` và `password` (8–72 ký tự). Tài khoản mới
luôn có role `user`: client không thể tự đặt `app_metadata.role` bằng anon key.

- **Supabase bật “Confirm email”**: response `201` có `session: null` và
  `requiresEmailConfirmation: true`. FE hiển thị hướng dẫn kiểm tra email; user
  phải bấm link xác nhận rồi đăng nhập.
- **Supabase tắt “Confirm email”**: response `201` có `session`, FE đăng nhập
  ngay và lưu token như luồng login.
- **Email đã tồn tại**: trả `409 email_already_registered` khi Supabase trả lỗi rõ
  ràng. Khi bật “Confirm email”, Supabase có thể che dấu sự tồn tại và trả về
  `201` giống email mới để tránh dò tài khoản.
- **Quá nhiều yêu cầu**: trả `429 rate_limited` (giới hạn theo IP) hoặc
  `429 email_rate_limited` (giới hạn gửi email của project) kèm `Retry-After`.

Ví dụ response khi cần xác nhận email:

```json
{
  "user": {
    "id": "uuid",
    "email": "ban@gmail.com",
    "emailConfirmedAt": null,
    "createdAt": "2026-11-13T00:00:00Z",
    "role": "user"
  },
  "session": null,
  "requiresEmailConfirmation": true
}
```

Để link xác nhận quay về đúng FE, cấu hình trong Supabase Dashboard →
**Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (local) hoặc domain FE.
- **Redirect URLs**: thêm `http://localhost:3000/**` và `https://<domain-fe>/**`
  (hoặc URL chính xác `.../login?confirmed=1`).

Nếu đặt `APP_PUBLIC_URL`, backend dùng
`${APP_PUBLIC_URL}/login?confirmed=1` làm `emailRedirectTo`. Nếu không, Supabase
dùng Site URL. Trang `/login` hiển thị thông báo khi có `?confirmed=1`.

Email chưa xác nhận không đăng nhập được; login trả `403 email_not_confirmed`
thay vì báo sai mật khẩu.

### Giới hạn gửi email xác nhận

Khi bật “Confirm email”, Supabase Auth dùng email provider mặc định (hosted) có
giới hạn **2 email/giờ cho toàn project** và chỉ gửi được tới email của thành viên
trong organization. Quá giới hạn, Supabase trả `429 over_email_send_rate_limit`;
backend map thành:

```json
{
  "error": {
    "code": "email_rate_limited",
    "message": "Supabase đã đạt giới hạn 2 email xác nhận/giờ…"
  }
}
```

với `Retry-After: 3600`.

Cách xử lý:

- **Chờ**: giới hạn theo cửa sổ 1 giờ, không có nút reset; chờ tối đa khoảng 1 giờ.
- **Cấu hình custom SMTP** (Resend, Brevo, Mailtrap, Gmail SMTP…) hoặc Send Email
  hook trong Supabase Dashboard → Authentication → SMTP; sau đó tăng
  `rate_limit_email_sent` tại Authentication → Rate Limits.
- **Test local**: dùng Supabase CLI + Mailpit, không có giới hạn email/giờ và mặc
  định tắt confirm email. Trỏ `SUPABASE_URL`/`SUPABASE_ANON_KEY` trong `be/.env`
  sang local stack.
- **Chỉ khi dev**: có thể tắt “Confirm email” tạm thời, nhưng phải bật lại trước
  khi production vì tắt sẽ bỏ giới hạn email và cho phép đăng ký email không sở hữu.

Tham khảo: [Supabase Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits),
[Test auth flows](https://supabase.com/docs/guides/auth/testing-auth-flows).

### Phân quyền admin

Role lấy từ `app_metadata.role` của Supabase Auth (không dùng `user_metadata`,
vì user có thể tự sửa metadata đó).

Đặt role admin bằng Admin API (chạy local, dùng `sb_secret_...`, không đưa key
vào FE):

```bash
curl -X PUT "https://<project-ref>.supabase.co/auth/v1/admin/users/<user-id>" \
  -H "apikey: <service-role-key>" \
  -H "Authorization: Bearer <service-role-key>" \
  -H "Content-Type: application/json" \
  -d '{"app_metadata":{"role":"admin"}}'
```

Sau đó login/refresh lại. Kiểm tra:

```text
GET /v1/auth/me
GET /v1/auth/admin-check
```

- `/me` trả thêm `user.role`.
- `/admin-check` trả `403 forbidden` nếu không phải admin, `200` nếu là admin.

Khi có bảng `profiles`, có thể chuyển role sang `profiles.role` và dùng RLS.

## Ghi chú

- API này stateless: không lưu file/DB trên ổ server.
- Không upload PDF/audio qua API; dùng signed URL của Supabase Storage.
- Service role key chỉ nằm ở server, không gửi xuống frontend.
- Đã có auth (login, register, refresh, logout) và role admin; chưa có
  import/publish — sẽ bổ sung theo `docs/implementation-plan.md`.
