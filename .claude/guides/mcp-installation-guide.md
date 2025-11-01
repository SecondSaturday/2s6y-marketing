# MCP Server Installation Guide

**Version**: 1.0.0 (Framework v1.6.0)
**Last Updated**: 2025-10-18

## Overview

This guide explains which MCP servers to install for Framework v1.6.0's enhanced agent system. These servers provide tools for code review, security scanning, and deployment automation.

## Required MCP Servers

### 1. Semgrep MCP Server ⭐ **CRITICAL**

**Purpose**: SAST (Static Application Security Testing) for Code Reviewer and Security Specialist

**Trustworthiness**: 10/10 (Industry standard - used by GitHub, GitLab, Meta, Snowflake)

**What it provides**:
- OWASP Top 10 vulnerability detection
- SQL injection, XSS, CSRF checks
- Authentication/authorization pattern verification
- Custom rule support for 2s6y patterns

**Installation**:
```bash
# Install Semgrep CLI
brew install semgrep  # macOS
# or
pip install semgrep    # Linux/Windows

# Verify installation
semgrep --version
```

**MCP Configuration** (add to Claude Code settings):
```json
{
  "mcpServers": {
    "semgrep": {
      "command": "semgrep",
      "args": ["scan", "--config", "auto"],
      "env": {}
    }
  }
}
```

**Test**:
```bash
# Run Semgrep scan
semgrep scan --config auto --json
```

---

### 2. MCP Security Server ⭐ **RECOMMENDED**

**Purpose**: Additional security scanning (SCA + SBOM) for Security Specialist

**Trustworthiness**: 9/10 (OWASP-aligned open-source project)

**What it provides**:
- Software Composition Analysis (SCA)
- SBOM generation (SPDX format)
- CVE database cross-reference
- Dependency vulnerability tracking

**Installation**:
```bash
# Clone MCP Security Server repo
git clone https://github.com/mcp-servers/security-server.git
cd security-server
npm install

# Build
npm run build
```

**MCP Configuration**:
```json
{
  "mcpServers": {
    "security": {
      "command": "node",
      "args": ["/path/to/security-server/dist/index.js"],
      "env": {
        "NVD_API_KEY": "${NVD_API_KEY}"  // Optional - get from https://nvd.nist.gov/developers/request-an-api-key
      }
    }
  }
}
```

**Test**:
```bash
# Run security scan
node dist/index.js --scan .
```

---

### 3. Vercel MCP Server ⭐ **RECOMMENDED**

**Purpose**: Deployment automation for Deployment Agent

**Trustworthiness**: 9/10 (Official Vercel integration)

**What it provides**:
- Programmatic Vercel deployments
- Preview URL management
- Environment variable sync
- Deployment status checks

**Installation**:
```bash
# Install Vercel CLI (required)
npm install -g vercel

# Clone Vercel MCP Server
git clone https://github.com/vercel/mcp-server.git
cd mcp-server
npm install
npm run build
```

**MCP Configuration**:
```json
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "VERCEL_TOKEN": "${VERCEL_TOKEN}"  // Get from https://vercel.com/account/tokens
      }
    }
  }
}
```

**Test**:
```bash
# Verify Vercel CLI auth
vercel whoami

# Test deployment
vercel deploy --preview
```

---

### 4. Code Review MCP Server (OPTIONAL)

**Purpose**: Additional code quality checks (ESLint/Prettier integration)

**Trustworthiness**: 7/10 (Community project - verify before installing)

**Options**:
1. **saiprashanths/code-review-mcp** (GitHub Actions integration)
2. **punkpeye/code-review-mcp-1** (ESLint focus)
3. **crazyrabbitLTC/mcp-code-review-server** (General purpose)

**Recommendation**: Skip for MVP - Code Reviewer agent uses bash commands for ESLint/Prettier which is sufficient.

---

## Installation Priority

### Phase 1: Immediate (For Framework v1.6.0)

**Install Now**:
1. **Semgrep MCP Server** (critical for security scanning)
2. **npm audit** (built-in, no MCP needed)

**Skip for Now**:
- MCP Security Server (nice-to-have, use npm audit for MVP)
- Vercel MCP (nice-to-have, use Vercel CLI via bash for MVP)
- Code Review MCP (not needed, use bash for MVP)

### Phase 2: Post-MVP (After Initial Launch)

**Consider Adding**:
- MCP Security Server (enhanced SBOM + CVE tracking)
- Vercel MCP (programmatic deployments)

---

## Quick Start (Minimal Setup)

**For MVP, you only need**:

### Step 1: Install Semgrep

```bash
# macOS
brew install semgrep

# Verify
semgrep --version
```

### Step 2: Configure Semgrep MCP (if available)

If your Claude Code version supports Semgrep MCP, add to config:
```json
{
  "mcpServers": {
    "semgrep": {
      "command": "semgrep",
      "args": ["scan", "--config", "auto", "--json"]
    }
  }
}
```

### Step 3: Fallback to Bash

If Semgrep MCP not available, agents will use bash:
```bash
semgrep scan --config auto --json
```

**No additional MCP servers required for MVP** - all agents can function with bash commands.

---

## Verification

### Test Semgrep

```bash
cd /Users/kalyanchandana/Documents/GitHub/2Sat-lite
semgrep scan --config auto --json > semgrep-test.json
cat semgrep-test.json  # Should show scan results
```

### Test npm audit

```bash
npm audit --json > npm-audit-test.json
cat npm-audit-test.json  # Should show dependency scan
```

### Test Vercel CLI

```bash
vercel whoami  # Should show your username
vercel deploy --preview  # Should create preview deployment
```

---

## Troubleshooting

### Semgrep: "Command not found"

**Solution**:
```bash
# Install via pip instead of brew
pip install semgrep

# Or use pipx for isolated install
pipx install semgrep
```

### Semgrep: Rate limit exceeded

**Solution**: Get free API key from https://semgrep.dev/login
```bash
export SEMGREP_APP_TOKEN="your_token"
semgrep scan --config auto
```

### npm audit: No vulnerabilities

**Solution**: This is good! No action needed.

### Vercel: Not authenticated

**Solution**:
```bash
vercel login
# Or set token
export VERCEL_TOKEN="your_token"
```

---

## Summary

**For Framework v1.6.0 MVP**:
- ✅ **Install**: Semgrep (brew install semgrep)
- ✅ **Built-in**: npm audit (already installed)
- ✅ **Built-in**: Vercel CLI (use bash, not MCP)
- ❌ **Skip**: MCP Security Server (post-MVP)
- ❌ **Skip**: Vercel MCP (post-MVP)

**All agents will function correctly with these tools** - no additional MCP servers required for MVP!

---

## Related Documentation

- `.claude/agents/code-reviewer.md` - Uses Semgrep
- `.claude/agents/security-specialist.md` - Uses Semgrep + npm audit
- `.claude/agents/deployment-agent.md` - Uses Vercel CLI
- `.claude/guides/security-scanning.md` - Security workflow

---

**Version History**:
- v1.0.0 (2025-10-18): Initial MCP installation guide
