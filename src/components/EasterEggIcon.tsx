/** 彩蛋图标：装饰彩蛋（花纹圆点 + 裂纹 + 高光），区别于普通鸡蛋 */
export function EasterEggIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* 蛋身 */}
      <path
        d="M12 2.6c3.1 0 5.7 3.2 5.7 7.1 0 4-2.5 8.7-5.7 8.7S6.3 13.7 6.3 9.7C6.3 5.8 8.9 2.6 12 2.6Z"
        fill="#a78bfa"
        stroke="#7c3aed"
        strokeWidth="1.2"
      />
      {/* 花纹圆点 */}
      <circle cx="9.1" cy="8.8" r="1.05" fill="#f472b6" />
      <circle cx="14.7" cy="7.2" r="0.85" fill="#fbbf24" />
      <circle cx="14.3" cy="12.6" r="0.95" fill="#34d399" />
      <circle cx="9.6" cy="13.6" r="0.7" fill="#60a5fa" />
      {/* 裂纹 */}
      <path
        d="M10.2 6.4 11.4 8.9 10.4 11 11.7 13.2"
        stroke="#ffffff"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* 高光 */}
      <path
        d="M9.7 5c.5-.35 1-.55 1.55-.62"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}
