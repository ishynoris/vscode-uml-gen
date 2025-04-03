import { 
	ExtensionContext, 
	WebviewOptions, 
	WebviewPanelOptions, 
	window, 
	ViewColumn
} from "vscode";
import { MainComponent } from "./core/components/MainComponent";
import { ClassMetadata } from "../common/types/backend.type";
import { HtmlTemplate } from "./core/templates/HtmlTemplate";

export function runWebview(context: ExtensionContext, classMetadata: ClassMetadata) {
	const options: WebviewPanelOptions & WebviewOptions = {
		enableScripts: true,
		enableForms: true,
	}
	const component = new MainComponent(classMetadata, "main-container");
	const template = new HtmlTemplate(component, context);

	const title = `UML - ${classMetadata.detail.name}`;
	const wvPanel = window.createWebviewPanel("uml-gen", title, ViewColumn.Beside, options);
	wvPanel.webview.html = template.getHtml();
	wvPanel.reveal();
}
