# 블로그 에이전트 실행 가이드

## 트리거
사용자가 "글 써줘 [주제]" 라고 하면 실행

## 파이프라인 순서

### Step 1. SEO 리서처
- WebSearch로 네이버/구글 상위글 검색
- 프롬프트: `blog-agent/prompts/01-seo-researcher.md`
- 출력: 키워드 분석, 상위글 분석, SEO 전략

### Step 2. 시나리오 작가
- SEO 리서처 결과를 입력으로 받음
- 프롬프트: `blog-agent/prompts/02-scenario-writer.md`
- 출력: 글 구조, 목차, 사진 계획

### Step 3. 후킹멘트 작가
- 시나리오 작가 결과를 입력으로 받음
- 프롬프트: `blog-agent/prompts/03-hook-writer.md`
- 출력: 제목 후보, 도입부 후킹 멘트, 소제목

### Step 4. 본문 작가
- 시나리오 + 후킹멘트 결과를 입력으로 받음
- 프롬프트: `blog-agent/prompts/04-body-writer.md`
- 출력: 완성된 블로그 본문

### Step 5. 사진작가
- 본문의 [사진] 태그 확인
- Make 웹훅으로 Google Drive 사진 목록 가져오기
  - URL: `MAKE_WEBHOOK_PHOTO_LIST`
  - Body: `{"folder_id": "서브폴더ID"}`
- Drive에 사진 없으면 DALL-E로 이미지 생성
  - OpenAI API: `OPENAI_API_KEY`
- 프롬프트: `blog-agent/prompts/05-photographer.md`
- 출력: 사진 배치 계획, 이미지 URL 목록

### Step 6. 편집장
- 모든 결과물을 종합 검수
- 프롬프트: `blog-agent/prompts/06-editor.md`
- 출력: 최종 완성본

### Step 7. 텔레그램 전송
- Telegram Bot API로 최종 글 전송
  - Bot Token: `TELEGRAM_BOT_TOKEN`
  - Chat ID: `TELEGRAM_CHAT_ID`
- 사진도 함께 전송 (sendPhoto / sendMediaGroup)

### Step 8. 사용한 Drive 사진 이동
- Make 웹훅으로 사용한 사진을 사용완료 폴더로 이동
  - URL: `MAKE_WEBHOOK_PHOTO_MOVE`
  - Body: `{"file_id": "파일ID", "target_folder_id": "사용완료폴더ID"}`

## 환경변수 (.env)
- TELEGRAM_BOT_TOKEN
- TELEGRAM_CHAT_ID
- OPENAI_API_KEY
- GOOGLE_DRIVE_FOLDER_ID
- MAKE_WEBHOOK_PHOTO_LIST
- MAKE_WEBHOOK_PHOTO_MOVE

## Make 시나리오
- [블로그] 사진 목록 가져오기 (ID: 9004609)
- [블로그] 사진 사용완료 이동 (ID: 9004610)

## Google Drive 폴더 구조
```
07.마케팅/ (ID: 1d3WGibJmYoxyTrbjKVCRZ7ZEe6KDFODm)
  ├─ 수업사진/
  ├─ 시설사진/
  ├─ 일상/
  ├─ 비포애프터/
  ├─ 트레이너/
  └─ 사용완료/
```

## 주의사항
- Make 시나리오에서 Google Drive 연결(Connection) 설정 필요
- Make 시나리오 활성화(ON) 필요
- Google Drive 서브폴더 ID는 폴더 생성 후 확인 필요
