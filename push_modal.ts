import { App, Modal } from "obsidian";

import PushModalRoot from "./components/ModalRoot.svelte";
import { mount, unmount } from "svelte";

interface PushModalProps {
	onSubmit: (result: string, filesToPush: string[]) => void;
	changedFiles: string[];
	branch: string;
}

export class PushModal extends Modal {
	component: ReturnType<typeof PushModalRoot> | undefined;

	props: PushModalProps;

	constructor(app: App, props: PushModalProps) {
		super(app);
		this.props = props;
	}

	async onOpen() {
		this.component = mount(PushModalRoot, {
			target: this.contentEl,
			props: {
				changedFiles: this.props.changedFiles,
				branch: this.props.branch,
				onSubmit: (r: string, filesToPush: string[]) => {
					this.props.onSubmit(r, filesToPush);

					// ensure the windows is closed after the submit function is called
					this.close();
				},
			},
		});
	}

	onClose() {
		if (this.component) {
			unmount(this.component);
		}
	}
}
