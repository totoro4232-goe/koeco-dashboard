# 🧭 대한민국 경제 나침반 (KoEco Dashboard)
기준금리, 원/달러 환율, 소비자물가지수(CPI)를 한 화면에서 확인하는 경제 지표 대시보드입니다.
## 주요 기능
- 기준금리 / 원달러 환율 / CPI 요약 카드
- 기간 필터 (6개월, 1년, 3년)
- 상세 페이지 및 차트 시각화 (Recharts)
- 서버 사이드 데이터 호출 + 캐싱 (`revalidate: 3600`)
## 기술 스택
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- npm
## 환경변수
프로젝트 루트에 `.env.local` 파일 생성:
```env
ECOS_API_KEY=your_ecos_api_key
KOSIS_API_KEY=your_kosis_api_key
로컬 실행
npm install
npm run dev
브라우저: http://localhost:3000

배포 (Vercel)
Vercel 프로젝트 환경변수에 아래 2개를 등록해야 정상 동작합니다.

ECOS_API_KEY
KOSIS_API_KEY
라이선스
MIT
