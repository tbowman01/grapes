---
sidebar_position: 2
---

# Quick Start

Get up and running with GRAPES Hub in minutes.

## Run Your First Evaluation

### 1. Start Ollama (if using local models)

```bash
ollama serve
```

In a new terminal:
```bash
ollama pull llama3.1:8b
```

### 2. Run Evaluation

```bash
# Run evaluations locally (without Docker)
make eval-local

# Or run with Docker container
make eval
```

### 3. View Results

```bash
# Generate HTML report
make report

# Open in browser
open eval/output/report.html
```

## Your First Custom Evaluation

### Create a Dataset

Create `eval/datasets/my-test.jsonl`:

```jsonl
{"question": "What is REST?", "expected": "REST is an architectural style..."}
{"question": "Explain async/await", "expected": "Async/await is syntax..."}
```

### Update Configuration

Edit `eval/promptfoo.yaml`:

```yaml
datasets:
  - ./datasets/code-review-samples.jsonl
  - ./datasets/my-test.jsonl  # Add your dataset
```

### Run Evaluation

```bash
make eval-local
make report
```

## Common Workflows

### Build and Push Image

```bash
# Build container image
make image

# Push to registry (requires authentication)
make push
```

### Security Scanning

```bash
# Generate SBOM
make sbom

# Run vulnerability scan
make scan
```

### Cost Tracking

```bash
# Run evaluations
make eval-local

# Generate cost report
make cost-report
```

### Baseline Comparison

```bash
# Run evaluations
make eval-local

# Create baseline
cp eval/output/latest.json eval/baselines/baseline-$(date +%Y%m%d).json

# Later, compare against baseline
make baseline-compare
```

## Available Make Targets

```bash
make help          # Show all available commands
make setup         # Initial setup
make image         # Build container image
make push          # Push image to registry
make eval          # Run evaluations (Docker)
make eval-local    # Run evaluations (local)
make report        # Generate HTML report
make cost-report   # Generate cost report
make baseline-compare  # Compare against baseline
make sbom          # Generate SBOM
make scan          # Security scan
make lint          # Run linter
make format        # Format code
make test          # Run tests
make clean         # Clean build artifacts
```

## GitHub Actions

GRAPES includes pre-configured workflows:

### Automatic Triggers

- **build-image.yml** - Builds on push to main
- **evaluate.yml** - Runs on PR to eval/**
- **security-scan.yml** - Runs weekly
- **housekeeping.yml** - Runs daily

### Manual Triggers

All workflows support manual dispatch:

1. Go to **Actions** tab in GitHub
2. Select workflow
3. Click **Run workflow**

## Next Steps

- [Configuration Guide](configuration) - Customize settings
- [Evaluation Overview](../evaluation/overview) - Deep dive into evaluations
- [CI/CD Workflows](../cicd/workflows) - Understand automation
