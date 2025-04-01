import { LabelOptions } from "../../../common/types/frontend.type";

export class LabelTemplate {
	constructor(private options: LabelOptions){ }

	getContent(): string {
		const labelFor = (this.options.for ?? "").length == 0 ? "" : `for="${this.options.for}"`;
		return `<label ${labelFor}>${this.options.text}</label>`
	}
}