#!/bin/bash

NC='\033[0m'
GREEN='\033[0;32m'
BOLD_GREEN='\033[1;32m'
YELLOW='\033[1;33m'
ORANGE='\033[38;5;208m'
RED='\033[0;31m'
BOLD_BLUE='\033[1;34m'

SHARED_PACKAGE_NAME="homelead-shared-api"

ROOT_DIR="$(dirname "$(pwd)")/"
SHARED_DIR="."
FILES_TO_COPY=(
  ".npmrc"
  ".prettierignore"
  ".prettierrc"
  "build"
  "eslint.config.mjs"
  "package.json"
  "README.md"
  "src"
  "tsconfig.json"
  "webStorm.config.js"
)

DO_CLEAN=false
TARGET_PROJECTS=()

for arg in "$@"; do
  case "$arg" in
    --clean)
      DO_CLEAN=true
      ;;
    *)
      TARGET_PROJECTS+=("$arg")
      ;;
  esac
done

print_info() {
  echo -e "${YELLOW}[INFO] $1${NC}"
}

print_success() {
  echo -e "${GREEN}[SUCCESS] $1${NC}"
}

print_warning() {
  echo -e "${ORANGE}[WARNING] $1${NC}"
}

print_error() {
  echo -e "${RED}[ERROR] $1${NC}"
}

print_start() {
  echo -e "\n${BOLD_BLUE}========== Starting for $1 ==========${NC}\n"
}

print_end() {
  echo -e "\n${BOLD_BLUE}========== Finished for $1 ==========${NC}\n"
}

copy_shared_to_service() {
  local target_project="$1"
  if [ "$target_project" = "$SHARED_PACKAGE_NAME" ]; then
    print_info "Skipping $SHARED_PACKAGE_NAME."
    return
  fi

  print_start "$target_project"

  local target_dir="$ROOT_DIR$target_project/node_modules/$SHARED_PACKAGE_NAME"
  mkdir -p "$target_dir"

  print_info "Removing existing files..."
  for item in "${FILES_TO_COPY[@]}"; do
    if [ -e "$target_dir/$item" ]; then
      rm -rf "$target_dir/$item"
      print_warning "Removed $item"
    fi
  done

  print_info "Copying new files..."
  for item in "${FILES_TO_COPY[@]}"; do
    if [ -e "$SHARED_DIR/$item" ]; then
      cp -r "$SHARED_DIR/$item" "$target_dir"
      print_success "Copied $item"
    else
      print_warning "Skipping missing file: $item"
    fi
  done

  if [ "$DO_CLEAN" = true ]; then
    print_info "Running clean process (npm install + build)..."
    cd "$target_dir" || { print_error "Failed to cd into $target_dir"; exit 1; }
    rm -rf node_modules package-lock.json build
    npm install
    npm run build
  else
    print_info "Skipping cleaning (--clean not provided)"
  fi

  print_end "$target_project"
}

if [ ${#TARGET_PROJECTS[@]} -eq 0 ]; then
  print_info "No service specified. running for all service..."
  for dir in "$ROOT_DIR"*/; do
    dir_name=$(basename "$dir")
    if [ "$dir_name" != "$SHARED_PACKAGE_NAME" ] && [ -d "$dir/.git" ]; then
      copy_shared_to_service "$dir_name"
    fi
  done
else
  for project in "${TARGET_PROJECTS[@]}"; do
    copy_shared_to_service "$project"
  done
fi
