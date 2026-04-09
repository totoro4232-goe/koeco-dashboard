# koeco-dashboard
# 🧭 대한민국 경제 나침반 (KoEco Dashboard)
기준금리, 원/달러 환율, 소비자물가지수(CPI)를 한 화면에서 확인할 수 있는 경제 지표 대시보드입니다.  
데이터는 한국은행 ECOS, 통계청 KOSIS(OpenAPI)를 기반으로 조회합니다.
---
## ✨ 주요 기능
- 핵심 지표 요약 카드
  - 기준금리 (BOK)
  - 원/달러 환율 (BOK)
  - 소비자물가지수 (KOSIS/대체 소스)
- 기간 필터
  - 6개월 / 1년 / 3년
- 상세 페이지
  - 기준금리 상세
  - 환율 상세 (USD/JPY/EUR 탭)
  - CPI 상세
- 차트 시각화 (Recharts)
  - 라인 차트
  - 막대+라인 혼합 차트
- 서버 사이드 데이터 호출 + 캐싱(`revalidate: 3600`)
---
## 🛠 기술 스택
- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Recharts
- npm
---
## 📁 프로젝트 구조
```text
koeco-dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── detail/
│   │   │   ├── interest-rate/page.tsx
│   │   │   ├── exchange-rate/page.tsx
│   │   │   └── cpi/page.tsx
│   ├── components/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── ecos.ts
│   │   │   └── kosis.ts
│   │   └── utils/
│   └── types/
└── ...
⚙️ 환경변수
루트에 .env.local 파일을 만들고 아래 값을 설정하세요.

ECOS_API_KEY=your_ecos_api_key
KOSIS_API_KEY=your_kosis_api_key
참고:

.env.local은 로컬 전용 파일이며 Git에 커밋하지 않습니다.
배포(Vercel)에서는 프로젝트 환경변수에 동일 키를 등록해야 합니다.
🚀 로컬 실행
npm install
npm run dev
브라우저에서 http://localhost:3000 접속

🌐 배포
Vercel 배포 시 아래를 꼭 설정하세요.

Environment Variables
ECOS_API_KEY
KOSIS_API_KEY
적용 환경
Production / Preview / Development
🧪 문제 해결 (Troubleshooting)
1) 값이 0 또는 데이터가 없습니다가 뜰 때
환경변수가 올바른지 확인
dev 서버 재시작
기간 필터 변경 후 재확인
2) KOSIS 인증 오류가 뜰 때
KOSIS 키 활성 상태/권한 재확인
키 문자열 앞뒤 공백/개행 여부 확인
Vercel 환경변수에 정확히 반영했는지 확인
3) PowerShell에서 npm 실행 정책 오류가 뜰 때
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
📌 TODO (선택)
지표별 데이터 소스 상태 배지 표시
API 실패 시 사용자 안내 메시지 개선
테스트 코드 추가 (unit/integration)
접근성/반응형 개선
📄 라이선스
MIT

원하면 이 템플릿을 네 프로젝트 상황(실제 배포 URL, 스크린샷 섹션, 작성자 정보)까지 맞춰서 커스터마이즈 버전으로 바로 바꿔드릴게요.

