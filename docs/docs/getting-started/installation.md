---
sidebar_position: 1
---

# Installation

Get GRAPES Hub up and running on your local machine.

## Prerequisites

Before installing GRAPES, ensure you have:

- **Node.js** 22.0 or higher
- **Python** 3.10 or higher
- **Docker** 24.0 or higher
- **Git** 2.0 or higher
- **Make** (usually pre-installed on Linux/macOS)

### Optional
- **GitHub CLI** (`gh`) for enhanced GitHub integration
- **Ollama** for local AI model inference

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/tbowman01/grapes.git
cd grapes
```

### 2. Run Initial Setup

```bash
make setup
```

This command will:
- Create `.env` from `.env.example`
- Install Node.js dependencies
- Display next steps

### 3. Configure Environment

Edit `.env` with your specific configuration:

```bash
# Image settings
IMAGE_REGISTRY=ghcr.io
IMAGE_OWNER=your-github-username
IMAGE_NAME=grapes/automation-runner
IMAGE_TAG=latest

# Evaluation configuration
EVAL_MODEL_PROVIDER=ollama
EVAL_MODEL=llama3.1:8b

# For OpenAI (optional)
# OPENAI_API_KEY=sk-...

# For Anthropic (optional)
# ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Build Container Image

```bash
make image
```

This builds the automation runner container using a multi-stage Dockerfile with a distroless base.

### 5. Verify Installation

```bash
# Check Docker image
docker images | grep grapes

# Run help command
make help
```

## Installing Ollama (Optional)

For local AI model inference:

### macOS
```bash
brew install ollama
ollama serve
```

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
```

### Pull a Model
```bash
ollama pull llama3.1:8b
```

## Troubleshooting

### Docker Permission Issues

On Linux, add your user to the docker group:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Node.js Version Issues

Use nvm to manage Node versions:

```bash
nvm install 22
nvm use 22
```

### Port Conflicts

If Ollama's default port (11434) is in use:

```bash
# Change port in .env
OLLAMA_BASE_URL=http://host.docker.internal:11435
```

## Next Steps

- [Quick Start Guide](quick-start) - Run your first evaluation
- [Configuration](configuration) - Detailed configuration options
