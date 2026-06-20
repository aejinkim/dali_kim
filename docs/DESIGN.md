# Design System — Dali Kim Portfolio

---

## 브랜드 성격

**핵심 단어**: Precision / Consequence / Clarity
**톤**: 조용하고 자신감 있음. 장식보다 구조. 복잡함 속에서의 명확함.
**피해야 할 것**: 과도한 애니메이션, 화려한 그라디언트, 유행 타는 트렌드.

---

## 컴포넌트 구조

```
src/components/
└── main/                    ← 메인 페이지 전용 섹션
    ├── Navbar/              ← 고정 헤더 + 네비게이션
    ├── HeroSection/         ← 인터랙티브 캔버스 + 타이틀
    ├── BioSection/          ← 스크롤 드리븐 자기소개
    ├── ProjectsSection/     ← 2열 프로젝트 그리드
    └── FooterSection/       ← DALI 도트 캔버스 + CTA
```

각 컴포넌트 폴더 구성:
```
ComponentName/
├── ComponentName.tsx    ← 구현체
└── index.ts             ← 배럴 export
```

### 레이아웃 구조 (스크롤 수학)

| 섹션 | height | zIndex | marginTop |
|------|--------|--------|-----------|
| HeroSection | `150vh` | `10` | — |
| BioSection | `350vh` | `1` | `-150vh` |

- Hero 내부 콘텐츠가 위로 슬라이드(`translateY`) → Bio가 정적으로 뒤에서 드러남
- `SLIDE_END = 0.2`, `REVEAL_WINDOW = 0.16` — 스크롤 수학에서 도출된 값, 변경 금지
- Mobile (≤768px): Hero `100vh`

---

## 색상

> 모든 색상은 `var(--token)`으로만 사용. HEX 하드코딩 금지.

### 현재 활성 토큰 (`globals.css @theme`)

| 토큰 | 값 | 사용 맥락 |
|------|-----|-----------|
| `--color-brand-bg` | `#ffffff` | 페이지 기본 배경, 스크롤바 트랙 |
| `--color-brand-line` | `#111111` | 테두리, 구분선, 스크롤바 thumb |
| `--color-hero-bg` | `#d9d7d0` | Hero 섹션 기준 배경 |
| `--color-canvas-bg` | `#000000` | Footer 캔버스, 다크 캔버스 배경 |
| `--color-surface-inverse` | `#ffffff` | 다크 섹션 위 텍스트/아이콘 |
| `--color-thumbnail-placeholder` | `#d9d9d9` | 썸네일 로드 전 placeholder |
| `--color-ink` | `#0a0a0a` | 라이트 섹션 텍스트, 버튼 배경 |
| `--color-hover-light` | `#EBECEC` | hover-invert 상태 텍스트 |
| `--color-about-bg` | `#0e0e0e` | About 페이지 다크 배경 |
| `--color-about-card-bg` | `#232323` | About 페이지 카드 배경 |
| `--color-about-card-border` | `#787878` | About 페이지 카드 테두리 |
| `--color-text-dim` | `#aaaaaa` | hover 시 muted 텍스트 |
| `--color-nav-accent` | `#E53535` | INDEX 버튼 |
| `--color-project-card-light` | `#f5f4f0` | Project card theme 1 |
| `--color-project-card-blue` | `#1B4EFD` | Project card theme 2 |
| `--color-project-card-dark` | `#0d0d0d` | Project card theme 3 |

### 섹션별 색상 맥락

| 요소 | 값 |
|------|-----|
| Hero background | `var(--color-hero-bg)` `#d9d7d0` |
| Footer canvas background | `var(--color-canvas-bg)` `#000000` |
| Bio / Projects background | `var(--color-brand-bg)` `#ffffff` |
| Light section text | `var(--color-ink)` `#0a0a0a` |
| Dark section text | `var(--color-surface-inverse)` `#ffffff` |
| Nav INDEX button | `var(--color-nav-accent)` `#E53535` |
| Project card theme 1 | `var(--color-project-card-light)` `#f5f4f0` |
| Project card theme 2 | `var(--color-project-card-blue)` `#1B4EFD` |
| Project card theme 3 | `var(--color-project-card-dark)` `#0d0d0d` |

