# Ji입니다만 — TAKAMATSU

여행하고, 먹고, 기록하는 지의 일상.
첫 호는 2026년 11월 26—27일 다카마쓰·쇼도시마 1박 2일 기록입니다.

- 공개 주소(저장소 Pages를 켠 경우): `https://kmj562888.github.io/-/`
- 예약번호·연락처·숙소 이름 같은 개인 정보는 넣지 않았습니다.
- 검색엔진에는 노출되지 않도록 `robots.txt`와 `noindex`를 넣었습니다. 링크를 아는 사람만 봅니다.

## 폴더 구조

```
index.html            사이트 본문 (일정·음식·준비물·후기)
assets/style.css      디자인 (색·글꼴·레이아웃)
assets/main.js        탭 전환, 체크리스트·경비·후기 저장
images/               사진 (원본 크기 + 700px 모바일용)
README.md
robots.txt
.nojekyll             GitHub Pages에서 Jekyll 처리 건너뛰기
```

## 고치는 법

### 1. 사진 바꾸기 (가장 쉬움)

`images/` 안의 파일을 같은 이름으로 덮어쓰면 끝입니다. 파일 이름을 그대로 두면 본문을 고칠 필요가 없습니다.

| 파일 | 쓰이는 곳 |
|---|---|
| `hero-angel-road.jpg` | 맨 위 큰 사진 |
| `angel-road.jpg` | 쇼도시마 도노쇼항 |
| `ferry-olive.jpg` | 다카마쓰항 |
| `takamatsu-night.jpg` | 밤 섹션 |
| `ritsuring-day.jpg` | 리쓰린 야간 일정 카드 |
| `ritsuring-lawn.jpg` | 리쓰린 낮 |
| `kikugetsutei.jpg` | 기쿠게쓰테이 |
| `udon-kamaage.jpg`, `udon-set.jpg` | 우동 |
| `honetsuki.jpg` | 잇카쿠 |
| `arcade-marugamemachi.jpg` | 마루가메마치 |
| `station-night.jpg` | 효고마치 |
| `airport.jpg` | 공항 |
| `seto-islands.jpg` | 프롤로그 |
| `takamatsu-castle.jpg` | ABOUT |

- 가로 1400~2000px, JPEG 품질 80 정도면 충분합니다. 휴대폰 사진은 그대로 올리면 5MB를 넘기니 줄여서 넣는 편이 좋습니다.
- `-700.jpg`가 붙은 파일은 휴대폰용 작은 사본입니다. 큰 파일을 바꿨다면 작은 사본도 같은 내용으로 다시 만들어 주면 좋습니다(없어도 큰 파일이 대신 쓰입니다).
- 사진을 바꾸면 ABOUT의 ‘Photo credits’에서 해당 사진 설명을 지우거나 내 사진이라고 적어 주세요.

`assets/style.css`나 `assets/main.js`를 고쳤는데 화면이 그대로라면, `index.html` 위쪽의 `style.css?v=20261120j` / `main.js?v=20261120j`에서 `v=` 값을 다른 글자로 바꿔 주세요. 브라우저가 예전 파일을 기억하고 있을 때 새로 받아오게 하는 표시입니다.

### 2. 일정·문구 고치기

`index.html` 안에서 `<article class="stop">` 하나가 일정 한 칸입니다.

```html
<article class="stop">
  <div class="stop-time"><span class="t">13:40</span><span class="idx">06</span></div>
  <div class="stop-main">
    <h3>쇼도시마로</h3>
    <span class="ja">高松港 → 土庄港</span>
    <p class="desc">설명</p>
    <dl class="facts">...</dl>
    <a class="maplink" href="구글맵 주소">지도에서 보기</a>
  </div>
  <figure class="stop-fig">...</figure>
</article>
```

- 사진을 넣지 않으려면 `<article class="stop">`을 `<article class="stop stop--text">`로 바꾸고 `<figure>` 블록을 지웁니다.
- 지도 링크는 `https://www.google.com/maps/search/?api=1&query=장소이름` 형식입니다. 띄어쓰기는 `%20`으로 바꿔 넣습니다.
- 하루 전체 경로 버튼은 `day-route` 안의 Google Maps `dir` 링크입니다.

