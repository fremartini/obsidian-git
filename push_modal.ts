import { App, Modal } from "obsidian";

import PushModalRoot from "./components/ModalRoot.svelte";
import { mount, unmount } from "svelte";
import type ChangedFile from "./components/ChangedFile";

interface PushModalProps {
	onSubmit: (result: string, filesToPush: ChangedFile[]) => void;
	changedFiles: ChangedFile[];
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
				onSubmit: (
					commitMessage: string,
					filesToPush: ChangedFile[],
				) => {
					this.props.onSubmit(commitMessage, filesToPush);

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
