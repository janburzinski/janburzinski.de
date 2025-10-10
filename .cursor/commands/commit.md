---
name: /commit
description: Commit staged changes with a generated message
---

```bash
git commit -m "$(git diff --cached --unified=0 | tail -n +5 | head -n -2 | awk '{print $0}' | sed 's/^/  /' | tr '\n' ' ' | sed 's/  *$//')"



This command generates a commit message based on the diff of the staged changes and commits them.

---

### ⚙️ Step 2: Reload Cursor

After saving the file, reload Cursor to register the new slash command.

---

### ✅ Step 3: Use the Slash Command

In the Cursor Agent input, type `/commit` and execute the command. It will commit your staged changes with a message summarizing the modifications.

---

This approach leverages Cursor's custom slash commands feature, allowing you to automate repetitive tasks and integrate them seamlessly into your workflow. For more information, refer to the [Cursor documentation on custom slash commands](https://cursor.com/changelog/1-6).

---
::contentReference[oaicite:27]{index=27}
 
