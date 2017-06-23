IMAGE_NAME := quay.io/rdm-academy/web

GIT_SHA := $(or $(shell git log -1 --pretty=format:"%h" .), "latest")
GIT_TAG := $(shell git describe --tags --exact-match 2>/dev/null)
GIT_BRANCH := $(shell git symbolic-ref -q --short HEAD)

dist:
	yarn build

docker:
	docker build -t ${IMAGE_NAME}:${GIT_SHA} .

	docker tag ${IMAGE_NAME}:${GIT_SHA} ${IMAGE_NAME}:${GIT_BRANCH}

	if [ -n "${GIT_TAG}" ] ; then \
		docker tag ${IMAGE_NAME}:${GIT_SHA} ${IMAGE_NAME}:${GIT_TAG} ; \
  fi;

	if [ "${GIT_BRANCH}" == "master" ]; then \
		docker tag ${IMAGE_NAME}:${GIT_SHA} ${IMAGE_NAME}:latest ; \
	fi;

docker-push:
	docker push ${IMAGE_NAME}:${GIT_SHA}
	docker push ${IMAGE_NAME}:${GIT_BRANCH}

	if [ -n "${GIT_TAG}" ]; then \
		docker push ${IMAGE_NAME}:${GIT_TAG} ; \
  fi;

	if [ "${GIT_BRANCH}" == "master" ]; then \
		docker push ${IMAGE_NAME}:latest ; \
	fi;

.PHONY: dist