---

## 타이포그래피

**폰트**: Google Sans Flex (variable font, W100–900) — 메인 포트폴리오 페이지 유일 폰트
```css
var(--font-google-sans-flex)
```
**기본 원칙**: 크기보다 굵기로 위계를 만든다.

### 유체(Fluid) 변수 — 해상도별 자동 보간

| 변수 | ≤768px | 1024px | 1440px | 1920px |
|------|--------|--------|--------|--------|
| `--hero-font-size` | 38px | 62px | 86px | 143px |
| `--bio-font-size` | 16px | 32px | 46px | 72px |
| `--project-title-size` | 24px | 24px | 40px | 56px |
| `--project-subtitle-size` | 14px | 14px | 20px | 28px |
| `--footer-cta-size` | 36px | 60px | 60px | ~160px |
| `--page-gutter` | 20px | 20px | 36px | 48px |

### 컴포넌트별 타이포 스펙

**Hero Headline**
- 크기: `var(--hero-font-size)`
- 구성: "I design where" W300 / "complexity" W900 (stepped 애니메이션) / "consequence" W100 (smooth 애니메이션)
- `complexity`: 픽셀/블록 스크램블, `steps(14, end)` 타이밍

**Project Card**
- Title: `var(--project-title-size)` / W500 / `letter-spacing: var(--project-title-tracking)`
- Subtitle: `var(--project-subtitle-size)` / W300 / `letter-spacing: -0.96px`

**Bio Body**
- 크기: `var(--bio-font-size)` / W300
- Bold 단어 (Dali, Kim, blockchain, aerospace): W700
- line-height: `1.25` / letter-spacing: `-0.01em`
- Container: `min(var(--bio-container-width), 66vw)`

**Nav**
- 크기: `var(--nav-font-size)` — `clamp(13px → 15px)`
- letter-spacing: `var(--tracking-caption)`

**Footer CTA**
- 크기: `var(--footer-cta-size)`

---

## 반응형 브레이크포인트

| 브레이크포인트 | 동작 |
|-------------|------|
| `≥1920px` | 변수가 1920px 이후로 계속 성장 |
| `1440–1920px` | 1440px 고정값 유지 후 부드럽게 성장 |
| `1024–1440px` | Fluid clamp 스케일링 (기본 범위) |
| `≤1024px` | Nav 스택 레이아웃 전환 |
| `≤768px` | 모바일 — Bio, Projects, Nav 완전히 다른 DOM 구조 |

---

## 컴포넌트 상세

### Navbar
- Nav: 스크롤 20–50%에서 fade out
- INDEX 버튼(빨간 원): 50% 이후 등장
- INDEX 버튼 위치: `right: var(--page-gutter)`, `top: 33px`
- 모바일 Nav: Logo + WORK + CRAFT만 표시

### BioSection — 카드 시스템

| 카드 | 파일 | 트리거 단어 인덱스 | 회전 |
|------|------|-----------------|------|
| dali-kim | `dali_kim_photo2.png` | idx 5 | `-11.2°` |
| blockchain | `bio_blockchain1.mp4` (video) | idx 16 | `+12°` |
| aerospace | `gk2_01.png` | idx 22 | `-2.1°` |

- 카드는 누적됨 — `visibleKeys`는 커지기만 하고 줄지 않음
- 등장 애니메이션: `scale(0.7 → 1)`, `cubic-bezier(0.34, 1.56, 0.64, 1)`, `160ms`

### ProjectCard
- 외부 카드 래퍼: `<div>` (클릭 불가)
- 썸네일 `<a>`만 클릭 가능
- 텍스트 div 너비 = 썸네일 너비 (`tall ? '100%' : '75%'`)
- 커스텀 커서(흰 원 + 화살표)가 썸네일 내 마우스 따라 이동

