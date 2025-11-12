.PHONY: help image push sbom scan eval docs-install docs-dev docs-build clean lint format test

# Load environment variables from .env if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Default values if not set in .env
IMAGE_REGISTRY ?= ghcr.io
IMAGE_OWNER ?= tbowman01
IMAGE_NAME ?= grapes/automation-runner
IMAGE_TAG ?= latest

FULL_IMAGE_NAME = $(IMAGE_REGISTRY)/$(IMAGE_OWNER)/$(IMAGE_NAME):$(IMAGE_TAG)

help: ## Show this help message
	@echo "GRAPES Hub - Available Make Targets"
	@echo "======================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

image: ## Build automation runner Docker image
	@echo "Building $(FULL_IMAGE_NAME)..."
	docker build -t $(FULL_IMAGE_NAME) \
		-f containers/automation-runner/Dockerfile .
	@echo "Image built successfully: $(FULL_IMAGE_NAME)"

push: ## Push image to container registry
	@echo "Pushing $(FULL_IMAGE_NAME)..."
	docker push $(FULL_IMAGE_NAME)
	@echo "Image pushed successfully"

sbom: ## Generate SBOM with Syft
	@echo "Generating SBOM for $(FULL_IMAGE_NAME)..."
	syft $(FULL_IMAGE_NAME) -o cyclonedx-json > sbom.json
	@echo "SBOM generated: sbom.json"

scan: ## Vulnerability scan with Trivy
	@echo "Scanning $(FULL_IMAGE_NAME) for vulnerabilities..."
	trivy image --scanners vuln --severity HIGH,CRITICAL $(FULL_IMAGE_NAME)

eval: ## Run Promptfoo evaluations
	@echo "Running evaluations..."
	docker run --rm \
		-v $(PWD)/eval:/work \
		-w /work \
		--network host \
		$(FULL_IMAGE_NAME) \
		npx --yes promptfoo@latest eval -c promptfoo.yaml

eval-local: ## Run evaluations locally (without Docker)
	@echo "Running evaluations locally..."
	cd eval && npx --yes promptfoo@latest eval -c promptfoo.yaml

docs-install: ## Install documentation dependencies
	@echo "Installing documentation dependencies..."
	cd docs && npm ci

docs-dev: ## Start documentation dev server
	@echo "Starting documentation dev server..."
	cd docs && npm run start

docs-build: ## Build documentation site
	@echo "Building documentation site..."
	node scripts/docs-build.mjs

lint: ## Run linter
	@echo "Running linter..."
	npm run lint

format: ## Format code with Prettier
	@echo "Formatting code..."
	npm run format

test: ## Run tests
	@echo "Running tests..."
	npm test

clean: ## Clean build artifacts and caches
	@echo "Cleaning build artifacts..."
	rm -rf node_modules docs/node_modules docs/build docs/.docusaurus
	rm -f sbom.json trivy-results.json
	rm -rf eval/results eval/output
	@echo "Clean complete"

setup: ## Initial setup (copy .env.example, install dependencies)
	@echo "Setting up GRAPES Hub..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "Created .env file from .env.example - please update with your values"; \
	else \
		echo ".env already exists, skipping..."; \
	fi
	@echo "Installing dependencies..."
	npm install
	@echo "Setup complete! Edit .env and run 'make image' to build the automation runner."

.DEFAULT_GOAL := help
