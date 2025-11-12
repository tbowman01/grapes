---
sidebar_position: 1
---

# Evaluation Overview

GRAPES uses **Promptfoo** as its evaluation framework to test and validate AI models across multiple providers.

## What is Promptfoo?

[Promptfoo](https://promptfoo.dev) is an open-source tool for testing and evaluating LLM outputs. It provides:

- Multi-provider support (Ollama, OpenAI, Anthropic, Azure, Bedrock)
- Flexible assertion system
- Cost and latency tracking
- JSON/JSONL dataset support
- CI/CD integration

## Evaluation Architecture

```
┌─────────────────┐
│   Datasets      │
│  (JSONL files)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Promptfoo     │
│  Configuration  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Providers     │
│  (AI Models)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Assertions    │
│   & Metrics     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Results      │
│  (JSON/HTML)    │
└─────────────────┘
```

## Test Datasets

GRAPES includes **40 test cases** across 4 categories:

### 1. Code Review (10 cases)
Tests ability to identify:
- Code quality issues
- Runtime errors
- Edge cases
- Memory leaks
- Closure bugs

### 2. Technical Q&A (10 cases)
Tests knowledge of:
- DevOps (CI/CD, Docker, Kubernetes)
- Web technologies (REST, webhooks)
- Authentication (JWT, sessions)
- Databases (SQL vs NoSQL)
- Programming concepts

### 3. Security Review (10 cases)
Tests ability to detect:
- SQL injection
- XSS vulnerabilities
- Authentication issues
- Path traversal
- CORS misconfigurations
- Secret exposure

### 4. Performance Review (10 cases)
Tests understanding of:
- Algorithm complexity
- Async patterns
- DOM manipulation
- Array operations
- Bundle optimization

## Evaluation Metrics

### Automatic Metrics

- **Pass/Fail Rate** - Percentage of tests passed
- **Response Length** - Character count validation
- **Word Count** - Minimum word requirements
- **Latency** - Response time in milliseconds
- **Cost** - API cost per test

### Custom Assertions

Define custom checks in `eval/promptfoo.yaml`:

```yaml
defaultTest:
  assert:
    - type: javascript
      value: output.includes('security')
      metric: 'Contains security keyword'

    - type: llm-rubric
      value: Response is accurate and helpful
```

## Running Evaluations

### Local Execution

```bash
# With Docker
make eval

# Without Docker
make eval-local
```

### CI/CD Execution

Evaluations run automatically:
- On PR changes to `eval/**`
- Nightly at 2 AM UTC
- Manual workflow dispatch

## Viewing Results

### HTML Reports

```bash
make report
open eval/output/report.html
```

### Baseline Comparison

```bash
make baseline-compare
```

### Cost Analysis

```bash
make cost-report
```

## Best Practices

1. **Start with small datasets** - Validate prompts before scaling
2. **Use local models for development** - Save costs with Ollama
3. **Create baselines** - Track regression over time
4. **Monitor costs** - Review spending regularly
5. **Version control datasets** - Track test case evolution

## Next Steps

- [Datasets](datasets) - Learn about test datasets
- [Providers](providers) - Configure AI providers
- [Reports](reports) - Generate and analyze reports
