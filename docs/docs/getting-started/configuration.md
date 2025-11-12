---
sidebar_position: 3
---

# Configuration

Configure GRAPES Hub for your environment and requirements.

## Environment Variables

GRAPES uses `.env` for configuration. Copy `.env.example` to `.env` and customize:

### Container Image Settings

```bash
# Image registry (ghcr.io, docker.io, etc.)
IMAGE_REGISTRY=ghcr.io

# Your GitHub username or organization
IMAGE_OWNER=your-username

# Image name
IMAGE_NAME=grapes/automation-runner

# Image tag
IMAGE_TAG=latest
```

### Documentation Settings

```bash
# Base URL for documentation site
DOCS_BASE_URL=/grapes

# Site title
DOCS_TITLE=GRAPES Hub

# Site URL
DOCS_URL=https://your-username.github.io
```

### Evaluation Settings

```bash
# Provider: ollama, openai, anthropic, azure, bedrock
EVAL_MODEL_PROVIDER=ollama

# Model name (provider-specific)
EVAL_MODEL=llama3.1:8b

# Timeout in milliseconds
EVAL_TIMEOUT_MS=60000

# Maximum concurrent evaluations
EVAL_MAX_CONCURRENCY=5
```

### Provider-Specific Settings

#### Ollama
```bash
OLLAMA_BASE_URL=http://host.docker.internal:11434
```

#### OpenAI
```bash
OPENAI_API_KEY=sk-...
```

#### Anthropic
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

### Security Settings

```bash
# Trivy severity levels to scan
TRIVY_SEVERITY=CRITICAL,HIGH

# SBOM format
SBOM_FORMAT=cyclonedx-json
```

## Promptfoo Configuration

Edit `eval/promptfoo.yaml` to customize evaluations:

### Add Prompts

```yaml
prompts:
  - id: my-custom-prompt
    label: 'My Custom Prompt'
    content: |
      You are a helpful assistant.
      {{question}}
```

### Configure Providers

```yaml
providers:
  # Ollama
  - id: ollama-llama
    label: 'Ollama Llama 3.1 8B'
    config:
      model: ollama:chat:llama3.1:8b
      baseUrl: http://host.docker.internal:11434
      temperature: 0.7

  # OpenAI
  - id: openai-gpt4
    label: 'OpenAI GPT-4'
    config:
      model: openai:gpt-4-turbo-preview
      temperature: 0.7

  # Anthropic
  - id: anthropic-claude
    label: 'Anthropic Claude 3 Sonnet'
    config:
      model: anthropic:messages:claude-3-sonnet-20240229
      temperature: 0.7
```

### Add Assertions

```yaml
defaultTest:
  assert:
    # Response length
    - type: javascript
      value: output.length > 50
      metric: 'Response length check'

    # Keyword presence
    - type: javascript
      value: output.toLowerCase().includes('security')
      metric: 'Contains security keyword'

    # Latency
    - type: latency
      threshold: 5000

    # Cost
    - type: cost
      threshold: 0.50

    # LLM-based grading
    - type: llm-rubric
      value: Response is technically accurate and helpful
```

### Set Output Path

```yaml
outputPath: ./output

testConfig:
  maxConcurrency: 3
  timeout: 30000
```

## GitHub Actions Configuration

### Repository Secrets

Add these secrets in GitHub Settings → Secrets and Variables → Actions:

- `OPENAI_API_KEY` (if using OpenAI)
- `ANTHROPIC_API_KEY` (if using Anthropic)
- `GHCR_PAT` (if needed for GHCR authentication)

### Workflow Triggers

Edit workflow files in `.github/workflows/` to customize triggers:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    paths: ['eval/**']
  schedule:
    - cron: '0 2 * * *'  # Nightly at 2 AM
  workflow_dispatch:  # Manual trigger
```

### Workflow Permissions

Adjust permissions as needed:

```yaml
permissions:
  contents: read
  packages: write
  security-events: write
```

## Docusaurus Configuration

Edit `docs/docusaurus.config.js`:

### Site Metadata

```javascript
const config = {
  title: 'Your Site Title',
  tagline: 'Your tagline',
  url: 'https://your-domain.com',
  baseUrl: '/your-base/',
  organizationName: 'your-org',
  projectName: 'your-project',
};
```

### Theme Configuration

```javascript
themeConfig: {
  colorMode: {
    defaultMode: 'light',
    disableSwitch: false,
    respectPrefersColorScheme: true,
  },
  navbar: {
    title: 'Your Title',
    items: [
      // Your navbar items
    ],
  },
}
```

## Advanced Configuration

### Custom Evaluation Scripts

Create custom evaluation logic in `src/evaluation/`:

```python
# src/evaluation/custom_evaluator.py
def evaluate_custom(response, expected):
    # Your custom evaluation logic
    return {
        'score': 0.95,
        'passed': True,
        'details': 'Custom evaluation passed'
    }
```

### Docker Build Arguments

Modify `containers/automation-runner/Dockerfile`:

```dockerfile
ARG NODE_VERSION=22
ARG BASE_IMAGE=node:${NODE_VERSION}-bookworm
```

### Makefile Customization

Add custom targets to `Makefile`:

```makefile
.PHONY: my-custom-target

my-custom-target: ## My custom command
	@echo "Running custom command..."
	# Your command here
```

## Next Steps

- [Evaluation Overview](../evaluation/overview) - Learn about evaluations
- [Security Scanning](../cicd/security) - Security configuration
- [Contributing](../contributing) - Contribute to GRAPES
