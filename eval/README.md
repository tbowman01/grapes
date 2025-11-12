# GRAPES Evaluation Directory

This directory contains all AI model evaluation configurations, datasets, and baselines for GRAPES Hub.

## Structure

```
eval/
├── promptfoo.yaml         # Main evaluation configuration
├── datasets/              # Test datasets in JSONL format
│   ├── code-review-samples.jsonl
│   └── technical-qa-samples.jsonl
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

Then reference it in `promptfoo.yaml`:

```yaml
datasets:
  - ./datasets/your-new-dataset.jsonl
```

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

Results are stored in `eval/output/` (gitignored) and include:
- `latest.json` - Latest evaluation results
- HTML reports (if generated)
- Individual test outputs

In CI/CD, results are uploaded as artifacts and can be viewed:
- In GitHub Actions artifacts
- As PR comments (summary)
- In workflow step summaries

## Best Practices

1. **Keep datasets small and focused** - Each dataset should test one specific capability
2. **Use meaningful expected values** - Help the AI understand what good looks like
3. **Version control datasets** - Track changes to test data
4. **Store baselines** - Keep baseline results for regression detection
5. **Document prompts** - Add clear labels and descriptions to prompts

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

## Resources

- [Promptfoo Documentation](https://promptfoo.dev/docs/intro)
- [GRAPES Roadmap](../docs/vision/roadmap-2025-2027.md)
- [Contributing Guide](../CONTRIBUTING.md)
