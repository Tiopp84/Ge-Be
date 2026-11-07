export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Chuẩn hóa Unicode NFC và khoảng trắng, giữ nguyên ä/ö/ü/ß. */
export function normalizeGerman(value: string) {
  return value.normalize("NFC").replace(/\s+/g, " ").trim();
}

/** So sánh không phân biệt hoa thường nhưng vẫn giữ biến âm tiếng Đức. */
export function normalizeForCompare(value: string) {
  return normalizeGerman(value).toLocaleLowerCase("de-DE");
}

export function stripTrailingPunctuation(value: string) {
  return value.replace(/[.,!?;:]+$/u, "");
}

export function wordCount(value: string) {
  return normalizeGerman(value).split(" ").filter(Boolean).length;
}

/** Shuffle ổn định để SSR và client cho cùng kết quả. */
export function shuffleStable<T>(items: T[], seed: string): T[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const next = () => {
    hash += 0x6d2b79f5;
    let t = hash;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function formatRelativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
