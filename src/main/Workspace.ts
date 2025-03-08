import { WorkspaceFolder, workspace } from "vscode";

export function getWorkspace(): null|WorkspaceFolder {
	 const folder = workspace.workspaceFolders ?? [];
	 return folder.length == 0 ? null : folder[0];
}

export function getWorkspaceName(): null|string {
	const folder = getWorkspace();
	return folder == null ? null : folder.name;
}

export function getWorkspacePath(): null|string {
	const folder = getWorkspace();
	return folder == null ? null : folder.uri.path;
}