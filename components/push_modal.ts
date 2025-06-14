import { App, Modal, Setting } from "obsidian";

import Counter from "../Counter.svelte";
import { mount, unmount } from "svelte";

interface PushModalProps {
	onSubmit: (result: string) => void;
	changedFiles: string[];
	branch: string;
}

export class PushModal extends Modal {
	// A variable to hold on to the Counter instance mounted in this ItemView.
	counter: ReturnType<typeof Counter> | undefined;

	props: PushModalProps;

	constructor(app: App, props: PushModalProps) {
		super(app);
		this.props = props;
	}

	async onOpen() {
		// Attach the Svelte component to the ItemViews content element and provide the needed props.
		this.counter = mount(Counter, {
			target: this.contentEl,
			props: {
				startCount: 5,
			},
		});

		// Since the component instance is typed, the exported `increment` method is known to TypeScript.
		this.counter.increment();

		this.setTitle("Loading...");

		let message = "";

		this.getRandomCommitMessage().then((commitMessage) => {
			this.setTitle("Push changes");

			new Setting(this.contentEl)
				.setName("Commit message")
				.addText((text) => {
					if (commitMessage != null) {
						text.setValue(commitMessage);
						message = commitMessage;
					}

					text.onChange((value) => {
						message = value;
					});
				});

			const branchContainer = this.contentEl.createDiv({
				cls: "branchContainer",
			});
			branchContainer.createDiv({ text: `Branch: ${this.props.branch}` });

			const changedFilesContainer = this.contentEl.createDiv({
				cls: "changedFilesContainer",
			});
			this.props.changedFiles.forEach((changedFile) =>
				changedFilesContainer.createDiv({ text: changedFile }),
			);

			new Setting(this.contentEl).addButton((btn) =>
				btn
					.setButtonText("Push")
					.setCta()
					.onClick(() => {
						if (message == "") {
							return;
						}

						this.close();
						this.props.onSubmit(message);
					}),
			);
		});
	}

	onClose() {
		if (this.counter) {
			// Remove the Counter from the ItemView.
			unmount(this.counter);
		}

		const { contentEl } = this;
		contentEl.empty();
	}

	async getRandomCommitMessage(): Promise<string | null> {
		try {
			const response = await fetch("https://whatthecommit.com");
			const body = await response.text();

			const regex = /<p>(.*?)<\/p>/;
			const match = body.match(regex);

			if (match && match[1]) {
				return match[1];
			}

			return null;
		} catch (err) {
			return null;
		}
	}
}
