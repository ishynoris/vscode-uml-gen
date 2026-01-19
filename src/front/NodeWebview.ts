import { ExtensionContext, ViewColumn, WebviewOptions, WebviewPanel, WebviewPanelOptions, window } from "vscode";
import { HtmlTemplate } from "./core/templates/HtmlTemplate";
import { parseFromPath } from "../parsers/ParserFactory";
import { WindowErrors } from "../main/util";
import { GraphFactory } from "../common/GraphFactory";
import { 
	ClassDetail, ClassMetadata,
	Optional,
	FrontMessage, FrontNode, Mesages,
	ForceGraphWrapper as FGWrapper,
} from "../common/types";
import { ForceGraph } from "./core/ForceGraphWrapper";

type MapNodeWebview = { [key: string]: GraphWebview }

type PanelOptions = WebviewPanelOptions & WebviewOptions;

type ShowOptions = ViewColumn | { 
	readonly viewColumn: ViewColumn,
	readonly preserveFocus?: boolean,
}

const UML_PREFIX = "UML - ";

class GraphWebview {

	private panel: WebviewPanel;

	constructor(
		private metadata: ClassMetadata, 
		private context: ExtensionContext,
		showOptions: ShowOptions
	) {
		const title = `${UML_PREFIX}${metadata.detail.name}`;
		const options: PanelOptions = {
			enableScripts: true,
			enableForms: true,
		}

		this.panel = window.createWebviewPanel("uml-gen", title, showOptions, options);
		this.panel.webview.onDidReceiveMessage(message => MessagesProcessor.process(message, context));
		this.panel.onDidDispose(e => GraphWebviewFactory.delete(metadata));
	}

	public static create(metadata: ClassMetadata, context: ExtensionContext): GraphWebview {
		return GraphWebviewFactory.create(metadata, context);
	}

	public static createFromPath(path: string, context: ExtensionContext): Optional<GraphWebview> {
		const metadata = parseFromPath(path)
		if (metadata.value == undefined) {
			const message = `Cannot create file from ${path}`;
			return new Optional<GraphWebview>(undefined, [ message ]);
		}

		const node = GraphWebview.create(metadata.value, context);
		return new Optional(node);
	}

	public render() {
		const graph: ForceGraph.GraphData = GraphFactory.getForceGraphData(this.metadata);
		const template = new HtmlTemplate(graph, this.context, this.panel.webview);

		this.panel.webview.html = template.getHtml();
		this.panel.reveal();
	}

	public reveal(viewColumn?: ViewColumn) {
		this.panel.reveal(viewColumn)
	}
}

function createWebviewTag(detail: ClassDetail): string {
	return `webview_${detail.name}`;
}

export class GraphWebviewFactory {

	private static self = new GraphWebviewFactory;

	private mapNode: MapNodeWebview = { };
	private lastGraph: GraphWebview | undefined; 

	public static create(metadata: ClassMetadata, context: ExtensionContext): GraphWebview {
		const self = GraphWebviewFactory.self;
		self.lastGraph?.reveal();
		
		const tag = createWebviewTag(metadata.detail);
		if (!self.hasTag(tag)) {
			const showOptions = self.getShowOptions();
			self.mapNode[tag] = new GraphWebview(metadata, context, showOptions);
		}
		
		self.lastGraph = self.mapNode[tag];
		return self.lastGraph;
	}

	public static delete(metadata: ClassMetadata): GraphWebview {
		const self = GraphWebviewFactory.self;

		const tag = createWebviewTag(metadata.detail);
		const panel = self.mapNode[tag];
		delete(self.mapNode[tag]);

		self.lastGraph = self.getLastGraph();
		return panel;
	}

	private hasTag(tag: string): boolean {
		return this.mapNode[tag] != undefined;
	}

	private getShowOptions(): ShowOptions {
		return this.lastGraph == undefined ? ViewColumn.Beside : ViewColumn.Active;
	}

	private getLastGraph(): GraphWebview | undefined {
		const keys = Object.keys(this.mapNode);
		if (keys.length == 0) {
			return undefined;
		}

		const lastKey = keys[keys.length - 1];
		return this.mapNode[lastKey];
	}
}

class MessagesProcessor {
	static process(message: FrontMessage, context: ExtensionContext) {
		if (message.id == Mesages.NewNode) {
			NewNode.render(message, context);
			return;
		}
	}
}

class NewNode {
	static render(node: FrontNode, context: ExtensionContext) {
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
		const panel = GraphWebview.createFromPath(node.path, context);
		if (panel.value == undefined) {
			WindowErrors.showMessage(panel.getMessage());
			return;
		}
		panel.value.render();
	}
}