build: node_modules
	npm run build

node_modules: package-lock.json
	npm ci
	
publish: build
	cd build && aws s3 sync . s3://localband.alejandroantillon.com
