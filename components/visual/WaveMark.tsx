export default function WaveMark({ className = "" }: { className?: string }) {
  return (
    <svg className={`wave-mark ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 2 30 16 16 30 2 16 16 2Z" stroke="currentColor" strokeWidth="1.25" />
      <path d="m8 17 5-5 6 8 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
