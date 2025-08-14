import * as vscode from "vscode";
import WorkspaceSessionService from "../service/workspace-session-service";

export default function createSessionDeleteCommand(sessionService: WorkspaceSessionService) {
    return async () => {
        const sessions = sessionService.listSessions();
        if (sessions.length === 0) {
            vscode.window.showInformationMessage("Cursor Harpoon: No sessions to delete.");
            return;
        }
        const current = sessionService.getCurrentSessionName();
        const candidates = sessions.filter(name => name !== current);
        if (candidates.length === 0) {
            vscode.window.showInformationMessage(
                "Cursor Harpoon: Cannot delete the current session. Select a different session first."
            );
            return;
        }
        const picked = await vscode.window.showQuickPick(candidates, {
            title: "Cursor Harpoon: Delete Session",
            placeHolder: "Select a session to delete",
            canPickMany: false,
            ignoreFocusOut: true,
        });
        if (!picked) {
            return;
        }
        const confirmed = await vscode.window.showWarningMessage(
            `Delete session "${picked}"?`,
            { modal: true },
            "Delete"
        );
        if (confirmed !== "Delete") {
            return;
        }
        await sessionService.deleteSession(picked);
    };
}
