import * as vscode from "vscode";
import WorkspaceSessionService from "../service/workspace-session-service";

export default function createSessionSelectCommand(sessionService: WorkspaceSessionService) {
    return async () => {
        const sessions = sessionService.listSessions();
        if (sessions.length === 0) {
            vscode.window.showInformationMessage("Cursor Harpoon: No sessions available.");
            return;
        }
        const current = sessionService.getCurrentSessionName();
        const picked = await vscode.window.showQuickPick(
            sessions.map(name => ({
                label: name,
                description: name === current ? "(current)" : undefined,
            })),
            {
                title: "Cursor Harpoon: Select Session",
                placeHolder: "Select a session to activate",
                canPickMany: false,
                ignoreFocusOut: true,
            }
        );
        if (!picked) {
            return;
        }
        await sessionService.selectSession(picked.label);
    };
}
