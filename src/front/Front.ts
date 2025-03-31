import { 
	ExtensionContext, 
	Webview, 
	WebviewOptions, 
	WebviewPanelOptions, 
	window, 
	ViewColumn
} from "vscode";
import { ClassMetadata, Component } from "../main/types/parser.type";
import { Front } from "../main/util";
import { MainComponent } from "./core/components/MainComponent";

export function runWebview(context: ExtensionContext, classMetadata: ClassMetadata) {
	const options: WebviewPanelOptions & WebviewOptions = {
		enableScripts: true,
		enableForms: true,
	}
	const title = `UML - ${classMetadata.className}`;
	const wvPanel = window.createWebviewPanel("uml-gen", title, ViewColumn.Beside, options);
	const container = new MainComponent(classMetadata);
	wvPanel.webview.html = getHtml(context, container.getContent());
	wvPanel.reveal();
}

function getHtml(context: ExtensionContext, component: Component): string {
	const htmlContent = Front.getResourceContent(context, "index.html");
	if (htmlContent == null) {
		return "404 not found";
	}
	const cssContent = Front.getResourceContent(context, "index.css");
	const jsContent = Front.getResourceContent(context, "index.js");

	return htmlContent.replace("@_CSS_CONTENT_@", cssContent ?? "")
		.replace("{_JAVA_SCRIPT_CONTENT_}", jsContent ?? "")
		.replace("(_MAIN_CONTENT_)", component.content);
}
