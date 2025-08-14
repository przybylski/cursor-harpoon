import * as vscode from "vscode";
import WorkspaceSessionService from "../service/workspace-session-service";

export default function createSessionQuickPickCommand(sessionService: WorkspaceSessionService) {
    return async () => {
        const quickPick = vscode.window.createQuickPick();
        quickPick.title = "↼ Cursor Harpoon Sessions ⇀";
        const current = sessionService.getCurrentSessionName();

        quickPick.items = sessionService.listSessions().map(name => toQuickPickItem(name, current));

        quickPick.onDidAccept(async () => {
            if (quickPick.selectedItems.length !== 1) {
                return;
            }
            const picked = quickPick.selectedItems[0];
            if (!picked) {
                return;
            }
            await sessionService.selectSession(picked.label);
            quickPick.hide();
        });

        quickPick.onDidTriggerItemButton(async e => {
            const sessionName = e.item.label;
            const current = sessionService.getCurrentSessionName();
            if (sessionName === current) {
                vscode.window.showInformationMessage(
                    `Cannot delete the current session ("${sessionName}"). Select a different session first.`
                );
                return;
            }
            const confirmed = await vscode.window.showWarningMessage(
                `Delete session "${sessionName}"?`,
                { modal: true },
                "Delete"
            );
            if (confirmed !== "Delete") {
                return;
            }
            await sessionService.deleteSession(sessionName);
            quickPick.items = quickPick.items.filter(item => item.label !== sessionName);
            if (quickPick.items.length === 0) {
                quickPick.hide();
            }
        });

        quickPick.onDidHide(() => {
            quickPick.dispose();
        });
        quickPick.show();
    };
}

function toQuickPickItem(name: string, current?: string): vscode.QuickPickItem {
    const isCurrent = current === name;
    return {
        label: name,
        description: isCurrent ? "(current)" : undefined,
        buttons: isCurrent
            ? []
            : [
                  {
                      iconPath: new vscode.ThemeIcon("trash"),
                      tooltip: "Delete",
                  },
              ],
    };
}
