import { App, Modal } from "obsidian";

import Counter from "./PushModal.svelte";
import { mount, unmount } from "svelte";

interface PushModalProps {
	onSubmit: (result: string) => void;
	changedFiles: string[];
	branch: string;
}

export class PushModal extends Modal {
	counter: ReturnType<typeof Counter> | undefined;

	props: PushModalProps;

	constructor(app: App, props: PushModalProps) {
		super(app);
		this.props = props;
	}

	async onOpen() {
		this.counter = mount(Counter, {
			target: this.contentEl,
			props: {
				changedFiles: this.props.changedFiles,
				branch: this.props.branch,
				onSubmit: (r: string) => {
					this.props.onSubmit(r);

					// ensure the windows is closed after the submit function is called
					this.close();
				},
			},
		});
	}

	onClose() {
		if (this.counter) {
			unmount(this.counter);
		}
	}
}
