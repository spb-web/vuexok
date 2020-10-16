#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

rm -fr docs
mv ./vuepress/.vuepress/dist docs

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

