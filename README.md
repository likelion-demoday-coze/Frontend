<div align="center">
  <img src="src/assets/logos/coze_text_logo_black.svg" width="180" alt="COZ:E" />

  <h1>COZ:E Frontend 🐱📈</h1>

  <p>
    <strong>하루 5분, 경제 지식이 내 주가가 되는 곳</strong><br />
    <em>Climb On, Zero to Economy</em>
  </p>

  <p>
    <a href="https://www.coze.kids">🎮 서비스</a> ·
    <a href="https://api.coze.kids/swagger-ui/index.html">📘 API 명세</a> ·
    <a href="https://pf.kakao.com/_ngMWX">💬 카카오 채널</a> ·
    <a href="https://www.instagram.com/cozeconomy/">📸 인스타그램</a>
  </p>
</div>

---

COZ:E는 경제 퀴즈를 풀며 가상의 주가와 고양이 캐릭터를 성장시키는 경제 학습 서비스입니다. 정규장 퀴즈, 시간외거래 타임어택, 경제 트렌드, 연속 학습과 랭킹을 통해 매일 경제와 친해지는 경험을 제공합니다.

홍익대학교 멋쟁이사자처럼 데모데이 프로젝트의 프론트엔드 저장소입니다. 주가와 FISH는 서비스 내 학습용 수치이며, 실제 투자 상품이나 현금성 자산이 아닙니다.

## 📚 목차

