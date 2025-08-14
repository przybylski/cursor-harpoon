<div align="center">

# Cursor Harpoon

Cursor Harpoon is inspired by The Primeagen's [Harpoon](https://github.com/ThePrimeagen/harpoon)
plugin for neovim. It supports the basic use case of file navigation just like with Harpoon.

Forked from original work of ![Tobias Zimmermann](https://github.com/tobias-z/vscode-harpoon)

![GitHub](https://img.shields.io/github/workflow/status/przybylski/vscode-harpoon/validate/main)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

</div>

## Features

Cursor Harpoon is a file navigation tool, which lets you mark editors and jump to your marked
editors.

When adding your first editor, it will be set as `editor 1`, the next `editor 2` and so on.

You are then able to jump to `editor 1` or `editor 2` from anywhere in your workspace.

![Navigation Example](images/navigation.gif)

### Available Commands

-   `Cursor Harpoon: Add Editor (cursor-harpoon.addEditor)` adds the current editor to your
    workspace
-   `Cursor Harpoon: Add Editor [1-9] (cursor-harpoon.addEditor[1-9])` adds the editor at the
    specified index
-   `Cursor Harpoon: Go to editor [1-9] (cursor-harpoon.gotoEditor[1-9])` Goes to workspace editor
    [1-9]
-   `Cursor Harpoon: Edit Editors (cursor-harpoon.editEditors)` Opens an editor for you do delete or
    move added editors around.
-   `Cursor Harpoon: Editor Quick Pick (cursor-harpoon.editorQuickPick)` Opens a quick pick menu to
    pick between your current workspace editors
-   `Cursor Harpoon: Go to previous harpoon editor (cursor-harpoon.gotoPreviousHarpoonEditor)` Jumps
    to the previous editor which was last jumped from using harpoon.
-   `Cursor Harpoon: Navigate Next Editor (cursor-harpoon.navigateNextEditor)` Jumps to the next
    workspace editor.
-   `Cursor Harpoon: Navigate Previous Editor (cursor-harpoon.navigatePreviousEditor)` Jumps to the
    previous workspace editor.
-   `Cursor Harpoon: Add Global Editor (cursor-harpoon.addGlobalEditor)` adds the current editor
    globally
-   `Cursor Harpoon: Add Global Editor [1-9] (cursor-harpoon.addGlobalEditor[1-9])` adds the editor
    globally at the specified index
-   `Cursor Harpoon: Go to global editor [1-9] (cursor-harpoon.gotoGlobalEditor[1-9])` Goes to
    global editor [1-9]
-   `Cursor Harpoon: Edit Global Editors (cursor-harpoon.editGlobalEditors)` Opens an editor for you
    do delete or move added editors around.
-   `Cursor Harpoon: Editor Global Quick Pick (cursor-harpoon.editorGlobalQuickPick)` Opens a quick
    pick menu to pick between your global editors
-   `Cursor Harpoon: Go to previous global harpoon editor (cursor-harpoon.gotoPreviousGlobalHarpoonEditor)`
    Jumps to the previous global editor which was last jumped from using harpoon.
-   `Cursor Harpoon: Navigate Next Global Editor (cursor-harpoon.navigateGlobalNextEditor)` Jumps to
    the next global workspace editor.
-   `Cursor Harpoon: Navigate Previous Global Editor (cursor-harpoon.navigateGlobalPreviousEditor)`
    Jumps to the previous global workspace editor.
-   `Cursor Harpoon: Delete Editor (cursor-harpoon.deleteEditor)` Removes the current editor
-   `Cursor Harpoon: Delete Global Editor (cursor-harpoon.deleteGlobalEditor)` Removes the current
    editor globally
-   `Cursor Harpoon: Clear All Editors (cursor-harpoon.clearEditors)` Removes all editors
-   `Cursor Harpoon: Clear All Global Editors (cursor-harpoon.clearGlobalEditors)` Removes all
    editors globally

### Available Contexts

-   `Cursor Harpoon: Quick Pick Visible (cursor-harpoon.isQuickPick)` Adds context for determining
    whether harpoon's quick pick list is visible.

## Troubleshooting

If desired the extension does support jumping to already open editors in different split panes.
However, for this to work you need to add a property to your settings.json:

```json
{
    "workbench.editor.revealIfOpen": true
}
```

## Example Keybinds

### VSCode (`keybindings.json`)

```json
[
    {
        "key": "alt+a",
        "commands": ["cursor-harpoon.addEditor"]
    },
    {
        "key": "alt+e",
        "commands": ["cursor-harpoon.editEditors"]
    },
    {
        "key": "alt+p",
        "commands": ["cursor-harpoon.editorQuickPick"]
    },
    {
        "key": "alt+1",
        "command": "cursor-harpoon.gotoEditor1"
    }
]
```

### VSCode Vim (`settings.json`)

```json
{
    "vim.leader": " ",
    "vim.normalModeKeyBindings": [
        {
            "before": ["<leader>", "a"],
            "commands": ["cursor-harpoon.addEditor"]
        },
        {
            "before": ["<leader>", "e"],
            "commands": ["cursor-harpoon.editEditors"]
        },
        {
            "before": ["<leader>", "p", "e"],
            "commands": ["cursor-harpoon.editorQuickPick"]
        },
        {
            "before": ["<leader>", "1"],
            "commands": ["cursor-harpoon.gotoEditor1"]
        }
    ]
}
```

---

## Issues

Looking to contribute? Please read the `CONTRIBUTING.md` file, which contains information about
making a PR.

Any feedback is very appreciated!

### 🪲 Bugs

Please file an issue for bugs, missing documentation, unexpected behaviour etc.

[**Create bug report**](https://github.com/przybylski/vscode-harpoon/issues/new?assignees=&labels=&template=bug_report.md&title=)

### 🕯 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding a 👍.

[**Create Feature Requests**](https://github.com/przybylski/vscode-harpoon/issues/new?assignees=&labels=&template=feature_request.md&title=)
