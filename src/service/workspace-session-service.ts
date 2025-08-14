import * as vscode from "vscode";
import ActiveProjectService from "./active-project-service";
import { getStateKey, ProjectState } from "../harpoon";

/**
 * WorkspaceSessionService manages named Harpoon sessions scoped to the active workspace.
 * A session captures the list of active editors and the previous editor.
 *
 * Data is stored ONLY in `workspaceState` under a dedicated key, and when a session
 * is selected the standard workspace Harpoon state is also updated so existing
 * commands operate on the selected session immediately.
 */
export default class WorkspaceSessionService {
    private static readonly workspaceSessionsKey = "cursorHarpoonSessionsWorkspaceState";
    public static readonly defaultSessionName = "default";

    constructor(
        private readonly context: vscode.ExtensionContext,
        private readonly activeProjectService: ActiveProjectService
    ) {}

    /** Returns the current session name if one is selected. */
    public getCurrentSessionName(): string | undefined {
        const state = this.readSessionsState();
        return state.currentSessionName;
    }

    /** Ensures there is at least one session and a selected session. */
    public async ensureInitialized(): Promise<void> {
        const state = this.readSessionsState();
        const sessionNames = Object.keys(state.sessions);
        if (sessionNames.length === 0) {
            const defaultState = this.captureCurrentProjectState();
            state.sessions[WorkspaceSessionService.defaultSessionName] = defaultState;
            state.currentSessionName = WorkspaceSessionService.defaultSessionName;
            await this.writeSessionsState(state);
            await this.writeWorkspaceProjectState(defaultState);
            return;
        }

        if (!state.currentSessionName) {
            const chosen = state.sessions[WorkspaceSessionService.defaultSessionName]
                ? WorkspaceSessionService.defaultSessionName
                : sessionNames.sort((a, b) => a.localeCompare(b))[0];
            state.currentSessionName = chosen;
            await this.writeSessionsState(state);
            const ps = state.sessions[chosen];
            if (ps) {
                await this.writeWorkspaceProjectState(ps);
            }
        }
    }

    /** Renames an existing session. Returns true if successful. */
    public async renameSession(oldName: string, newName: string): Promise<boolean> {
        const from = oldName.trim();
        const to = newName.trim();
        if (from.length === 0 || to.length === 0) {
            return false;
        }
        const sessionsState = this.readSessionsState();
        const existing = sessionsState.sessions[from];
        if (!existing) {
            return false;
        }
        sessionsState.sessions[to] = existing;
        delete sessionsState.sessions[from];
        if (sessionsState.currentSessionName === from) {
            sessionsState.currentSessionName = to;
        }
        await this.writeSessionsState(sessionsState);
        return true;
    }

    /** Returns a list of all session names stored for this workspace. */
    public listSessions(): string[] {
        const state = this.readSessionsState();
        return Object.keys(state.sessions);
    }

    /**
     * Creates a new session with a fresh state (no editors) and selects it.
     * If a session with the same name exists, it is overwritten with a fresh state.
     */
    public async saveSession(sessionName: string): Promise<void> {
        const trimmedName = sessionName.trim();
        if (trimmedName.length === 0) {
            return;
        }
        const sessionsState = this.readSessionsState();
        const fresh: ProjectState = { activeEditors: [], previousEditor: undefined };
        // Create or overwrite the session with a fresh, empty state
        sessionsState.sessions[trimmedName] = fresh;
        sessionsState.currentSessionName = trimmedName;
        await this.writeSessionsState(sessionsState);
        // Apply the fresh state to the active project and workspace storage
        this.applyProjectState(fresh);
        await this.writeWorkspaceProjectState(fresh);
    }

    /** Deletes a session by name. Returns true if it existed. */
    public async deleteSession(sessionName: string): Promise<boolean> {
        const trimmedName = sessionName.trim();
        const sessionsState = this.readSessionsState();
        // Disallow deleting the currently selected session
        if (sessionsState.currentSessionName === trimmedName) {
            return false;
        }
        if (!Object.prototype.hasOwnProperty.call(sessionsState.sessions, trimmedName)) {
            return false;
        }
        delete sessionsState.sessions[trimmedName];
        await this.writeSessionsState(sessionsState);
        return true;
    }

    /** Selects a session by name, applying it to the current workspace. */
    public async selectSession(sessionName: string): Promise<boolean> {
        const trimmedName = sessionName.trim();
        const sessionsState = this.readSessionsState();
        const projectState = sessionsState.sessions[trimmedName];
        if (!projectState) {
            return false;
        }
        this.applyProjectState(projectState);
        sessionsState.currentSessionName = trimmedName;
        await this.writeSessionsState(sessionsState);
        await this.writeWorkspaceProjectState(projectState);
        return true;
    }

    /** Saves current editors into the currently selected session, if any. */
    public async saveCurrentIntoSelectedSession(): Promise<void> {
        const sessionsState = this.readSessionsState();
        if (!sessionsState.currentSessionName) {
            return;
        }
        sessionsState.sessions[sessionsState.currentSessionName] =
            this.captureCurrentProjectState();
        await this.writeSessionsState(sessionsState);
        await this.writeWorkspaceProjectState(
            sessionsState.sessions[sessionsState.currentSessionName]
        );
    }

    private captureCurrentProjectState(): ProjectState {
        return {
            activeEditors: this.activeProjectService.activeEditors,
            previousEditor: this.activeProjectService.getPreviousEditor(),
        };
    }

    private applyProjectState(projectState: ProjectState) {
        this.activeProjectService.activeEditors = projectState.activeEditors ?? [];
        if (projectState.previousEditor) {
            this.activeProjectService.setPreviousEditor(projectState.previousEditor);
        }
    }

    private readSessionsState(): WorkspaceSessionsState {
        const empty: WorkspaceSessionsState = { sessions: {} };
        const state = this.context.workspaceState.get<WorkspaceSessionsState>(
            WorkspaceSessionService.workspaceSessionsKey
        );
        if (!state) {
            return empty;
        }
        // ensure shape
        if (!state.sessions) {
            state.sessions = {};
        }
        return state;
    }

    private async writeSessionsState(state: WorkspaceSessionsState): Promise<void> {
        await this.context.workspaceState.update(
            WorkspaceSessionService.workspaceSessionsKey,
            state
        );
    }

    private async writeWorkspaceProjectState(projectState: ProjectState): Promise<void> {
        await this.context.workspaceState.update(getStateKey("workspaceState"), projectState);
    }
}

type WorkspaceSessionsState = {
    sessions: Record<string, ProjectState>;
    currentSessionName?: string;
};
