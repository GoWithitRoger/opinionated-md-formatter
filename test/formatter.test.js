import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../format-markdown.js", import.meta.url), "utf8");

function runFormatter(content, tags = ["writing"]) {
  let loadedDraft;
  let completed = false;

  const createdDraft = {
    content: "",
    tags: [],
    addTag(tag) {
      this.tags.push(tag);
    },
    update() {},
  };

  const sandbox = {
    draft: { content, tags },
    Draft: { create: () => createdDraft },
    editor: {
      load(value) {
        loadedDraft = value;
      },
      activate() {},
    },
    script: {
      complete() {
        completed = true;
      },
    },
  };

  vm.runInNewContext(source, sandbox);

  assert.equal(loadedDraft, createdDraft);
  assert.equal(completed, true);
  return createdDraft;
}

test("formats common Markdown constructs and preserves tags", () => {
  const result = runFormatter("# Title\nText with __bold__ and *italic*.\n\n* one\n* two\n---");

  assert.match(result.content, /\*\*bold\*\*/);
  assert.match(result.content, /_italic_/);
  assert.match(result.content, /^\- one$/m);
  assert.match(result.content, /^\* \* \*$/m);
  assert.deepEqual(result.tags, ["writing"]);
});

test("is stable when run twice", () => {
  const once = runFormatter("# Title\n\n- one\n- two\n\n* * *").content;
  const twice = runFormatter(once).content;

  assert.equal(twice, once);
});
