'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-bg-primary/85 backdrop-blur-md border-b border-border h-[60px] flex items-center justify-between px-8">
      <Link href="/" className="flex items-center gap-2.5 font-bold text-base tracking-tight">
        <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center text-sm">🧭</div>
        대한민국 경제 나침반
      </Link>
      <div className="font-mono text-xs text-gray-500 flex items-center gap-2">
        <span className="w-[7px] h-[7px] rounded-full bg-up animate-pulse-dot inline-block" />
        {time ? `마지막 갱신: ${time}` : '불러오는 중...'}
      </div>
    </header>
  );
}
