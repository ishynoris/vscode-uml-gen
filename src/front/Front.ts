import { ExtensionContext } from "vscode";
import { ClassMetadata } from "../common/types/backend.type";
import { NodeWebview } from "./NodeWebview";

export function runWebview(context: ExtensionContext, classMetadata: ClassMetadata) {
	const node = NodeWebview.create(classMetadata, context);
	node.render();
}
