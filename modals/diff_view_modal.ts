import { App, Modal } from "obsidian";

import DiffModalRoot from "../components/Diff/DiffModalRoot.svelte";
import { mount, unmount } from "svelte";

interface DiffViewModalProps {
	content: string[];
}

export class DiffViewModal extends Modal {
	component: ReturnType<typeof DiffModalRoot> | undefined;

	props: DiffViewModalProps;

	constructor(app: App, props: DiffViewModalProps) {
		super(app);
		this.props = props;
	}

	onOpen() {
		this.component = mount(DiffModalRoot, {
			target: this.contentEl,
			props: {
				content: this.props.content,
			},
		});
	}

	onClose() {
		if (this.component) {
			unmount(this.component);
		}
	}
}
