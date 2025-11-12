# Contributing to GRAPES Hub

Thank you for your interest in contributing to GRAPES Hub! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions. We aim to foster a welcoming community for all contributors.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/grapes.git
   cd grapes
   ```
3. **Set up your environment**:
   ```bash
   make setup
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Locally

```bash
# Build the container image
make image

# Run evaluations locally
make eval-local

# Run tests
make test

# Lint code
make lint

# Format code
make format
```

### Making Changes

1. Make your changes in your feature branch
2. Write or update tests as needed
3. Ensure all tests pass: `make test`
4. Ensure code is formatted: `make format`
5. Ensure linting passes: `make lint`
6. Commit your changes with clear, descriptive messages

### Commit Message Guidelines

We follow conventional commits:

- `feat: add new evaluation provider`
- `fix: resolve Docker build issue`
- `docs: update README with new examples`
- `chore: update dependencies`
- `test: add evaluation test cases`
- `refactor: improve Makefile targets`

### Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add tests** for new features
3. **Update the README** if needed
4. **Run validation** before submitting:
   ```bash
   make lint
   make test
   bash scripts/ci-validate-env.sh
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** on GitHub
7. **Link related issues** in your PR description
8. **Wait for review** - maintainers will review and may request changes

### PR Review Criteria

PRs will be reviewed for:
- Code quality and style consistency
- Test coverage
- Documentation completeness
- Security considerations
- Performance impact
- Alignment with project goals

## Areas for Contribution

### Priority Areas (Year 1 Roadmap)
- Improving evaluation datasets
- Adding new model provider configurations
- Enhancing documentation
- Writing tests
- Improving error handling

### Future Areas (Year 2-3)
- AI-powered code review features
- Multi-model orchestration
- Web UI development
- Enterprise features

See `docs/vision/roadmap-2025-2027.md` for detailed roadmap.

## Issue Guidelines

### Reporting Bugs
- Use the bug report template
- Include reproduction steps
- Provide environment details
- Attach relevant logs

### Requesting Features
- Use the feature request template
- Explain the use case
- Describe expected behavior
- Consider roadmap alignment

## Questions?

- Open a [Discussion](https://github.com/tbowman01/grapes/discussions)
- Check existing [Issues](https://github.com/tbowman01/grapes/issues)
- Review [Documentation](README.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
