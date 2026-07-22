# Opinionated Markdown Formatter for Drafts

A small JavaScript action for [Drafts](https://getdrafts.com/) that applies a consistent Markdown
style to the current draft. It creates a new formatted draft, preserves the original draft and its
tags, and is intended to be safe to run more than once.

This is a personal, opinionated hobby tool rather than a general-purpose Markdown formatter. Its
spacing choices may not match yours, so try it on disposable text before adopting it.

## Formatting choices

- Converts double-underscore bold to double asterisks.
- Converts single-asterisk emphasis to underscores.
- Uses `- ` for unordered list items.
- Uses `* * *` for horizontal rules.
- Normalizes blank lines around headings, lists, rules, and indented code blocks.

## Install in Drafts

1. Create a new Drafts action.
2. Add a **Script** step.
3. Copy [format-markdown.js](format-markdown.js) into the script step.
4. Enable **Allow Asynchronous Execution** for that step.
5. Run the action on a sample draft and confirm the output matches your preferences.

The action creates and opens a new draft instead of overwriting the source.

## Development

The tests run the Drafts script inside a small mocked environment:

```bash
npm test
```

## License

MIT. See [LICENSE](LICENSE).
