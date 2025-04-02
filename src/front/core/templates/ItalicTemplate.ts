import { ItalicOptions, ITemplate } from "../../../common/types/frontend.type";

export class ItalicTemplate implements ITemplate {

	constructor(private options: ItalicOptions) {  }

	getHtml(): string {
		return `<i>${this.options.text}</i>`
	}
}