**데스크탑 레이아웃**
- Row 1: `tall` 카드 (100%) + `normal` 카드 (75%), `alignItems: flex-end`
- Row 2: `normal` 카드 (75%, `flip: true`, 오른쪽 정렬) + `tall` 카드

### ProjectsSection — 프로젝트 메타데이터

```ts
const PROJECT_META = {
  'initia-ecosystem':         { subtitle: '0→1 Brand & Full Product Suite Design',  thumbnail: '/initia_glass169_2.mp4', date: '2026' },
  'anchor-protocol':          { subtitle: 'DeFi Savings Protocol UX to $16B+ TVL',  thumbnail: '',                       date: '2023' },
  'fount-robo-advisor':       { subtitle: 'Robo-Advisor Wealth Management Platform', thumbnail: '',                       date: '2021' },
  'satrec-satellite-control': { subtitle: 'GEO-KOMPSAT Mission Ground Control UX',  thumbnail: '',                       date: '2018' },
};
```

---

## 코드 규칙

### CSS 변수 사용

```tsx
// ✅ 올바름
style={{ backgroundColor: 'var(--color-brand-bg)', padding: 'var(--page-gutter)' }}

// ❌ 금지
style={{ backgroundColor: '#ffffff', padding: '36px' }}
className="bg-[#F3F0E6]"
```

### 토큰 업데이트 순서

1. `src/app/globals.css`의 `@theme` 또는 `:root`에 토큰을 먼저 추가한다.
2. 컴포넌트에서는 HEX/RGBA를 직접 반복하지 않고 `var(--token)`을 사용한다.
3. 공용 토큰을 바꾸기 전에 사용 범위를 확인한다. Hero와 Footer처럼 시각 맥락이 다른 영역은 토큰을 분리한다.
4. 변경한 토큰은 이 문서의 활성 토큰 표와 섹션별 색상 맥락에 함께 기록한다.

### 컴포넌트 너비

- 컴포넌트 자체: `w-full`
- 너비 제어: 부모의 `padding` 또는 `max-width`로만
- 컴포넌트 내부에서 고정 너비 직접 지정 금지

### 레이아웃 컨테이너

- Max width: `.content-width` 클래스 (`max-width: 1920px`, centered)
- 수평 여백: 항상 `var(--page-gutter)` — px 값 직접 지정 금지

### 절대 금지

| 금지 | 이유 |
|------|------|
| HEX 하드코딩 (`#111111`, `bg-[#F3F0E6]`) | 토큰 일관성 파괴 |
| 임의 간격 (`p-[72px]`, `gap-[24px]`) | 토큰 없는 임의값 |
| `!important` | 예측 불가한 캐스케이드 |
| `any` 타입 | 타입 안전성 손상 |
| `transition: all` | 의도치 않은 속성 전환 |
| `vh` 고정 높이 (스크롤 섹션 제외) | 모바일 주소바 이슈 |

---

## 컴포넌트 조합 규칙

### 해도 되는 것
- 카드 안에 태그 + 타이틀 + 서브타이틀 조합
- 카드 테마 색상에 따라 텍스트 색 자동 반전 (Light → dark text / Blue, Dark → white text)

### 하지 말 것
- `Display` 크기 텍스트를 2개 이상 사용
- 카드 안에 카드 중첩
- 4가지 이상 색상 조합

---

## Figma 레이어 네이밍 컨벤션

```
[컴포넌트명] / [variant] / [상태]

예:
Button / Primary / Default
Card / Light / Selected
```

**규칙**
- 슬래시(`/`)로 계층 구분, PascalCase 컴포넌트명
- 상태: Default / Hover / Active / Disabled / Focus / Selected
- 레이아웃 프레임: `Home / Hero`, `Home / Projects`
- 임시 레이어: `_` 접두사 (`_temp`, `_draft`)
