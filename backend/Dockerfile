# 빌드 스테이지
FROM node:20-alpine AS builder

WORKDIR /app

# 필요한 빌드 도구 설치
RUN apk add --no-cache python3 make g++ && npm install -g pnpm

# 패키지 파일 복사 및 의존성 설치
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 소스 복사 및 빌드
COPY . .
RUN pnpm build

# 프로덕션 스테이지
FROM node:20-alpine AS production

WORKDIR /app

# 필요한 런타임 도구 설치
RUN npm install -g pnpm

# 프로덕션 의존성 설치
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# 빌드된 파일 복사
COPY --from=builder /app/dist ./dist

# 환경 변수 설정
ENV NODE_ENV=production

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "dist/main"]
