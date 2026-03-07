# 노네임피트니스 (NONAME FITNESS) 홈페이지

## 프로젝트 개요
천안 두정동에 위치한 프리미엄 피트니스 센터 **노네임피트니스**의 공식 홈페이지입니다.
다크 톤의 프리미엄 디자인 + 골드 포인트 + 퍼플 LED 액센트가 특징입니다.

## 주요 기능 (완료)

### ✅ 구현된 기능
1. **히어로 섹션** - 체육관 내부 실사 배경 + 패럴랙스 효과 + 숫자 카운터 애니메이션
2. **소개 섹션** - 노네임피트니스 소개 + 퍼플 LED 시설 이미지 + 특징 4가지 카드
3. **프로그램 섹션** (5개 카드)
   - 헬스 (GYM)
   - 퍼스널트레이닝 (PT) - BEST
   - **무제한 PT (UNLIMITED)** - NEW 🆕
   - 스피닝 (SPINNING)
   - 이벤트 프로그램
4. **시설 갤러리** - 5장 사진 슬라이드 갤러리 (자동재생 + 수동 네비게이션 + 키보드 지원)
5. **시설 정보 그리드** - 6가지 편의시설 정보
6. **CTA 섹션** - 전화 상담 유도 / 문화비 소득공제 안내
7. **오시는 길** - 주소, 전화번호, 운영시간, 스피닝 수업시간 + 지도
8. **반응형 디자인** - 데스크톱, 태블릿, 모바일 완벽 대응
9. **스크롤 애니메이션** - IntersectionObserver 기반 요소 등장 효과
10. **모바일 메뉴** - 햄버거 메뉴 + ESC 키 닫기

### 📂 파일 구조
```
index.html                  메인 홈페이지
css/
  └── style.css             스타일시트 (다크 프리미엄 테마 + 갤러리)
js/
  └── main.js               인터랙션 스크립트 (갤러리 포함)
images/
  ├── facility-main.jpg     근력 머신 존 (사용자 제공)
  ├── facility-bench.jpg    프리웨이트 벤치 존 (사용자 제공)
  ├── facility-purple.jpg   퍼플 LED 케이블&덤벨 존 (사용자 제공)
  ├── facility-stretch.jpg  스트레칭 전용 공간 (사용자 제공)
  ├── gym-interior.jpg      체육관 전경 (트레드밀 존)
  ├── dumbbells.jpg          BESKO 덤벨 랙
  ├── gym-section.jpg       헬스 GYM 프로그램
  ├── pt.jpg                퍼스널 트레이닝
  ├── spinning.jpg          스피닝 전용실
  ├── event.jpg             이벤트 프로그램
  ├── logo-dark.jpg         로고 (다크 배경)
  └── logo-light.jpg        로고 (라이트 배경)
```

### 🔗 페이지 내 섹션
| 섹션 | 앵커 | 설명 |
|------|------|------|
| 홈 | `#home` | 히어로 배너 |
| 소개 | `#about` | 센터 소개 |
| 프로그램 | `#programs` | GYM/PT/무제한PT/스피닝/이벤트 |
| 시설 | `#facilities` | 시설 갤러리 + 편의시설 |
| 오시는 길 | `#contact` | 위치/연락처 |

## 연락처 정보
- **주소**: 충남 천안시 서북구 두정로 196, 2층
- **전화**: 041-357-9290
- **원본 사이트**: [www.nonamefitness.kr](https://www.nonamefitness.kr)
- **인스타그램**: [@noname_fitness_](https://www.instagram.com/noname_fitness_/)

## 기술 스택
- HTML5 (시맨틱 마크업)
- CSS3 (CSS Variables, Grid, Flexbox, Animations)
- Vanilla JavaScript (IntersectionObserver, Gallery, Smooth Scroll)
- Google Fonts (Noto Sans KR)
- Font Awesome 6 (아이콘)

## 추후 개선 사항
- [ ] 가격표/회원권 안내 페이지
- [ ] 트레이너 프로필 페이지
- [ ] 네이버/카카오 지도 API 정확한 좌표 연동
- [ ] 온라인 상담 예약 폼
- [ ] 블로그/공지사항 연동
