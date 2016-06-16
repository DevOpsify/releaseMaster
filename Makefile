all: releasemaster
push: push-releasemaster
.PHONY: push push-releasemaster releasemaster clean


TAG = 0.1

releasemaster:
	docker build -t nextlink/releasemaster .
	docker tag nextlink/releasemaster nextlink/releasemaster:$(TAG)


push-releasemaster: releasemaster
	docker push nextlink/releasemaster
	docker push nextlink/releasemaster:$(TAG)


clean:
	docker rmi nextlink/releasemaster:$(TAG) || :
	docker rmi nextlink/releasemaster || :
