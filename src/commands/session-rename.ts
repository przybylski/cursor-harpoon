import * as vscode from "vscode";
import WorkspaceSessionService from "../service/workspace-session-service";

export default function createSessionRenameCommand(sessionService: WorkspaceSessionService) {
    return async () => {
        const sessions = sessionService.listSessions();
        if (sessions.length === 0) {
            vscode.window.showInformationMessage("Harpoon: No sessions to rename.");
            return;
        }
        const from = await vscode.window.showQuickPick(sessions, {
            title: "Cursor Harpoon: Rename Session",
            placeHolder: "Select a session to rename",
            canPickMany: false,
            ignoreFocusOut: true,
        });
        if (!from) {
            return;
        }
        const to = await vscode.window.showInputBox({
            title: "Cursor Harpoon: New Session Name",
            prompt: `Enter a new name for "${from}"`,
            value: from,
            ignoreFocusOut: true,
            validateInput: value => (value.trim().length === 0 ? "Name cannot be empty" : null),
        });
        if (!to || to.trim() === from.trim()) {
            return;
        }
        await sessionService.renameSession(from, to);
    };
}
