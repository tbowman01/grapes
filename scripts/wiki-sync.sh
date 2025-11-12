#!/usr/bin/env bash
# Wiki Sync Script for GRAPES Hub
#
# Synchronizes documentation from docs/ to GitHub Wiki
# Usage: bash scripts/wiki-sync.sh

set -euo pipefail

# Configuration
WIKI_DIR=".wiki"
WIKI_REPO="${GITHUB_REPOSITORY:-tbowman01/grapes}.wiki.git"
WIKI_URL="https://github.com/${WIKI_REPO}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Cleanup function
cleanup() {
    if [ -d "$WIKI_DIR" ]; then
        log_info "Cleaning up wiki directory..."
        rm -rf "$WIKI_DIR"
    fi
}

# Register cleanup on exit
trap cleanup EXIT

# Main sync function
sync_wiki() {
    log_info "Starting wiki sync..."

    # Check if wiki exists
    if ! git ls-remote "$WIKI_URL" >/dev/null 2>&1; then
        log_error "Wiki repository not found: $WIKI_URL"
        log_info "Please enable Wiki in repository settings first"
        exit 1
    fi

    # Clone wiki repository
    log_info "Cloning wiki repository..."
    if ! git clone "$WIKI_URL" "$WIKI_DIR" 2>/dev/null; then
        log_error "Failed to clone wiki repository"
        exit 1
    fi

    cd "$WIKI_DIR"

    # Sync documentation files
    log_info "Syncing documentation files..."

    # Home page (from README.md)
    if [ -f "../README.md" ]; then
        cp "../README.md" "Home.md"
        log_info "Synced: Home.md (from README.md)"
    fi

    # Getting Started
    if [ -f "../docs/docs/getting-started/installation.md" ]; then
        cp "../docs/docs/getting-started/installation.md" "Installation.md"
        log_info "Synced: Installation.md"
    fi

    if [ -f "../docs/docs/getting-started/quick-start.md" ]; then
        cp "../docs/docs/getting-started/quick-start.md" "Quick-Start.md"
        log_info "Synced: Quick-Start.md"
    fi

    if [ -f "../docs/docs/getting-started/configuration.md" ]; then
        cp "../docs/docs/getting-started/configuration.md" "Configuration.md"
        log_info "Synced: Configuration.md"
    fi

    # Evaluation
    if [ -f "../docs/docs/evaluation/overview.md" ]; then
        cp "../docs/docs/evaluation/overview.md" "Evaluation.md"
        log_info "Synced: Evaluation.md"
    fi

    # Roadmap
    if [ -f "../docs/docs/roadmap.md" ]; then
        cp "../docs/docs/roadmap.md" "Roadmap.md"
        log_info "Synced: Roadmap.md"
    fi

    # Contributing
    if [ -f "../CONTRIBUTING.md" ]; then
        cp "../CONTRIBUTING.md" "Contributing.md"
        log_info "Synced: Contributing.md"
    fi

    # ADR Index
    if [ -f "../.adr/README.md" ]; then
        cp "../.adr/README.md" "Architecture-Decision-Records.md"
        log_info "Synced: Architecture-Decision-Records.md"
    fi

    # Create sidebar
    log_info "Creating wiki sidebar..."
    cat > "_Sidebar.md" <<'EOF'
## 🍇 GRAPES Hub

### Getting Started
- [Home](Home)
- [Installation](Installation)
- [Quick Start](Quick-Start)
- [Configuration](Configuration)

### Documentation
- [Evaluation](Evaluation)
- [Roadmap](Roadmap)

### Development
- [Contributing](Contributing)
- [Architecture Decision Records](Architecture-Decision-Records)

### Links
- [GitHub Repository](https://github.com/tbowman01/grapes)
- [Documentation Site](https://tbowman01.github.io/grapes/)
- [Issues](https://github.com/tbowman01/grapes/issues)
EOF

    log_info "Created: _Sidebar.md"

    # Create footer
    cat > "_Footer.md" <<EOF
---
**GRAPES Hub** | [Documentation](https://tbowman01.github.io/grapes/) | [GitHub](https://github.com/tbowman01/grapes)

*Last synced: $(date -u +"%Y-%m-%d %H:%M UTC")*
EOF

    log_info "Created: _Footer.md"

    # Check for changes
    if [ -z "$(git status --porcelain)" ]; then
        log_info "No changes to sync"
        cd ..
        return 0
    fi

    # Commit and push changes
    log_info "Committing changes..."
    git config user.name "${GIT_AUTHOR_NAME:-github-actions[bot]}"
    git config user.email "${GIT_AUTHOR_EMAIL:-actions@users.noreply.github.com}"

    git add .
    git commit -m "docs: sync from main repository

Synced documentation from main repository
- Updated: $(date -u +"%Y-%m-%d %H:%M UTC")
- Source: ${GITHUB_SHA:-manual}
"

    log_info "Pushing to wiki..."
    if git push origin master; then
        log_info "Wiki sync completed successfully!"
    else
        log_error "Failed to push to wiki"
        exit 1
    fi

    cd ..
}

# Main execution
main() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📚 GRAPES Wiki Sync"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    sync_wiki

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

main "$@"
