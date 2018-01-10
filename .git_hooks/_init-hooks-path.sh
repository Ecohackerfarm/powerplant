#!/bin/sh
gitPath="./.git"
if ( -d "$gitPath") then
  echo "Set git core.hooks to directory: .git_hooks"
  git config core.hooksPath .git_hooks
fi
