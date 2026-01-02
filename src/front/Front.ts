import { ExtensionContext } from "vscode";
import { ClassMetadata } from "../common/types/backend.type";
import { GraphWebviewFactory } from "./NodeWebview";

export function runWebview(context: ExtensionContext, classMetadata: ClassMetadata) {
	const node = GraphWebviewFactory.create(classMetadata, context);
	node.render();
}
