import * as vscode from "vscode";
import WorkspaceSessionService from "../service/workspace-session-service";

export default function createSessionCreateCommand(sessionService: WorkspaceSessionService) {
    return async () => {
        const sessionName = await vscode.window.showInputBox({
            title: "Cursor Harpoon: Create Session",
            prompt: "Enter a session name",
            ignoreFocusOut: true,
            validateInput: value => (value.trim().length === 0 ? "Name cannot be empty" : null),
        });
        if (!sessionName) {
            return;
        }
        await sessionService.saveSession(sessionName);
    };
}
