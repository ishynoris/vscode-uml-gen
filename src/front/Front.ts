import { 
	ExtensionContext, 
	Webview, 
	WebviewOptions, 
	WebviewPanelOptions, 
	window, 
	ViewColumn
} from "vscode";
import { ClassMetadata, Element } from "../main/types/parser.type";
import { Front } from "../main/util";
import { Node } from "./core/Node";

export function runWebview(context: ExtensionContext, classMetadata: ClassMetadata) {
	const options: WebviewPanelOptions & WebviewOptions = {
		enableScripts: true,
		enableForms: true,
	}
	const wvPanel = window.createWebviewPanel("uml-gen", "XPTO", ViewColumn.Beside, options);
	const container = processMetadata(classMetadata);
	wvPanel.webview.html = getHtml(context, container);
	wvPanel.reveal();
}

function processMetadata(classMetadata: ClassMetadata): Element {
	const node = new Node(classMetadata);
	return node.getElement();
}

function getHtml(context: ExtensionContext, element: Element): string {
	const cssContent = Front.getResourceContent(context, "index.css");
	const jsContent = Front.getResourceContent(context, "index.js");

	return `
		<html>
			<head> 
				<style>
					${cssContent}
				</style>
				<script>
					${jsContent}
				</script>
			</head>
			<body>${element.content}<body>
		</html>
	`
}
