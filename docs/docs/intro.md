---
sidebar_position: 1
---

# Introduction

Welcome to **GRAPES Hub** - GitHub Remote AI Powered Evaluation Solution!

GRAPES is a production-grade template repository for AI-powered GitHub automations, featuring model evaluation, workflow orchestration, and comprehensive security scanning.

## What is GRAPES?

GRAPES Hub is an **AI-driven automation framework** that provides:

- 🤖 **AI Model Evaluation** - Automated testing and evaluation using Promptfoo
- 🔐 **Security Scanning** - Trivy, SBOM generation, and secrets detection
- ⚡ **CI/CD Workflows** - Containerized automation with GitHub Actions
- 📊 **Reporting** - Visual dashboards, cost tracking, and baseline comparison
- 📦 **Multi-Provider Support** - Ollama, OpenAI, Anthropic, Azure, Bedrock

## Quick Start

Get started in **5 minutes**:

```bash
# Clone the repository
git clone https://github.com/tbowman01/grapes.git
cd grapes

# Set up environment
make setup

# Build container image
make image

# Run evaluations
make eval-local
```

## Key Features

### AI-Powered Evaluation
Automated code reviews and evaluations with 40+ test cases across:
- Code quality and best practices
- Security vulnerabilities
- Performance optimization
- Technical Q&A

### Security & Compliance
- Vulnerability scanning with Trivy
- SBOM generation (CycloneDX & SPDX)
- Secrets detection with TruffleHog
- Automated dependency review

### Developer Experience
- Simple Makefile commands
- Comprehensive documentation
- Pre-configured workflows
- Visual HTML reports

## Architecture

GRAPES uses a **containerized architecture** with:

- **Distroless containers** for security
- **GitHub Actions** for CI/CD
- **Promptfoo** for evaluations
- **GitHub Container Registry** for images

## Next Steps

- [Installation Guide](getting-started/installation) - Detailed setup instructions
- [Quick Start Guide](getting-started/quick-start) - Get running fast
- [Configuration](getting-started/configuration) - Customize for your needs
- [Roadmap](roadmap) - See what's coming next

## Community

- [GitHub Discussions](https://github.com/tbowman01/grapes/discussions) - Ask questions
- [Issues](https://github.com/tbowman01/grapes/issues) - Report bugs
- [Contributing](contributing) - Help improve GRAPES
