.PHONY: install_api_dependencies
install_api_dependencies:
	poetry install -C api/

.PHONY: run_api
run_api:
	cd api && serverless offline start --stage local --reloadHandler --httpPort 4000
