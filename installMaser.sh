#!/bin/bash

#hook/post-receive

#CONFIG

PRODDIR="./"

read oldrev newrev refname

if [ $refname = "refs/heads/prod" ]; then

echo "===== DEPLOYING APP ====="

unset GIT_DIR

git pull --ff-only origin prod

echo $?

echo "====== OK ====="

else

echo "Warning Commit not deployed, please use prod branch"

fi