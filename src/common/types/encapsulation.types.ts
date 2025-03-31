export enum Types {
	private = "private",
	protected = "protected",
	public = "public",
}

export type Allowed = undefined 
	| Types.private
	| Types.protected
	| Types.public

export const Encapsulation = {
	types: Types,
	allowed: {
		private: Types.private,
		protected: Types.protected,
		public: Types.public,
		none: undefined,
	},

	map(): { [ key: string ]: Types } {
		return {
			"private": Encapsulation.allowed.private,
			"protected": Encapsulation.allowed.protected,
			"public": Encapsulation.allowed.public,
		};
	},

	to(type: string | undefined): Allowed {
		const none = Encapsulation.allowed.none;
		if (type == undefined || type.length == 0) {
			return none;
		}

		const map = this.map();
		return map[type] ?? none;
	},

	isValid(type: string | undefined): boolean {
		if (type == undefined || type.length == 0) {
			return true;
		}

		const map = this.map();
		return map.hasOwnProperty(type);
	},

	getSymbol(type: Allowed): string {
		if (type == undefined) {
			return "  ";
		}
		const symbols = {
			private: "-",
			public: "+",
			protected: "#",
		}
		return symbols[type];
	}
}