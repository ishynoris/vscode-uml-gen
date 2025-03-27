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
import { Dom } from "./core/Dom";

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
	const childs = [ 
		Dom.createLabel({ text: "Hello World" }), 
		Dom.createLabel({ text: "Foo Bar"}) 
	];
	return Dom.createDiv({ id: "main-container" }, childs);
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
