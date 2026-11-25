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

### 시맨틱 토큰 (역할 이름) — 새 코드는 이것만 쓴다

토큰 이름이 "어떻게 생겼는지"(`--color-about-card-bg`)가 아니라 "무엇에 쓰는지"(`--color-surface-raised-inverse`)를 말한다. 위 표의 토큰은 팔레트이고, 아래 역할 토큰이 그 팔레트를 가리킨다. 색을 바꿀 때는 팔레트 값만 바꾸면 역할 토큰을 쓰는 모든 곳이 같이 바뀐다.

| 역할 토큰 | 가리키는 값 | 언제 |
|---|---|---|
| `--color-text-primary` | `--color-ink` | 밝은 배경 위 본문·제목 |
| `--color-text-secondary` | `--color-text-muted` | 보조 설명, 메타 정보 |
| `--color-text-tertiary` | `--color-text-dim` | 가장 약한 텍스트, hover 전 상태 |
| `--color-text-on-inverse` | `--color-surface-inverse` | 어두운 배경 위 텍스트 |
| `--color-surface-page` | `--color-brand-bg` | 기본 페이지 배경 |
| `--color-surface-hero` | `--color-hero-bg` | Hero 배경 |
| `--color-surface-inverse-page` | `--color-about-bg` | 어두운 페이지 배경(About) |
| `--color-surface-raised-inverse` | `--color-about-card-bg` | 어두운 배경 위 카드 |
| `--color-surface-placeholder` | `--color-thumbnail-placeholder` | 이미지 로딩 전 자리 |
| `--color-surface-hover` | `--color-hover-light` | hover 반전 배경 |
| `--color-border-strong` | `--color-brand-line` | 강한 구분선 |
| `--color-border-subtle` | `--color-cs-line` | 케이스스터디 얇은 구분선 |
| `--color-border-inverse` | `--color-about-card-border` | 어두운 배경 위 테두리 |
| `--color-accent-attention` | `--color-nav-accent` | 시선을 끌어야 하는 단 하나(INDEX 버튼) |

- 새 역할이 필요하면 `globals.css`의 "Semantic roles" 블록에 추가하고 `npm run tokens`를 돌린다. 생성된 타입(`src/lib/design-tokens.generated.ts`)이 없는 토큰 이름을 type-check에서 막는다.
- TS에서 토큰을 넘길 때는 `cssVar('--color-text-primary')`(`src/lib/tokens.ts`)를 쓴다. 오타는 컴파일 에러가 된다.
- 기존 코드가 팔레트 토큰을 직접 쓰는 것은 당장 고치지 않는다. 그 파일을 수정할 때 역할 토큰으로 옮긴다.

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
| `--page-gutter` | 12px | 20px | 36px | 48px |

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

**케이스스터디 페이지 (타이틀/서브타이틀)**
- Title: `var(--cs-page-title-size)` — 32px(기본) → 42px(≥1440px)
- Subtitle: `var(--cs-page-subtitle-size)` — 20px(기본) → 16px(1024–1439px, ≤768px)
- Title→Subtitle 간격: `var(--cs-page-title-gap)` — 12px(전 해상도 고정)
- 리스트 아이템 간격: `var(--cs-list-item-gap)` — 16px(기본) → 12px(≤768px)

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
  'anchor':                   { subtitle: 'DeFi Savings Protocol UX to $16B+ TVL',  thumbnail: '',                       date: '2023' },
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

## 케이스스터디 컴포넌트 — 언제, 어떻게 쓰는가

`src/app/case-studies/_shared/components.tsx`가 케이스스터디 페이지의 컴포넌트 라이브러리다. 새 케이스스터디는 이 조각만으로 조립한다. 여기 없는 형태가 필요하면 페이지 안에 새로 만들기 전에 먼저 묻는다.

| 컴포넌트 | 언제 쓰나 | 규칙 |
|---|---|---|
| `SplitSection` | 왼쪽 제목 + 오른쪽 본문 섹션. 케이스스터디의 기본 단위 | `title`에는 `<SectionTitle>`. `pt`/`pb`는 `Space` 타입(아래)만 받는다. 기본값은 `CS.space.section` |
| `SectionTitle` | 섹션 제목(h2 역할) | 페이지당 여러 개 가능. 페이지 제목(h1)은 따로 하나 |
| `SubTitle` | 섹션 안 소제목 | `SectionTitle` 없이 단독으로 쓰지 않는다 |
| `Body` | 본문 단락 | `muted`로 보조 톤. `style`은 margin 같은 배치 조정에만 쓰고 색·폰트는 넣지 않는다 |
| `DisplayText` | 한 문장을 크게 보여줄 때(인용, 핵심 주장) | 섹션당 하나 |
| `Stack` | 세로로 쌓인 요소 사이 간격 | `gap`은 `CS.space.*`. 기본 `stack`(40), 단락 사이는 `paragraph`(20) |
| `Caption` | 이미지·영상 설명 라벨(점 + 굵은 텍스트) | 미디어 바로 위나 옆에만 |
| `Divider` | 섹션 사이 1px 구분선 | 섹션 경계에만. 장식으로 반복하지 않는다 |
| `Pill` | 역할·툴·기간 같은 태그 | `href`가 있으면 외부 링크로 새 탭 |
| `FullBleedImage` | 페이지 폭 이미지/영상 | 날것의 `<img>` 대신 이것. `aspect`는 원본 픽셀 비율 `"3200 / 1436"` 형식(`AspectRatio` 타입) |
| `FluidVideo` | 비율을 고정한 영상 | `cover`는 잘려도 되는 영상에만 |
| `CaptionMediaRow` | 왼쪽 설명 + 오른쪽 미디어 한 줄 | `mt`는 `Space` 타입 |
| `HalfCaptionBlock` / `WideCaptionBlock` | 이미지 아래 설명 블록(반폭/넓은 폭) | `pt`는 `Space` 타입 |

