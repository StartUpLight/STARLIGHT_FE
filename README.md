# 🚀 STARLIGHT_FE 

## ⚒️ 기술 스택
- Next.js (App router)
- TypeScript
- Tailwind

## 👥 팀 작업 방식

> **Issue 기반 개발 워크플로우**를 따릅니다. 모든 작업은 Issue에서 시작하여 PR로 완료됩니다.

### 🌳 브랜치 사용법
```bash
main       # 배포용
  ├── develop  # 개발 메인
  ├── feat/#이슈번호-기능명  # 새 기능 개발
  └── fix/#이슈번호-버그명   # 버그 수정
  └── ...
```

### 📝 브랜치 이름 예시 (Issue 번호 포함)
```bash
feat/#12-user-login     # Issue #12: 로그인 기능
feat/#15-file-upload    # Issue #15: 파일 업로드
fix/#23-login-bug       # Issue #23: 로그인 버그 수정
```

### 💬 커밋 메시지 (Issue 번호 포함)
```bash
#12 feat: 로그인 기능을 추가
#23 fix: 회원가입 오류를 수정
#25 docs: README 업데이트 
```

### 💬 PR 및 ISSUE 제목
```bash
FEAT: 로그인 기능을 추가한다
FIX: 회원가입 오류를 수정한다
DOCS: README 업데이트 
```

## 🔄 개발 흐름 (Issue → Branch → PR)

1. **Issue 생성/확인** → GitHub Issues에서 작업할 이슈 생성 또는 할당받기
2. **브랜치 생성** → `feat/이슈번호-기능명` 으로 Issue 기반 브랜치 만들기
3. **코딩** → Issue 요구사항에 맞는 기능 개발
4. **테스트** → 로컬에서 잘 돌아가는지 확인
5. **PR 생성** → Pull Request 올리기 (Issue 번호 연결)
6. **코드 리뷰** → 팀원들이 코드 확인
7. **머지** → dev 브랜치에 합치기 후 Issue 자동 닫힘 (앱스토어 배포 전까지 main에 바로 반영)

