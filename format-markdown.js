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
