#!/usr/bin/env bash
DATA=$(cat)

LOG_DIR="${CLAUDE_PROJECT_DIR:-.}/logs"
LOG_FILE="$LOG_DIR/pipeline.log"
mkdir -p "$LOG_DIR"

TOOL=$(echo "$DATA" | jq -r '.tool_name')
INPUT=$(echo "$DATA" | jq -rc '.tool_input' | head -c 100)
echo "$(date -Iseconds) $TOOL $INPUT" >> "$LOG_FILE"

exit 0
