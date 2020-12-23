SHELL=bash
BUILD_BUCKET=aantillonl-build-resources

template.packaged.yaml: template.yaml
	aws cloudformation package \
		--template-file $^ \
		--s3-bucket $(BUILD_BUCKET) \
		--output-template-file $@

.PHONY: deploy
deploy: template.packaged.yaml
	aws cloudformation deploy \
		--template-file $^ \
		--stack-name localband-app \
		--capabilities CAPABILITY_IAM