all: build-local

.PHONY: build push start build-local start-local clean


TAG = 0.1

start-local:
	docker-compose -f docker-compose.local.yml up --build -d

build:
	docker build -t nextlink/releasemaster .
	docker tag nextlink/releasemaster nextlink/releasemaster:$(TAG)

push: releasemaster
	docker push nextlink/releasemaster
	docker push nextlink/releasemaster:$(TAG)

start:
	docker-compose up -d

clean:
	docker rmi nextlink/releasemaster:$(TAG) || :
	docker rmi nextlink/releasemaster || :
