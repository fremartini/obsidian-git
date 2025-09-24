import { App, Modal } from "obsidian";

interface ExampleModalProps {
	content: string;
}

export class ExampleModal extends Modal {
	constructor(app: App, props: ExampleModalProps) {
		super(app);
		this.setContent(props.content);
	}
}
