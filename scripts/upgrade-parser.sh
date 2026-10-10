#!/usr/bin/env sh

# abort on errors
set -e

# upgrade parser to latest version
yarn upgrade sql-parser-cst@latest

# extract version from package.json
version=$(node -p "require('./package.json').dependencies['sql-parser-cst'].replace(/^./, '');")

git commit -am "Upgrade parser to $version"
