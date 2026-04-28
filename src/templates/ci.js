export function getCITemplate(provider, project) {
  if (provider === "GitHub Actions") {
    return `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20, 22]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint --if-present

      - name: Type check
        run: npm run type-check --if-present

      - name: Test
        run: npm test --if-present

      - name: Build
        run: npm run build --if-present

  docker:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t app .
        if: hashFiles('Dockerfile') != ''
`;
  }

  // GitLab CI
  return `stages:
  - install
  - lint
  - test
  - build

variables:
  NODE_IMAGE: node:22-alpine

install:
  stage: install
  image: \$NODE_IMAGE
  script:
    - npm ci
  cache:
    key: \$CI_COMMIT_REF_SLUG
    paths:
      - node_modules/

lint:
  stage: lint
  image: \$NODE_IMAGE
  script:
    - npm run lint --if-present
  cache:
    key: \$CI_COMMIT_REF_SLUG
    paths:
      - node_modules/

test:
  stage: test
  image: \$NODE_IMAGE
  script:
    - npm test --if-present
  cache:
    key: \$CI_COMMIT_REF_SLUG
    paths:
      - node_modules/

build:
  stage: build
  image: \$NODE_IMAGE
  script:
    - npm run build --if-present
  artifacts:
    paths:
      - dist/
  cache:
    key: \$CI_COMMIT_REF_SLUG
    paths:
      - node_modules/
`;
}
