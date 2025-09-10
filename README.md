<img src="icon.svg" alt="Magic Format Icon" width="48px">

# Opinionated Markdown Formatter for Drafts

A Drafts "action" (script) that applies a consistent, clean, and readable format to Markdown documents. It is designed to be safe to run on an already-formatted document, without making unwanted changes (hopefully). It's especially useful to clean up markdown text pasted into Drafts as drafts seems to add extra blank lines.


## What is Drafts? ✍️
Drafts is a quick-capture notes and writing application for iOS, macOS, and watchOS. This repository contains a JavaScript-based action for use in the Drafts app.

Learn more about Drafts on their [official website](https://getdrafts.com/).


## Features ✨
This Draft's action performs the following formatting changes:

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


## License

This project is licensed under the MIT License.