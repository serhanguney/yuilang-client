export interface ActionType<T> {
	type: string;
	payload?: T;
}