- [🎮 주요 기능](#features)
- [🛠️ 기술 스택](#tech-stack)
- [🚀 로컬 실행](#getting-started)
- [⚙️ 환경변수](#environment)
- [💻 스크립트](#scripts)
- [📁 프로젝트 구조](#project-structure)
- [🗺️ 주요 경로](#routes)
- [🧩 주요 구현](#implementation)
- [📊 GA4 측정](#analytics)
- [☁️ 배포 및 운영 설정](#deployment)
- [🤝 협업 규칙](#contributing)

<a name="features"></a>

## 🎮 주요 기능

| 기능 | 설명 |
| --- | --- |
| ⏳ **랜딩·커밍순** | 서비스 소개, 오픈 카운트다운, 오픈 시각에 따른 공개 화면 전환 |
| 💬 **카카오 로그인·회원가입** | 세션 인증, 닉네임 중복 확인·문자 검증, 만 14세 이상 확인 |
| 👋 **온보딩** | 6단계 튜토리얼과 가입 보상 안내 |
| 📈 **정규장** | 8개 경제 카테고리의 5문제 풀이, 정답·해설, 오답 다시 풀기와 결과 차트 |
| ⚡ **시간외거래** | 1분 타임어택, 정답·연속 정답 집계, 결과와 일일 랭킹 |
| 🧪 **맛보기 퀴즈** | 비로그인 사용자의 문제 체험과 정답·해설 확인 |
| 📰 **경제 트렌드** | 라이너 API를 활용해 서버에서 제공하는 경제 이슈 요약, 관련 용어와 출처 기사 |
| 🐱 **캐릭터 성장** | 아기냥 → 초보냥 → 큰손냥 → 왕족냥, 진화 안내 팝업 |
| 🔥 **연속 학습** | 요일별 학습 상태, 최고 기록, 이펙트 트리, 하락·복구 안내 |
| 🏆 **랭킹** | 정규장·시간외거래 순위, 내 순위 고정 표시, 순위 분석 패널과 보상 확인 |
| 🛍️ **상점** | 1주일 패스 결제, FISH를 이용한 복구권 교환, 판매 마감 안내 |
| 👤 **마이페이지** | 프로필·닉네임 수정, 보유 자산, 학습 기록, 패스 기간, 결제·FISH 내역과 환불 |

### 🎁 학습과 보상

- 정규장 카테고리는 거시경제, 금융시장, 주식·투자, 금리·채권, 환율·국제경제, 부동산, 기업·재무, 생활경제입니다.
- 일반 입장 비용은 정규장 FISH 50개, 시간외거래 FISH 100개이며, 패스 적용 시 차감하지 않습니다.
- 가입 보상과 오늘의 출석 보상은 구분해 안내합니다. 실제 지급 여부와 잔액은 서버 응답을 기준으로 표시합니다.
- 시간외거래의 `remainingAttemptCount`가 `null`이면 횟수 제한 없이 입장할 수 있습니다. 숫자로 반환되면 서버가 제공한 일일 제한을 적용합니다. 무제한 입장 여부와 FISH 차감 여부는 별개입니다.
- 주가 반영 횟수, 실제 주가 변화, 순위와 보상 지급은 서버가 결정합니다.

### 🐾 캐릭터와 연속 학습

캐릭터 단계는 `BABY`(아기냥), `BASIC`(초보냥), `BIG_HAND`(큰손냥), `ROYAL`(왕족냥)로 구분합니다. 서버의 캐릭터 상태를 조회하고, 주가로 프로필을 선택하는 화면은 [캐릭터 상수](src/constants/character.ts)를 사용합니다.

| 연속 학습 | 이펙트 | 서버 코드 |
| --- | --- | --- |
| 2일 | 발자국 | `PAW_PRINT` |
| 3일 | 동전 | `GLOWING_BASE` |
| 5일 | 깃털 | `FEATHER` |
| 7일 | 은화 | `AURA` |
| 10일 | 은행잎 | `GINKGO_LEAF` |
| 14일 | 금화 | `GOLDEN_HALO` |
| 17일 | 황금꽃 | `GOLDEN_FLOWER` |
| 21일 | 시크릿 | `COIN_BACKGROUND` |

요일별 완료·미완료·복구 대기·복구 완료 상태는 서버 응답을 화면용 상태로 변환합니다. 홈 고양이 배경은 캐릭터 API에서 반환하는 이펙트에 맞춰 표시합니다.

<a name="tech-stack"></a>

## 🛠️ 기술 스택

버전 계열은 `package.json` 기준이며, 재현 가능한 설치에는 `package-lock.json`을 사용합니다.

| 영역 | 기술 |
| --- | --- |
| UI | React 19, TypeScript 6 |
| 개발·빌드 | Vite 8, npm |
| 라우팅 | React Router 7 |
| 스타일 | Tailwind CSS 4 |
| 공유 상태 | Zustand 5 |
| HTTP 통신 | Axios 1 |
| 주가 차트 | Recharts 3 |
| 아이콘·SVG | Lucide React, vite-plugin-svgr |
| 분석 | GA4, react-ga4 |
| 코드 검사·포맷 | ESLint, Prettier |
| 배포 | Vercel |

<a name="getting-started"></a>

## 🚀 로컬 실행

Node.js **24.x**를 권장합니다. 22.x를 사용한다면 ESLint를 포함한 도구 호환성을 위해 **22.13 이상**을 사용합니다. 저장소에 설치된 Vite 8의 Node.js 지원 범위는 `^20.19.0 || >=22.12.0`, ESLint 10은 `^20.19.0 || ^22.13.0 || >=24`입니다.

```bash
git clone https://github.com/likelion-demoday-t4/Frontend.git
cd Frontend
npm ci
cp .env.example .env
```

`.env`를 아래 [환경변수](#environment)에 맞게 작성한 뒤 실행합니다. 이미 `.env`가 있다면 복사 명령으로 덮어쓰지 않도록 주의합니다.

```bash
npm run dev
```

기본 개발 주소는 `http://localhost:3000`입니다. 포트를 사용 중이면 Vite가 다른 포트로 실행될 수 있으므로 터미널에 출력된 주소를 확인합니다.

회원 기능을 사용하려면 백엔드 연결과 유효한 세션이 필요합니다. 카카오 로그인과 결제 복귀 주소는 서버 설정을 따르므로, 로컬에서 시작해도 서버 설정에 따라 운영 사이트로 복귀할 수 있습니다.

<a name="environment"></a>

## ⚙️ 환경변수

현재 프론트 코드에서 실제로 사용하는 환경변수는 다음 세 가지입니다.

```dotenv
VITE_API_URL=https://api.coze.kids
VITE_PAYMENT_ENABLED=false
VITE_GA_MEASUREMENT_ID=
```

| 변수 | 용도 | 설정 |
| --- | --- | --- |
| `VITE_API_URL` | API 요청과 카카오 로그인 시작 주소의 기준 URL | 연결할 백엔드 주소, 끝의 `/`는 생략 |
| `VITE_PAYMENT_ENABLED` | 결제 주문 생성·취소 기능 사용 여부 | 정확히 소문자 `true`인 경우에만 활성화 |
| `VITE_GA_MEASUREMENT_ID` | GA4 측정 ID | 분석을 사용할 경우 `G-...` 값 입력 |

- 기존 `.env.example`의 `VITE_REST_API_KEY`, `VITE_KAKAO_REDIRECT_URI`는 현재 프론트 코드에서 읽지 않습니다. 카카오 OAuth 흐름은 백엔드 로그인 시작 주소를 통해 진행합니다.
- `VITE_` 변수는 클라이언트 번들에 포함됩니다. PayApp 비밀키, 카카오 클라이언트 시크릿, 서버 인증 정보는 넣지 않습니다.
- `VITE_PAYMENT_ENABLED=true`는 프론트 기능 허용 조건입니다. 서버의 결제 활성화·상품 상태·판매 기간도 충족해야 실제 결제가 가능합니다.
- Vercel에도 환경별로 변수를 등록해야 합니다. 값 변경 후에는 다시 빌드·배포해야 적용됩니다.
- 로컬 `.env` 변경 후에는 개발 서버를 재시작합니다.

<a name="scripts"></a>

## 💻 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | `tsc -b`로 타입 검사 후 Vite 프로덕션 빌드 |
| `npm run preview` | 생성된 `dist`의 로컬 미리보기 |
| `npm run lint` | ESLint 검사 |
| `npx tsc -b` | 프로젝트 참조를 포함한 타입 검사 |

현재 `test` 스크립트와 자동화 테스트 러너는 등록되어 있지 않습니다. 변경 후에는 관련 화면·상태를 직접 확인하고 타입·린트·빌드 결과를 함께 확인합니다. 결제·환불·아이템 구매 검증은 실제 금액과 재화가 변경될 수 있으므로 승인된 테스트 환경에서 진행합니다.

<a name="project-structure"></a>

## 📁 프로젝트 구조

```text
.
├── public/                 # 파비콘, OG 이미지, 홈 화면 아이콘, manifest
├── src/
│   ├── api/                # 도메인별 API 함수, Axios·CSRF 공통 처리
│   ├── assets/             # 캐릭터, 카테고리, 아이콘, 배경 이미지
│   ├── components/
│   │   ├── common/         # 공통 제목·UI
│   │   ├── guards/         # 회원·비회원 라우트 가드
│   │   ├── home/           # 주가·캐릭터·트렌드·스트릭·내 랭킹
│   │   ├── landing/        # 랜딩·커밍순 소개 섹션
│   │   ├── layouts/        # 공통 레이아웃, PC·모바일 네비게이션
│   │   ├── mypage/         # 프로필·자산·이용 내역·설정
│   │   ├── payment/        # 결제 확인·결과·상세·패스 안내 팝업
│   │   ├── quiz/           # 문제·선택지·학습 팝업
│   │   ├── ranking/        # 랭킹 목록·분석 패널·배너·보상
│   │   ├── shop/           # 상품 카드·복구권 교환 팝업
│   │   └── tutorial/       # 튜토리얼과 단계별 설명 UI
│   ├── constants/          # 경로·카테고리·캐릭터·이펙트·운영 상수
│   ├── hooks/              # 입장·학습·결제·랭킹·팝업 상태 흐름
│   ├── lib/                # GA4 초기화·페이지·이벤트 추적
│   ├── mocks/              # 개발용 예시 데이터
│   ├── pages/              # 라우트별 페이지
│   ├── stores/             # Zustand 회원 상태
│   ├── types/              # API 응답·화면 데이터 타입
│   ├── utils/              # 날짜·닉네임·캐릭터·스트릭 변환
│   ├── App.tsx             # 인증 초기화·라우트 구성
│   └── main.tsx            # React·분석 초기화 진입점
├── .github/                # PR 템플릿
├── .env.example            # 환경변수 예시
├── vite.config.ts          # Vite 플러그인·개발 서버 설정
└── vercel.json             # SPA 경로 rewrite
```

<a name="routes"></a>

## 🗺️ 주요 경로

| 경로 | 화면 | 접근 |
| --- | --- | --- |
| `/` | 오픈 전 커밍순, 오픈 후 랜딩 | 비회원 |
| `/landing` | 랜딩 | 비회원 |
| `/signup` | 닉네임·가입 | 오픈 후 비회원 |
| `/try` | 맛보기 퀴즈 | 비회원 |
| `/home` | 홈 대시보드 | 회원 |
| `/quiz` | 모드 선택 | 회원 |
| `/quiz?mode=daily` | 정규장 모드가 선택된 화면 | 회원 |
| `/quiz?mode=timeAttack` | 시간외거래 모드가 선택된 화면 | 회원 |
| `/quiz/daily` | 정규장 카테고리 선택 | 회원 |
| `/quiz/daily/:sessionId` | 정규장 풀이 | 회원 |
| `/quiz/daily/:sessionId/review` | 정규장 리뷰 | 회원 |
| `/quiz/daily/:sessionId/result` | 정규장 결과 | 회원 |
| `/quiz/time-attack/:sessionId` | 시간외거래 풀이 | 회원 |
| `/quiz/time-attack/:sessionId/result` | 시간외거래 결과 | 회원 |
| `/quiz/time-attack/:sessionId/ranking` | 시간외거래 결과 랭킹 | 회원 |
| `/ranking?tab=regular` | 정규장 랭킹 | 회원 |
| `/ranking?tab=afterhours` | 시간외거래 랭킹 | 회원 |
| `/mypage` | 마이페이지 | 회원 |
| `/shop` | 상점 | 회원 |
| `/shop/payment/result` | 결제 결과 확인 | 회원 |
| `/shop/payment/success` | 결제 완료 상태 화면 | 회원 |
| `/shop/payment/fail` | 결제 실패·취소 상태 화면 | 회원 |
| 그 외 | 404 페이지 | 공통 |

로그인한 사용자가 비회원 전용 경로에 접근하면 홈으로 이동합니다. 회원 전용 경로에서 인증되지 않은 사용자는 `/`로 이동합니다. 경로 정의는 [routes.ts](src/constants/routes.ts), 실제 등록 여부와 가드는 [App.tsx](src/App.tsx)를 기준으로 확인합니다.

<a name="implementation"></a>

## 🧩 주요 구현

### 🔐 세션 인증과 CSRF

```text
앱 진입 → CSRF 토큰 조회 → /members/me 조회 → 회원 스토어 갱신 → 라우트 판단
```

- Axios 공통 인스턴스의 `withCredentials: true`로 세션 쿠키를 포함해 통신합니다.
- 프론트에서 access token·refresh token을 localStorage에 저장하거나 재발급하는 구조는 아닙니다.
- CSRF 토큰과 서버가 알려준 헤더 이름은 메모리에 보관합니다. 준비된 토큰은 GET·HEAD·OPTIONS를 제외한 요청에 첨부합니다.
- 회원 정보도 메모리의 Zustand 스토어에 보관하고, 새로고침 시 `/members/me`로 복원합니다.
- 공통 API 인스턴스에서 401을 받으면 CSRF 토큰과 회원 정보를 비워 라우트 가드가 이동하도록 합니다. 만료를 감지하는 시점은 다음 API 요청에서 401을 받을 때입니다.
- 서버의 CORS·쿠키 설정과 API별 권한 검증이 별도로 필요합니다. 프론트 라우트 가드는 서버 인증을 대체하지 않습니다.

관련 파일은 [axiosInstance.ts](src/api/axiosInstance.ts), [useAuthStore.ts](src/stores/useAuthStore.ts), [guards](src/components/guards)입니다.

### 📝 퀴즈와 학습 상태

정규장과 시간외거래는 서버 세션 ID를 기준으로 문제 조회·답안 제출·완료·결과 조회를 진행합니다. 정규장은 진행 중 세션 이어 풀기와 리뷰를 제공하고, 시간외거래는 서버가 반환한 종료 시각으로 남은 시간을 계산합니다.

모드 선택에 필요한 FISH·패스·당일 횟수·복구 대기 상태는 [useQuizEntryStatus](src/hooks/useQuizEntryStatus.ts)에서 조회합니다. 정규장은 주가 반영 횟수를 소진해도 학습만 진행할 수 있으며, 시간외거래는 남은 횟수의 `null` 여부로 무제한 상태를 구분합니다.

### 📰 경제 트렌드 상세 캐시

목록은 `GET /api/v1/economic-trends/today`, 상세는 `GET /api/v1/economic-trends/{trendId}`를 호출합니다. 프론트가 라이너 API를 직접 호출하지 않고 우리 백엔드의 결과를 표시합니다.

[trend.ts](src/api/trend.ts)의 상세 캐시는 다음 정책을 사용합니다.

| 항목 | 정책 |
| --- | --- |
| 저장 위치 | 모듈 내부 메모리 `Map`, localStorage 미사용 |
| 키 | `trendId` |
| 유효 시간 | 응답 성공 시점부터 30분 |
| 최대 보관 | 20개, 먼저 저장한 항목부터 제거 |
| 중복 요청 | 같은 ID의 진행 중 Promise 공유 |
| 응답 검증 | 날짜·용어·출처와 배열 항목 등 모달 사용 필드 검사 |
| 실패·잘못된 응답 | 캐시하지 않으며 기존 재시도 동작으로 다시 조회 |
| 새로고침·탭 종료 | 메모리 캐시 초기화 |

목록 조회와 `PREPARING` 안내는 상세 캐시와 별도로 동작합니다. API 호출을 줄이기 위한 캐시이며, 서버의 콘텐츠 생성 주기나 라이너 호출 정책을 변경하지는 않습니다.

### 🏆 랭킹

- 정규장·시간외거래 응답을 [rankingAdapter.ts](src/hooks/rank/rankingAdapter.ts)에서 공통 화면 데이터로 변환합니다.
- 탭별 상태를 분리하고, 목록 하단 감지 시 20개씩 추가 조회합니다.
- 요청 잠금과 회원 ID 기반 중복 제거를 사용하고, 성공한 경우에만 다음 페이지로 이동합니다.
- PC에서는 분석 패널을 함께 표시하고 모바일에서는 내 순위 선택 시 모달로 표시합니다.
- 홈 요약에는 한국 시간 자정 갱신과 제한된 실패 재시도가 있습니다. 전체 랭킹 페이지는 별도 페이지 조회 상태를 사용하며 실시간 스트리밍 방식은 아닙니다.
- 미확인 보상은 날짜 오름차순, 같은 날짜에서는 정규장 → 시간외거래 순서로 표시합니다. 확인 PATCH는 읽음 처리이며 추가 지급 요청이 아닙니다.

### 💳 결제·패스·환불

```text
구매 확인 → 활성 패스 재조회 → 주문 생성 → PayApp 이동
→ 주문번호로 결제 상태 확인 → 결제 완료 안내 → 패스 시작 안내
```

- 패스 상품 코드는 `WEEKLY_PASS`입니다. 화면 기본 상품 정보는 [payment.ts](src/constants/payment.ts)에 있습니다.
- 주문 생성 요청에는 상품 코드와 수신 전화번호를 보냅니다. 실제 금액·결제 확정·패스 지급은 서버가 결정합니다.
- 연속 클릭 잠금과 주문 재사용으로 같은 화면에서 중복 주문 생성을 줄입니다.
- 결제 URL은 HTTPS 여부를 검사하고, 이동 전에 주문번호를 sessionStorage에 보관합니다.
- 복귀 시 URL의 `orderNumber`를 우선 사용하고, 없으면 sessionStorage 값을 확인합니다.
- 결제 성공 경로로 접속한 것만으로 성공을 판단하지 않습니다. 서버의 주문 상태와 주문번호를 검증합니다.
- [usePaymentResult](src/hooks/usePaymentResult.ts)는 응답 후 2초 간격으로 다음 조회를 예약하고 최대 60초까지 확인합니다. 이후에는 지연 안내와 수동 재확인을 제공합니다.
- `APPROVED`는 결과 조회 훅에서 패스 지급 확인을 기다리는 상태, `COMPLETED`는 완료 상태로 처리합니다. 일부 결제 내역 UI에서는 `APPROVED`도 ‘결제 완료’ 문구를 사용하므로 서버 상태와 표시 문구를 구분해 확인해야 합니다.
- 패스 이용 기간은 현재 패스·이용 내역 응답으로 확인하고, 결제 상태 재조회와 별도로 재시도할 수 있습니다.
- 환불 버튼은 결제 상세의 `refundable`을 기준으로 표시합니다. 취소 요청 응답에 따라 완료·처리 중·실패를 구분하고, 실패 후 재시도 전에 상세 상태를 확인합니다.
- 결제창 이탈만으로 프론트가 주문을 취소하지는 않습니다. 주문 만료·PayApp Feedback 처리·최종 지급과 환불은 서버에서 관리합니다.

### 🔔 팝업과 브라우저 저장소

홈에서는 튜토리얼과 가입 보상을 먼저 안내하고 패스 안내를 이어서 표시합니다. 복구·하락·진화·랭킹 알림은 게이트 상태로 표시 시점을 조정합니다.

| 상태 | 관리 방식 |
| --- | --- |
| 가입 보상 팝업 | `/me`의 `signupRewardPopupPending`과 확인 PATCH |
| 복구 완료 팝업 | `recoveryPopupPending`과 이벤트별 확인 PATCH |
| 캐릭터 진화 팝업 | `pendingEvolutionStage`와 단계 확인 PATCH |
| 랭킹 보상 팝업 | 미확인 목록과 보상별 읽음 PATCH |
| 패스 판매 안내 | 기존 `/members/me/open-chat-modal`의 `shouldShow`와 오늘 하루 숨김 PATCH |
| 정규장 학습 달성 안내 | 입장·완료 상태 비교와 브라우저의 날짜별 표시 기록 |
| 결제 복귀·학습 스냅샷 | sessionStorage |

안내 API 이름에 오픈채팅이 남아 있지만, 홈에서는 `variant="pass"`로 패스 판매 안내를 연결합니다. 오픈채팅 모달 컴포넌트는 유지하고 있습니다. 팝업 확인 API는 해당 안내의 확인·숨김 상태를 변경하며, 지급·복구 API와 구분합니다.

### 📱 반응형과 접근성

- 기본 화면은 모바일 기준이며, 주요 네비게이션·레이아웃은 `lg`(1024px)에서 PC 배치로 전환합니다.
- 랜딩의 일부 이미지·섹션은 `sm`(640px) 기준으로 구분합니다. 모든 페이지가 같은 단일 분기점만 사용하는 것은 아닙니다.
- 긴 제목·닉네임에는 말줄임을 적용하고, 마이페이지 자산 수량은 카드 안에서 줄바꿈할 수 있습니다.
- 트렌드·결제 등 주요 모달은 화면 높이에 맞춰 내부 스크롤을 제공합니다.
- 버튼의 접근성 이름·선택 상태, 모달 역할과 키보드 조작을 적용합니다. 홈 차트 애니메이션은 사용자의 모션 감소 설정을 고려합니다.

<a name="analytics"></a>

## 📊 GA4 측정

[analytics.ts](src/lib/analytics.ts)에서 초기화·페이지 조회·이벤트 전송을 관리합니다.

| 이벤트 | 전송 시점 |
| --- | --- |
| `page_view` | React Router의 경로 변경 |
| `sign_up` | 가입 API 성공 |
| `attendance_check` | 출석 보상이 새로 지급된 경우 |
| `quiz_complete` | 정규장·시간외거래 완료 API 성공, `mode`로 구분 |
| `trend_open` | 홈 트렌드 카드 클릭 |
| `purchase` | 서버 결제 상태가 `COMPLETED`이고 상품·주문번호가 일치한 경우 |

- 프로덕션 빌드이면서 호스트가 `coze.kids` 또는 `www.coze.kids`이고 측정 ID가 있을 때만 실행합니다. 로컬 개발·미리보기 도메인에서는 수집하지 않습니다.
- 페이지 주소와 유입 주소의 쿼리·해시는 제외합니다. 로컬에서 운영 사이트로 넘어온 경우에는 로컬 주소를 리퍼러에서 제거하고 `ignore_referrer`를 설정합니다.
- 현재 코드의 리퍼러 제외 대상은 로컬 호스트입니다. 카카오·PayApp의 추천 제외는 GA 관리 설정을 별도로 확인해야 합니다.
- 이벤트에는 이메일·닉네임·전화번호·API 응답 전체를 넣지 않습니다. 구매에는 거래 구분용 주문번호를 `transaction_id`로 사용합니다.
- 일반 단발 이벤트는 브라우저 저장소로 중복을 줄이고, 구매는 문서 내 중복 방지와 `transaction_id`를 사용합니다. 프론트 명령 등록이 GA 서버 수신 완료를 보장하지는 않습니다.
- GA 관리 화면에서 주요 이벤트 지정, 내부 트래픽 제외 등 보고서 설정을 별도로 해야 합니다.

`trend_open`은 카드 클릭을 측정하며, 상세 읽기 완료나 모달의 다음 버튼 이동 전체를 측정하는 이벤트는 아닙니다.

<a name="deployment"></a>

## ☁️ 배포 및 운영 설정

Vercel에서 빌드 명령은 `npm run build`, 출력 디렉터리는 `dist`를 사용합니다. [vercel.json](vercel.json)의 rewrite는 SPA 하위 주소로 직접 접속하거나 새로고침할 때 `index.html`을 반환하도록 합니다.

| 설정 | 코드 위치 | 확인할 내용 |
| --- | --- | --- |
| 서비스 오픈 | [launch.ts](src/constants/launch.ts), [useServiceOpen.ts](src/hooks/useServiceOpen.ts) | 2026-10-31 00:00 KST 기준 화면 전환, 클라이언트 시계 사용 |
| 판매 종료 | [pass.ts](src/constants/pass.ts), [ShopPage.tsx](src/pages/ShopPage.tsx) | 2026-11-21 23:59 KST, 공통 상수와 상점 일정이 별도로 존재 |
| 서비스 종료 안내 | 상점 일정, 랜딩 FAQ·푸터 | 2026-11-28 종료 안내, 일정 변경 시 문구도 함께 확인 |
| 상품 표시 | [payment.ts](src/constants/payment.ts) | 상품 코드·가격·이용 시간과 서버 상품 정보 일치 여부 |
| 결제 복귀 | [routes.ts](src/constants/routes.ts) | 서버 Return URL을 `/shop/payment/result?orderNumber=...` 경로와 맞추기 |
| 로그인·세션 | 백엔드 OAuth·CORS·쿠키 설정 | 실제 로그인 복귀 주소, 운영·개발 Origin 허용 여부 |
| 홈 화면 아이콘 | [manifest.webmanifest](public/manifest.webmanifest), [index.html](index.html) | 192·512px 아이콘과 iOS apple-touch-icon |

오픈 예약은 화면 전환 기능이며, 서버의 신규 가입·결제 허용 정책까지 변경하지는 않습니다. 홈 화면 아이콘용 manifest는 `display: browser`이며 서비스 워커·오프라인 지원·푸시 알림을 제공하는 구성은 아닙니다.

<a name="contributing"></a>

## 🤝 협업 규칙

### 📬 커밋 컨벤션

커밋 메시지는 `[Type] 작성 내용` 형식으로 통일합니다.

| Type | 설명 |
| --- | --- |
| `[Feat]` | 새로운 기능 구현 |
| `[Add]` | 부수적인 코드 추가, 라이브러리 추가, 새로운 파일 생성 |
| `[Mod]` | 코드 수정 및 내부 파일 수정 |
| `[Fix]` | 버그 및 오류 해결 |
| `[Refactor]` | 코드 리팩터링 (전면 수정) |
| `[Chore]` | 버전 코드 수정, 패키지 구조 변경, 타입/변수명 변경 등 사소한 변경 |
| `[Rename]` | 파일명 또는 폴더명 수정 |
| `[Del]` | 쓸모없는 코드나 파일 삭제 |
| `[Docs]` | 문서화 작업 |
| `[Environment]` | 개발 환경 세팅 |
| `[!HOTFIX]` | 급하게 고쳐야 하는 치명적 버그 수정 |

### 👾 PR 제목

커밋 컨벤션과 동일하게 `[Type] 작업 내용` 형식으로 작성합니다.

### 🌿 브랜치 전략

| 브랜치 | 설명 |
| --- | --- |
| `main` | 배포 가능한 안정 버전 |
| `feature/*` | 기능 개발 브랜치 |
| `fix/*` | 버그 수정 브랜치 |
| `hotfix/*` | 배포 후 긴급 수정 |
| `refactor/*` | 코드 리팩터링 |
| `docs/*` | 문서 작업 |

- 소문자와 하이픈(`-`)을 사용합니다.
- 이슈 번호를 포함할 때는 `feature/12-login-api` 형식으로 작성합니다.

### 📱 반응형 기준

| 브레이크포인트 | 접두사 |
| --- | --- |
| 1023px 이하 (모바일) | 없음 |
| 1024px 이상 (데스크톱) | `lg:` |
