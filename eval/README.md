# GRAPES Evaluation Directory

This directory contains all AI model evaluation configurations, datasets, and baselines for GRAPES Hub.

## Structure

```
eval/
├── promptfoo.yaml         # Main evaluation configuration
├── datasets/              # Test datasets in JSONL format
│   ├── code-review-samples.jsonl
│   ├── technical-qa-samples.jsonl
│   ├── security-review-samples.jsonl
│   └── performance-review-samples.jsonl
├── baselines/             # Baseline results for comparison
└── output/                # Evaluation results (gitignored)
```

## Quick Start

### Run Evaluations Locally

```bash
# Using Docker (recommended)
make eval

# Without Docker
make eval-local

# Generate HTML report after evaluation
make report

# Compare against baseline
make baseline-compare

# Generate cost report
make cost-report
```

### Run in CI/CD

Evaluations run automatically:
- On pull requests that modify `eval/**`
- Nightly at 2 AM UTC
- Manually via workflow dispatch

## Configuration

### Promptfoo Configuration (`promptfoo.yaml`)

The main configuration file defines:
- **Prompts**: Test prompts for different use cases
- **Datasets**: Test data in JSONL format
- **Providers**: Model providers to evaluate (Ollama, OpenAI, Anthropic)
- **Assertions**: Quality checks and metrics
- **Output**: Where results are stored

### Adding New Datasets

Create a JSONL file in `datasets/` with this format:

```jsonl
{"question": "What is CI/CD?", "expected": "CI/CD stands for..."}
{"question": "Explain Docker", "expected": "Docker is..."}
```

Or for code reviews:

```jsonl
{"code": "function example() { ... }", "expected": "Review feedback..."}
```

Then reference it in `promptfoo.yaml`:

```yaml
datasets:
  - ./datasets/your-new-dataset.jsonl
```

## Available Datasets

### 1. Code Review Samples (`code-review-samples.jsonl`)
10 test cases covering:
- Code quality issues
- Runtime errors
- Edge cases
- Memory leaks
- Closure bugs

### 2. Technical Q&A (`technical-qa-samples.jsonl`)
10 test cases covering:
- DevOps concepts (CI/CD, Docker, Kubernetes)
- Web technologies (REST APIs, webhooks)
- Authentication (JWT, sessions)
- Database concepts (SQL vs NoSQL, CAP theorem)
- Programming concepts (memoization)

### 3. Security Review (`security-review-samples.jsonl`)
10 test cases covering:
- SQL injection
- XSS vulnerabilities
- Authentication issues
- Path traversal
- CORS misconfigurations
- Secret exposure
- Open redirects

### 4. Performance Review (`performance-review-samples.jsonl`)
10 test cases covering:
- Algorithm complexity
- Async patterns
- DOM manipulation
- Array operations
- Polling strategies
- Regex optimization
- Bundle size optimization

## Model Providers

### Ollama (Default)
Local models via Ollama:
```yaml
providers:
  - id: ollama-llama
    config:
      model: ollama:chat:llama3.1:8b
      baseUrl: http://host.docker.internal:11434
```

### OpenAI
Requires `OPENAI_API_KEY`:
```yaml
providers:
  - id: openai-gpt4
    config:
      model: openai:gpt-4-turbo-preview
```

### Anthropic
Requires `ANTHROPIC_API_KEY`:
```yaml
providers:
  - id: anthropic-claude
    config:
      model: anthropic:messages:claude-3-sonnet-20240229
```

## Metrics and Assertions

### Default Assertions
- Response length check (minimum 50 characters)
- Word count check (minimum 10 words)
- Latency check (maximum 5 seconds)
- Cost tracking (maximum $0.50 per test)

### Custom Assertions

Add custom checks in `promptfoo.yaml`:

```yaml
defaultTest:
  assert:
    - type: javascript
      value: output.includes('specific keyword')
      metric: 'Contains required keyword'

    - type: llm-rubric
      value: Response is technically accurate
```

## Viewing Results

### HTML Reports

Generate a visual report:
```bash
make report
# Opens eval/output/report.html
```

Reports include:
- Pass/fail summary
- Individual test results
- Latency metrics
- Cost tracking

### Baseline Comparison

Compare current results against baseline:
```bash
make baseline-compare
```

This checks for:
- Score regressions (>10% decrease)
- Performance degradation
- Cost increases

### Cost Tracking

Monitor evaluation costs:
```bash
make cost-report
```

Reports show:
- Total cost across all tests
- Cost by provider
- Cost by day
- Average cost per test

## Creating Baselines

After running evaluations, save results as baseline:

```bash
# Run evaluations
make eval-local

# Copy results to baseline
cp eval/output/latest.json eval/baselines/baseline-$(date +%Y%m%d).json
```

Update `Makefile` baseline comparison to use your baseline file.

## Best Practices

1. **Keep datasets small and focused** - Each dataset should test one specific capability
2. **Use meaningful expected values** - Help the AI understand what good looks like
3. **Version control datasets** - Track changes to test data
4. **Store baselines** - Keep baseline results for regression detection
5. **Document prompts** - Add clear labels and descriptions to prompts
6. **Review costs regularly** - Monitor spending with cost reports
7. **Update baselines** - Refresh baselines when improving prompts

## Troubleshooting

### "Model not found" error
- Ensure the model is installed (for Ollama: `ollama pull llama3.1:8b`)
- Check the model name matches exactly

### Timeout errors
- Increase `EVAL_TIMEOUT_MS` in `.env`
- Reduce test concurrency in `promptfoo.yaml`

### Authentication errors
- Verify API keys are set: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`
- Check keys have proper permissions

### High costs
- Use local models (Ollama) for development
- Reduce test dataset size
- Set cost thresholds in assertions
- Review cost reports regularly

## Resources

- [Promptfoo Documentation](https://promptfoo.dev/docs/intro)
- [GRAPES Roadmap](../docs/vision/roadmap-2025-2027.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [ADR: Use Promptfoo](../.adr/0002-use-promptfoo-for-evaluations.md)
