import * as vscode from "vscode";
import ActiveProjectService from "../service/active-project-service";
import WorkspaceService from "../service/workspace-service";

export default function createClearEditorsCommand(
    activeProjectService: ActiveProjectService,
    workspaceService: WorkspaceService
) {
    return () => {
        return () => {
            activeProjectService.clearEditors();
            workspaceService.saveWorkspace();
        };
    };
}