### 3. 체크리스트·경비 항목

- 체크리스트: `index.html`의 `<ul class="checklist">` 안 `<li>`를 늘리거나 줄이면 됩니다. 개수는 자동으로 다시 계산됩니다.
- 경비: `#budget-rows` 안의 `.brow` 한 줄이 항목 하나입니다. `data-key` 값이 저장 이름표이니 겹치지 않게만 해주세요.

### 4. 후기 남기기

페이지의 **Daily → Notes**에서 날짜·제목·메모·사진을 넣고 ‘기록 추가’를 누르면 브라우저에 저장됩니다(최대 6개, 사진은 1200px로 줄여 저장).

이 저장은 그 브라우저에만 남습니다. 기기를 바꾸거나 브라우저 기록을 지우면 사라집니다. 오래 남길 기록은 이렇게 하는 편이 좋습니다.

1. 사진을 `images/`에 넣습니다(예: `images/day2-ritsurin.jpg`).
2. `index.html`의 `#note-list` 근처에 카드를 직접 추가합니다.

```html
<article class="notecard">
  <figure><img src="images/day2-ritsurin.jpg" alt="리쓰린 공원 아침" loading="lazy"></figure>
  <div>
    <p class="date">2026.11.27</p>
    <h4>리쓰린, 아침</h4>
    <p>아침 9시의 정원은 사람이 적고 물이 잔잔했다.</p>
  </div>
</article>
```

## 미리 보기

`index.html`을 브라우저로 열면 대부분 그대로 보입니다. 사진·글꼴이 안 뜨면 같은 폴더에서 아래를 실행하고 `http://localhost:8000`을 엽니다.

```bash
python3 -m http.server 8000
```

## GitHub Pages 켜기

저장소 → **Settings → Pages → Build and deployment**에서
`Source: Deploy from a branch` · `Branch: main` · `Folder: / (root)`를 고르고 **Save**.
1~2분 뒤 `https://kmj562888.github.io/-/` 가 열립니다. 주소가 `-`라서 보기 좋지 않으면 저장소 이름을 `takamatsu` 등으로 바꾸면 주소도 함께 바뀝니다.

## 사진 출처

Wikimedia Commons의 자유 라이선스 사진을 크기만 줄여 사용했습니다. 원본과 라이선스는 페이지 하단 ABOUT의 ‘Photo credits’에 링크해 두었습니다.

- CC BY / CC BY-SA 사진은 출처와 라이선스를 표시해야 합니다. 사진을 바꿀 때 이 목록도 함께 정리해 주세요.
- (이미지)라고 적은 사진은 그 가게에서 찍은 것이 아니라 같은 음식의 예시 사진입니다.

## 사실 확인 메모 (2026-11-20 기준)

- 시코쿠페리 다카마쓰↔도노쇼: 12:45→13:45, 13:40→14:40 / 15:45→16:45, 16:30→17:30 · 약 60분 · 성인 편도 700엔, 왕복 1,330엔 · 여객 예약 없이 선착순.
- 엔젤로드 물때(11/26): 02:30–08:30, 15:51–21:51 (시코쿠페리 공식 표).
- 리쓰린 공원 가을 라이트업: 2026.11.20–29 · 17:00–21:00(입장 마감 20:30) · 성인 500엔 · 밤 배 850엔(17:30–20:00, 15분 간격).
- 리쓰린 공원 11월 개원: 06:30–17:00. 기쿠게쓰테이 09:00–16:30(접수 16:00), 말차 800엔·센차 600엔.
- 잇카쿠 다카마쓰점: 목요일 17:00–23:00, L.O. 22:30.
- 우동보 다카마쓰 본점: 목요일 11:00–14:30.
- 우동 바카이치다이: 06:00–18:00, 현금만.
- 우에하라야 본점: 09:30–14:30, 일요일 휴무.
- 공항 리무진: 효고마치까지 1,300엔, 약 37~40분, 2번 승강장.
