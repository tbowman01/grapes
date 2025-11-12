# Changelog

All notable changes to GRAPES Hub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-12

### Added - Year 1 Complete

#### Q1: Infrastructure Bootstrap
- Repository scaffolding with complete directory structure
- Multi-stage Dockerfile with distroless runtime
- Core Makefile with 15+ targets
- GitHub Container Registry integration
- Basic CI/CD pipeline
- Environment configuration system

#### Q2: Evaluation Pipeline MVP
- Promptfoo integration with 3 providers (Ollama, OpenAI, Anthropic)
- 40 evaluation test cases across 4 categories
- Security scanning workflow (Trivy, SBOM, secrets)
- Baseline comparison system
- HTML report generation
- Cost tracking and analysis
- 2 new datasets (security, performance reviews)

#### Q3: Documentation & Observability
- Complete Docusaurus documentation site
- GitHub Pages deployment workflow
- ADR auto-indexing system
- Workflow failure monitoring
- 8 comprehensive documentation pages
- Custom branding and theme

#### Q4: Security & Developer Experience
- Dependabot configuration for automated updates
- Pre-commit hooks for code quality
- OIDC authentication for workflows
- Wiki synchronization script
- Developer onboarding automation
- Release workflow with artifact generation

### Workflows
- `build-image.yml` - Build and publish container images
- `evaluate.yml` - Run AI model evaluations
- `security-scan.yml` - Comprehensive security scanning
- `docs-deploy.yml` - Deploy documentation to GitHub Pages
- `adr-index.yml` - Auto-generate ADR index
- `workflow-failure-alert.yml` - Monitor and alert on failures
- `housekeeping.yml` - Repository maintenance automation
- `onboarding.yml` - Welcome and guide new contributors
- `release.yml` - Automated release management

### Scripts
- `adr-index.mjs` - ADR indexing automation
- `baseline-compare.mjs` - Regression detection
- `cost-tracker.mjs` - Cost monitoring
- `generate-report.mjs` - HTML report generation
- `ci-validate-env.sh` - Environment validation
- `docs-build.mjs` - Documentation build
- `wiki-sync.sh` - Wiki synchronization

### Documentation
- Complete installation guide
- Quick start tutorial (5 minutes)
- Configuration reference
- Evaluation system overview
- 3-year roadmap
- Contributing guidelines
- Architecture decision records

### Security
- Trivy vulnerability scanning
- SBOM generation (CycloneDX & SPDX)
- Secrets detection with TruffleHog
- Dependency review automation
- Pre-commit hooks for secret prevention
- OIDC authentication support

## [Unreleased]

### Planned for Year 2
- AI-powered code review
- Multi-model orchestration
- Advanced observability with Grafana/Prometheus
- VS Code extension
- Slack/Discord integrations

## Release Notes

### v1.0.0 Highlights

GRAPES Hub v1.0.0 represents the completion of Year 1 development, delivering a production-ready AI-powered GitHub automation framework with:

- **Complete Infrastructure** - Containerized, secure, and scalable
- **40 Test Cases** - Comprehensive evaluation coverage
- **Enterprise Security** - SBOM, Trivy, secrets detection
- **Professional Documentation** - Docusaurus site with GitHub Pages
- **Automated Operations** - 9 GitHub Actions workflows
- **Developer Experience** - Pre-commit hooks, onboarding, release automation

### Breaking Changes

None - this is the initial stable release.

### Migration Guide

This is the first stable release. For new installations, see the [Installation Guide](https://tbowman01.github.io/grapes/docs/getting-started/installation).

### Known Issues

None at this time.

### Contributors

- @tbowman01 - Initial development and architecture

---

**Full Changelog**: https://github.com/tbowman01/grapes/commits/v1.0.0
