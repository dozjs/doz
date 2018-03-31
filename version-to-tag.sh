#!/usr/bin/env bash
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]')
git commit -a -m "v$PACKAGE_VERSION"
git tag -a "v$PACKAGE_VERSION" -m "v$PACKAGE_VERSION"
git push &&  git push --tags