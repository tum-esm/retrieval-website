#!/bin/bash

yarn build

docker build --platform linux/amd64 -t gcr.io/tum-esm/retrieval-cms-v3 .
docker push gcr.io/tum-esm/retrieval-cms-v3:latest

COMMIT_SHA="$(git rev-parse --short --verify HEAD)"
gcloud run deploy retrieval-cms-v3 \
    --image=gcr.io/tum-esm/retrieval-cms-v3:latest \
    --platform managed --tag "commit-$COMMIT_SHA"
