#!/usr/bin/env bash
# CI Environment Validation Script
# Validates required environment variables and configuration before running CI jobs

set -euo pipefail

echo "🔍 Validating CI environment configuration..."

missing=0
warnings=0

# Function to check if a variable is set
check_var() {
    local var_name=$1
    local required=${2:-false}

    if grep -q "^${var_name}=" .env.example 2>/dev/null; then
        echo "✓ ${var_name} is defined in .env.example"
    else
        if [ "$required" = "true" ]; then
            echo "✗ REQUIRED: ${var_name} not found in .env.example"
            missing=$((missing + 1))
        else
            echo "⚠ OPTIONAL: ${var_name} not found in .env.example"
            warnings=$((warnings + 1))
        fi
    fi
}

# Check critical configuration
echo ""
echo "📋 Checking critical configuration..."
check_var "IMAGE_REGISTRY" true
check_var "IMAGE_OWNER" true
check_var "IMAGE_NAME" true
check_var "IMAGE_TAG" true

# Check evaluation configuration
echo ""
echo "🧪 Checking evaluation configuration..."
check_var "EVAL_MODEL_PROVIDER" false
check_var "EVAL_MODEL" false
check_var "EVAL_TIMEOUT_MS" false

# Check documentation configuration
echo ""
echo "📚 Checking documentation configuration..."
check_var "DOCS_BASE_URL" false
check_var "DOCS_TITLE" false

# Check if required files exist
echo ""
echo "📁 Checking required files..."

required_files=(
    "package.json"
    "Makefile"
    "containers/automation-runner/Dockerfile"
    "containers/automation-runner/entrypoint.sh"
    "eval/promptfoo.yaml"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists"
    else
        echo "✗ REQUIRED: $file is missing"
        missing=$((missing + 1))
    fi
done

# Check if .env.example exists
if [ -f ".env.example" ]; then
    echo "✓ .env.example exists"
else
    echo "✗ REQUIRED: .env.example is missing"
    missing=$((missing + 1))
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $missing -eq 0 ]; then
    echo "✅ Validation passed!"
    if [ $warnings -gt 0 ]; then
        echo "⚠️  $warnings warning(s) found (non-critical)"
    fi
    exit 0
else
    echo "❌ Validation failed with $missing error(s)"
    if [ $warnings -gt 0 ]; then
        echo "⚠️  $warnings warning(s) also found"
    fi
    echo ""
    echo "Please fix the errors above before running CI jobs."
    exit 1
fi
