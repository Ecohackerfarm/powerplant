#!/bin/bash
GIT_PATH="./.git"
if [ -d "$GIT_PATH" ]; then
  echo "Set git core.hooks to directory: .git_hooks"
  git config core.hooksPath .git_hooks
fi
