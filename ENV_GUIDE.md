# 환경 변수 설정 가이드 (.env)

이 프로젝트는 **Vite**를 빌드 도구로 사용하고 있으며, 클라이언트 측 코드에서 환경 변수에 접근하기 위해서는 반드시 `VITE_` 접두사를 붙여야 합니다.

프로젝트 루트 디렉토리에 `.env` 파일을 생성하여 아래 내용을 설정할 수 있습니다.

---

## 1. 주요 환경 변수

| 변수명 (Key) | 설명 (Description) | 예시 값 (Example) |
| :--- | :--- | :--- |
| **`VITE_USE_REAL_API`** | 실제 백엔드 API를 사용할지, 내부 Mock Data를 사용할지 결정합니다.<br> - `true`: 실제 서버(`fetch`) 통신<br> - `false`: Mock Data 사용 | `false` |
| **`VITE_API_BASE_URL`** | 모든 API 요청의 **공통 기본 경로(Prefix)**입니다.<br>코드에서 이 경로 뒤에 `/resorts` 등을 자동으로 붙여 사용합니다. | `http://localhost:8000/api/v1` |

---

## 2. 설정 예시 (Configuration Scenarios)

### 시나리오 A: 프론트엔드 단독 개발 (Mock Mode)
백엔드 서버가 준비되지 않았거나, UI 개발만 진행할 때 사용합니다.

```ini
# .env
VITE_USE_REAL_API=false
# API URL은 무시되지만 형식을 위해 남겨둘 수 있습니다.
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 시나리오 B: 로컬 백엔드 연동 (Local Integration)
로컬에서 실행 중인 Python FastAPI 서버와 통신할 때 사용합니다.

```ini
# .env
VITE_USE_REAL_API=true
VITE_API_BASE_URL=http://localhost:8000/api/v1
```
> **참고:** 위와 같이 설정하면 실제 요청은 `http://localhost:8000/api/v1/resorts` 로 전송됩니다.

### 시나리오 C: 운영/배포 환경 (Production)
실제 운영 서버 IP나 도메인을 바라보게 설정합니다.

```ini
# .env
VITE_USE_REAL_API=true
VITE_API_BASE_URL=http://192.168.0.100:8000/api/v1
```

---

## 3. 주의사항
1. `.env` 파일은 민감한 정보를 포함할 수 있으므로 **Git 저장소에 커밋하지 않는 것**을 권장합니다 (`.gitignore`에 추가).
2. 환경 변수를 변경한 후에는 **개발 서버를 재시작**해야 변경 사항이 적용됩니다.