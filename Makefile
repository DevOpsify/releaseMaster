all: start-local

.PHONY: build push start start-local test clean


TAG = 0.1
REPORTER = list

start-local:
	docker-compose -f docker-compose.local.yml up --build -d

build:
	docker build -t nextlink/releasemaster .
	docker tag nextlink/releasemaster nextlink/releasemaster:$(TAG)

push: build
	docker push nextlink/releasemaster
	docker push nextlink/releasemaster:$(TAG)

start:
	docker-compose up -d

clean:
	docker rmi nextlink/releasemaster:$(TAG) || :
	docker rmi nextlink/releasemaster || :

test:
	npm install
	npm test

