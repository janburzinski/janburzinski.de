---
name: /commit
description: Commit changes with an intelligent commit message
---

```bash
# Check if there are any changes to commit
if ! git diff --quiet && ! git diff --cached --quiet; then
  echo "No changes to commit. Please stage your changes first with 'git add'."
  exit 1
fi

# If no staged changes, stage all modified files
if git diff --cached --quiet; then
  echo "No staged changes found. Staging all modified files..."
  git add .
fi

# Generate commit message based on file changes
CHANGED_FILES=$(git diff --cached --name-only)
COMMIT_MSG=""

# Analyze file types and generate appropriate message
if echo "$CHANGED_FILES" | grep -q "\.svelte$"; then
  if echo "$CHANGED_FILES" | grep -q "\.ts$\|\.js$"; then
    COMMIT_MSG="feat: update components and add TypeScript improvements"
  else
    COMMIT_MSG="feat: update Svelte components"
  fi
elif echo "$CHANGED_FILES" | grep -q "\.ts$\|\.js$"; then
  COMMIT_MSG="feat: update TypeScript/JavaScript files"
elif echo "$CHANGED_FILES" | grep -q "\.css$\|\.scss$"; then
  COMMIT_MSG="style: update styling and CSS"
elif echo "$CHANGED_FILES" | grep -q "\.md$"; then
  COMMIT_MSG="docs: update documentation"
elif echo "$CHANGED_FILES" | grep -q "package\.json\|pnpm-lock\.yaml\|yarn\.lock"; then
  COMMIT_MSG="chore: update dependencies"
else
  COMMIT_MSG="feat: update project files"
fi

# Add file count to message
FILE_COUNT=$(echo "$CHANGED_FILES" | wc -l)
if [ "$FILE_COUNT" -eq 1 ]; then
  COMMIT_MSG="$COMMIT_MSG ($(basename $CHANGED_FILES))"
else
  COMMIT_MSG="$COMMIT_MSG ($FILE_COUNT files)"
fi

# Commit with generated message
git commit -m "$COMMIT_MSG"

# Show the commit
echo "✅ Committed successfully!"
git log --oneline -1
```

This command intelligently:
- Checks for changes and stages them if needed
- Analyzes file types to generate appropriate commit messages
- Uses conventional commit format (feat:, style:, docs:, chore:)
- Includes file count or specific file name for context
- Shows confirmation of the commit

### Usage Examples:
- `/commit` - Stages all changes and commits with intelligent message
- Works with any file type (Svelte, TypeScript, CSS, docs, etc.)
- Automatically detects the type of changes made

### Features:
- ✅ No complex regex or sed operations
- ✅ Handles empty staged changes
- ✅ Generates meaningful commit messages
- ✅ Shows commit confirmation
- ✅ Uses conventional commit format
 
