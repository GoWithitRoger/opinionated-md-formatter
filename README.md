# Opinionated Markdown Formatter for Drafts

A Drafts script that applies a consistent, clean, and readable format to your Markdown documents. It is designed to be "idempotent," meaning it's safe to run on an already-formatted document without making unwanted changes.

This script is ideal for cleaning up notes, preparing documents for publication, or simply maintaining a uniform style across all your Markdown files.

## Features ✨

This action performs the following formatting changes:

* **Syntax Standardization:**
    * Converts `**bold**` text to use asterisks.
    * Converts `_italic_` text to use underscores.
    * Converts horizontal rules to `* * *`.
    * Standardizes all list items to use a dash (`-`).
* **Intelligent Spacing:**
    * Ensures a blank line always follows a top-level (`#`) heading.
    * Adds a blank line after any other heading (`##`, `###`, etc.) **only if** it is followed by a list item.
    * Adds a blank line between top-level list items to create separation.
    * Adds a blank line when "out-denting" in a list to improve structure.
    * Ensures horizontal rules (`* * *`) are always padded by a blank line above and below.
* **Stable & Predictable:**
    * Preserves manually created blank lines between a parent list item and its indented child.
    * Safely handles various Markdown syntax without conflicts.

## Installation 🛠️

You can install this script manually with a quick copy and paste.

1.  **Create a New Action:** In Drafts, create a new action. Give it a name like "Opinionated Markdown Formatter" and assign an icon and color if you wish.
2.  **Add a Script Step:** In the action's steps, add a "Script" step.
3.  **Copy & Paste:** Copy the entire code from the `format-markdown.js` file in this repository and paste it into the script editor.
4.  **Enable Settings:** In the script step's options, make sure to check the box for **"Allow Asynchronous Execution"**.

The action is now ready to use.

## Usage

1.  Open a draft containing Markdown text.
2.  Run the "Opinionated Markdown Formatter" action from your action list.
3.  The script will create and load a new, formatted version of your draft.

## The Script

The complete script is included below for transparency and manual installation.

<details>
<summary>Click to view script.js</summary>

```javascript
// Get the current draft's content
var text = draft.content;

// --- 1. SYNTAX STANDARDIZATION ---
// The order of these rules is critical to avoid conflicts.

// Change bold from __ to **
text = text.replace(/__(.*?)__/g, '**$1**');
// Change *italic* to _italic_ (but not **)
text = text.replace(/(?<!\*)\*([^\s\*].*?[^\s\*])\*(?!\*)/g, '_$1_');
// Change horizontal rules to "* * *"
text = text.replace(/^---$/gm, '* * *');
// PERMANENT FIX: Change "* " to "- " only if it's a real list item, ignoring horizontal rules.
text = text.replace(/^(\s*)\* (?! ?\* ?\*)/gm, '$1- ');


// --- 2. SPACING AND LAYOUT ---
// The main loop is the single source of truth for spacing.
let lines = text.split('\n');
let newLines = [];

const getIndent = line => line.search(/\S|$/);

let prev = {
    line: '',
    isListItem: false,
    isBlank: true,
    indent: -1,
};

for (const currentLine of lines) {
    // Correct for non-breaking spaces before processing.
    const cleanLine = currentLine.replace(/\u00A0/g, ' ');
    const isListItem = /^\s*[-+]/.test(cleanLine);
    const isBlank = cleanLine.trim() === '';
    const indent = getIndent(cleanLine); // Call the standalone function

    let addBlankLine = false;

    // Condition 1: Out-denting (e.g., child item followed by parent item)
    if (isListItem && prev.isListItem && indent < prev.indent) {
        addBlankLine = true;
    }
    // Condition 2 (Parent to Child) has been REMOVED for stability.
    
    // Condition 3: Top-level Sibling items
    else if (isListItem && prev.isListItem && indent === 0 && prev.indent === 0) {
        addBlankLine = true;
    }
    // Condition 4: Paragraph to a Top-level item
    else if (isListItem && indent === 0 && !prev.isListItem && !prev.isBlank) {
        addBlankLine = true;
    }

    if (addBlankLine && !prev.isBlank) {
        newLines.push('');
    }

    newLines.push(currentLine); // Push the original line to preserve its whitespace characters

    prev.line = cleanLine;
    prev.isListItem = isListItem;
    prev.isBlank = isBlank;
    prev.indent = indent;
}

text = newLines.join('\n');


// --- 3. FINAL CLEANUP ---
// Rule A: Ensure a blank line after a top-level # heading.
text = text.replace(/(^# .*\n)(?!(\s*\n|\s*$))/gm, '$1\n');
// Rule B: Ensure a blank line after any heading if it is followed by a list item.
text = text.replace(/(^#+ .*)\n(\s*[-+]\s.*)/gm, '$1\n\n$2');
// Ensure blank lines around horizontal rules.
text = text.replace(/^\* \* \*$/gm, '\n* * *\n');
// Consolidate any sequences of 3+ newlines into a single blank line.
text = text.replace(/\n{3,}/g, '\n\n');


// --- 4. DRAFT CREATION ---
let d = Draft.create();
for (let tag of draft.tags) {
  d.addTag(tag);
}
d.content = text;
d.update();

editor.load(d);
editor.activate();

// --- 5. COMPLETE ASYNC EXECUTION ---
// Notify Drafts that the script has finished its work.
script.complete();
```

</details>

## License

This project is licensed under the MIT License.