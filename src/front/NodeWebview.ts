import { ExtensionContext, ViewColumn, WebviewOptions, WebviewPanel, WebviewPanelOptions, window } from "vscode";
import { ClassMetadata } from "../common/types/backend.type";
import { MainComponent } from "./core/components/MainComponent";
import { HtmlTemplate } from "./core/templates/HtmlTemplate";
import { Optional } from "../common/types/classes.type";
import { parseFromPath } from "../main/parsers/ParserFactory";
import { WindowErrors } from "../main/util";
import { FrontDataNode, MessagesUtil } from "../common/types/frontend.type";

type CachePanels = {
	[key: string]: NodeWebview
}

export class NodeWebview {

	private static panels: CachePanels = { }

	private panel: WebviewPanel;

	private constructor(
		private metadata: ClassMetadata, 
		private context: ExtensionContext
	) {
		const title = `UML - ${metadata.detail.name}`;
		const options: WebviewPanelOptions & WebviewOptions = {
			enableScripts: true,
			enableForms: true,
		}

		this.panel = window.createWebviewPanel("uml-gen", title, ViewColumn.Beside, options);
		this.panel.webview.onDidReceiveMessage(message => MessagesProcessor.process(message, context));
	}

	public static create(metadata: ClassMetadata, context: ExtensionContext): NodeWebview {
		const tag = `webview-${metadata.detail.name}`;
		if (NodeWebview.panels[tag] == undefined) {
			NodeWebview.panels[tag] = new NodeWebview(metadata, context);
		}
		return NodeWebview.panels[tag];
	}

	public static createFromPath(path: string, context: ExtensionContext): Optional<NodeWebview> {
		const metadata = parseFromPath(path)
		if (metadata.value == undefined) {
			const message = `Cannot create file from ${path}`;
			return new Optional<NodeWebview>(undefined, [ message ]);
		}

		const node = NodeWebview.create(metadata.value, context);
		return new Optional(node);
	}

	public render() {
		const mainComponent = new MainComponent(this.metadata, "main-container");
		const template = new HtmlTemplate(mainComponent, this.context);

		this.panel.webview.html = template.getHtml();
		this.panel.reveal();
	}
}

class MessagesProcessor {
	static process(data: FrontDataNode, context: ExtensionContext) {
		const consumer = new MessagesUtil(data);
		if (consumer.isNewNode) {
			NewNode.render(data, context);
			return;
		}
	}
}

class NewNode {
	static render(node: FrontDataNode, context: ExtensionContext) {
		if (!node.path) {
			const message = `File path cannot be defined`;
			WindowErrors.showMessage(message);
			return;
		}
		const metadata = parseFromPath(node.path);
		if (metadata.value == undefined) {
			WindowErrors.showMessage(metadata.getMessage());
			return;
		}
		const panel = NodeWebview.createFromPath(node.path, context);
		if (panel.value == undefined) {
			WindowErrors.showMessage(panel.getMessage());
			return;
		}
		panel.value.render();
	}
}