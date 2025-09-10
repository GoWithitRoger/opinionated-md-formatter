// Get the current draft's content
var text = draft.content;

// --- 1. ISOLATE ALL BLOCK-LEVEL ELEMENTS ---
// This new architecture protects all major blocks from the formatting engine.
const codeBlocks = [];
const h2Headings = [];
const h3Headings = [];
const hrules = [];

// Protect Indented Code Blocks
text = text.replace(/(?:\n\n|\A)((?:(?: {4,}|\t)(?![-+*] ).*\n?)+)/g, (match, p1) => {
    const placeholder = `@@CODE_BLOCK_${codeBlocks.length}@@`;
    codeBlocks.push(p1);
    return `\n\n${placeholder}\n\n`;
});

// Protect ## Headings
text = text.replace(/^## (.*)/gm, (match, p1) => {
    const placeholder = `@@H2_HEADING_${h2Headings.length}@@`;
    h2Headings.push(p1);
    return placeholder;
});

// Protect ### Headings
text = text.replace(/^### (.*)/gm, (match, p1) => {
    const placeholder = `@@H3_HEADING_${h3Headings.length}@@`;
    h3Headings.push(p1);
    return placeholder;
});

// Protect Horizontal Rules
text = text.replace(/^\* \* \*$/gm, () => {
    const placeholder = `@@HRULE_${hrules.length}@@`;
    hrules.push('* * *');
    return placeholder;
});


// --- 2. SYNTAX STANDARDIZATION (on remaining text) ---
text = text.replace(/__(.*?)__/g, '**$1**');
text = text.replace(/(?<!\*)\*([^\s\*].*?[^\s\*])\*(?!\*)/g, '_$1_');
text = text.replace(/^---$/gm, '* * *');
text = text.replace(/^(\s*)\* (?! ?\* ?\*)/gm, '$1- ');


// --- 3. SPACING AND LAYOUT (on remaining text) ---
let lines = text.split('\n');
let newLines = [];
const getIndent = line => line.search(/\S|$/);
let prev = { line: '', isListItem: false, isBlank: true, indent: -1 };

for (const currentLine of lines) {
    const cleanLine = currentLine.replace(/\u00A0/g, ' ');
    const isListItem = /^\s*[-+.\d]/.test(cleanLine);
    const isBlank = cleanLine.trim() === '';
    const indent = getIndent(cleanLine);

    let addBlankLine = false;

    // Add blank lines between ordered list items
    if (/^\s*\d+\./.test(cleanLine) && prev.isListItem && /^\s*\d+\./.test(prev.line)) {
        addBlankLine = true;
    }

    if (addBlankLine && !prev.isBlank) {
        newLines.push('');
    }
    newLines.push(currentLine);

    prev.line = cleanLine;
    prev.isListItem = isListItem;
    prev.isBlank = isBlank;
    prev.indent = indent;
}
text = newLines.join('\n');


// --- 4. RESTORE BLOCKS WITH PERFECT SPACING ---
// Restore ## Headings with two preceding blank lines
for (let i = 0; i < h2Headings.length; i++) {
    text = text.replace(`@@H2_HEADING_${i}@@`, `\n\n## ${h2Headings[i]}`);
}
// Restore ### Headings with one preceding blank line
for (let i = 0; i < h3Headings.length; i++) {
    text = text.replace(`@@H3_HEADING_${i}@@`, `\n### ${h3Headings[i]}`);
}
// Restore Horizontal Rules with one preceding and succeeding blank line
for (let i = 0; i < hrules.length; i++) {
    text = text.replace(`@@HRULE_${i}@@`, `\n* * *\n`);
}
// Restore Code Blocks with one preceding and succeeding blank line
for (let i = 0; i < codeBlocks.length; i++) {
    const trimmedBlock = codeBlocks[i].trim();
    text = text.replace(`@@CODE_BLOCK_${i}@@`, `\n${trimmedBlock}\n`);
}

// --- 5. FINAL CLEANUP ---
// Handle spacing for the main # H1 heading
text = text.replace(/(^# .*)\n(?![\n\s])/gm, '$1\n\n');
// Remove blank lines between simple, same-level unordered list items.
text = text.replace(/(^\s*-\s.*)\n\n+(?=\s*-)/gm, '$1\n');
// Collapse any excess newlines created during replacement
text = text.replace(/\n{3,}/g, '\n\n');
// Remove any leading whitespace from the start of the document
text = text.trimStart();


// --- 6. DRAFT CREATION ---
let d = Draft.create();
for (let tag of draft.tags) {
  d.addTag(tag);
}
d.content = text;
d.update();

editor.load(d);
editor.activate();


// --- 7. COMPLETE ASYNC EXECUTION ---
script.complete();