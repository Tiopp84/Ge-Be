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

## Ghi chú

- API này stateless: không lưu file/DB trên ổ server.
- Không upload PDF/audio qua API; dùng signed URL của Supabase Storage.
- Service role key chỉ nằm ở server, không gửi xuống frontend.
- Chưa có auth/import/publish — sẽ bổ sung theo `docs/implementation-plan.md`.
