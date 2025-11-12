# 2. Use Promptfoo for AI Model Evaluations

Date: 2025-11-12

## Status

Accepted

## Context

We need a framework for evaluating AI models consistently and reliably. The framework should:
- Support multiple LLM providers (OpenAI, Anthropic, Ollama, etc.)
- Provide standardized metrics
- Be open source and self-hostable
- Integrate well with CI/CD pipelines
- Generate reports and artifacts

## Decision

We will use [Promptfoo](https://promptfoo.dev) as our primary evaluation framework for GRAPES Hub.

### Key Features Used
- Multi-provider support (Ollama, OpenAI, Anthropic, Azure, Bedrock)
- YAML-based configuration
- Assertion and metric system
- CLI tool that integrates with CI/CD
- JSON/JSONL dataset support
- Cost and latency tracking

## Alternatives Considered

1. **LangSmith** - Closed source, requires cloud service
2. **MLflow** - Heavy infrastructure, ML-focused not LLM-focused
3. **Custom solution** - High maintenance, not standardized
4. **LangChain Evaluators** - Tightly coupled to LangChain framework

## Consequences

### Positive
- Open source and can be self-hosted
- Active community and development
- Standardized evaluation patterns
- Easy to extend and customize
- Works well in containerized environments
- Supports multiple model providers out of the box

### Negative
- Learning curve for team members new to Promptfoo
- YAML configuration can become complex
- Still relatively young project (some features in development)
- Need to maintain custom integrations for specialized providers

## Implementation Notes

- Evaluations run in Docker container for consistency
- Configuration stored in `eval/promptfoo.yaml`
- Datasets stored as JSONL files in `eval/datasets/`
- Results artifacts stored and tracked in CI/CD

## References

- [Promptfoo Documentation](https://promptfoo.dev/docs/intro)
- [Promptfoo GitHub](https://github.com/promptfoo/promptfoo)
