/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "react-yandex-maps" {
	import { Component } from "react";

	interface MapEvent {
		get: (key: string) => any;
	}

	export interface YMapsProps {
		query?: Record<string, string>;
		children?: React.ReactNode;
	}

	export class YMaps extends Component<YMapsProps> {}
	export class Map extends Component<any> {}
	export class Placemark extends Component<any> {}
}
