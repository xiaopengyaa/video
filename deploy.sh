#!/usr/bin/env sh

# 发生错误时终止
set -e

# 构建
npm run build

# 进入构建文件夹
cd dist

# 如果你要部署到自定义域名
# echo 'www.example.com' > CNAME

git init

if git rev-parse --verify main; then
  # A branch named 'main' already exists
  git checkout main
else
  git checkout -b main
fi

git add -A
git commit -m 'deploy'

# 如果你要部署在 https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/xiaopengyaa/video.git main:gh-pages

cd -
