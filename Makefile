.PHONY: install_api_dependencies
install_api_dependencies:
	poetry install -C api/

.PHONY: run_api
run_api:
	cd api && serverless offline start --stage local --reloadHandler --httpPort 4000

.PHONY: build_webui
build_webui:
	cd webui && npm run build

.PHONY: deploy_dev
deploy_dev:
	serverless deploy --stage dev
	ENVIRONMENT=dev ./invalidate-cloudfront-cache.sh
