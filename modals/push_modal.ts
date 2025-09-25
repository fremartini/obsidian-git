import { App, Modal } from "obsidian";

import PushModalRoot from "../components/Push/PushModalRoot.svelte";
import { mount, unmount } from "svelte";
import type ChangedFile from "../components/ChangedFile";

interface PushModalProps {
	onSubmit: (result: string, filesToPush: ChangedFile[]) => void;
	changedFiles: ChangedFile[];
	branch: string;
	openDiffView: (arg0: string) => void;
	resetFile: (arg0: string) => void;
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
				openDiffView: this.props.openDiffView,
				resetFile: this.props.resetFile,
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