**`Space` 타입**: `CS.space.*` 값, `0`, 선언된 CSS 토큰(`var(--…)`), 또는 `offScale(n)`만 받는다. `pt={100}`처럼 숫자를 바로 넣으면 type-check가 실패한다.

**`offScale(n)`**: 스케일 밖의 값이 정말 필요할 때 쓰는 탈출구다. lint(`ds/no-off-scale`)가 매번 센다. 쓸 때는 이유를 여기에 적는다.

| 위치 | 값 | 이유 |
|---|---|---|
| `initia-ecosystem` The Philosophy | `offScale(36)` | 확인 필요 |

- 2026-11-26: `anchor`, `initia-app`, `cross-remittance`의 `pt`/`pb={100}` 4곳은 모바일에서도 100px로 고정돼 있었다. 의도가 아니라고 확인돼 `CS.space.section`(데스크톱 100px, 모바일 60px)으로 바꿨다. 섹션 상하 여백은 숫자로 고정하지 않는다.

---

## Enforcement — 문장 대신 검사

규칙을 문서에만 두면 에이전트가 컨텍스트가 찼을 때 건너뛴다. 그래서 코드로 판별할 수 있는 규칙은 검사로 만든다.

| 검사 | 무엇을 막나 | 어디서 |
|---|---|---|
| `ds/no-raw-color` | `#21201c`, `rgba(…)` 같은 날것의 색 | lint (`eslint-rules/design-system.mjs`) |
| `ds/no-one-off-value` | `style`의 `padding: 13`, `'13px'`, Tailwind `p-[13px]` | lint |
| `ds/no-raw-element` | 날것의 `<img>`(→ `FullBleedImage`/`next/image`), 내부 경로 `<a href="/…">`(→ `Link`) | lint |
| `ds/single-h1` | 한 파일에 `<h1>` 두 개 | lint |
| `ds/font-family` | 토큰이 아닌 폰트(`var(--font-google-sans-flex)`, Hero Mode C의 `var(--font-pixel)`만 허용) | lint |
| `ds/no-off-scale` | `offScale()` 호출을 센다 | lint |
| `Space`, `AspectRatio`, `TokenVar` 타입 | 컴포넌트 prop에 스케일 밖 값, 없는 토큰 이름 | type-check |
| 토큰 타입 최신 여부 | `globals.css`를 바꾸고 `npm run tokens`를 안 돌린 경우 | `npm run ds:check` |

**예외 (2026-11-26 결정)**
- 토큰 원본(`_shared/tokens.ts`, `design-tokens.generated.ts`)은 색·px 검사에서 뺀다.
- 캔버스로 그리는 파일(`PixelSignalField.tsx`, `gameOfLife.ts`, `FooterSection.tsx`)은 색 검사에서 뺀다. 캔버스는 CSS 변수를 바로 읽지 못한다.
- `_shared/components.tsx`는 `<img>`/`<a>`를 감싸는 원본이라 날것 태그 검사에서 뺀다.

**래칫(ratchet) 방식**
- 모든 `ds/*` 규칙은 warning이다. 기존 코드는 그대로 빌드된다.
- `eslint-rules/ds-baseline.json`에 파일별 위반 수가 기록돼 있다. `npm run ds:check`는 어느 파일이든 위반이 하나라도 늘면 실패한다. CI(`.github/workflows/design-system.yml`)가 PR마다 이것과 type-check를 돌린다.
- 위반을 고쳐서 숫자가 줄면 `npm run ds:baseline`으로 낮춘 값을 고정한다. 이 명령은 숫자를 올리는 것을 거부한다. 정말 올려야 하면 `--force`를 붙이고 PR에 이유를 적는다.
- 2026-11-26 시작 시점: one-off 값 287, 날것의 색 91, 날것 태그 23, offScale 1, 폰트 1.

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
