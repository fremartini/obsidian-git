import { App, Modal, Setting } from 'obsidian';

interface PushModalProps {
	onSubmit: (result: string) => void,
	changedFiles: string[]
	branch: string
}

export class PushModal extends Modal {
	props: PushModalProps

	constructor(
		app: App,
		props: PushModalProps

	) {
		super(app);
		this.props = props
	}

	onOpen() {
		this.setTitle('Loading...');

		let message = '';

		this.getRandomCommitMessage().then((commitMessage) =>  {
			this.setTitle('Push changes')

			new Setting(this.contentEl)
				.setName("Commit message")
				.addText((text) => {
					if (commitMessage != null) {
						text.setValue(commitMessage)
						message = commitMessage
					}

					text.onChange((value) => {
						message = value;
					})
				})

			const branchContainer = this.contentEl.createDiv({ cls: "branchContainer" });
			branchContainer.createDiv({text: `Branch: ${this.props.branch}`});

			const changedFilesContainer = this.contentEl.createDiv({ cls: "changedFilesContainer" });
			this.props.changedFiles.forEach((changedFile) => changedFilesContainer.createDiv({ text: changedFile }));

			new Setting(this.contentEl)
				.addButton((btn) =>
					btn
					.setButtonText('Push')
					.setCta()
					.onClick(() => {
						if (message == '') {
							return
						}

						this.close();
						this.props.onSubmit(message);
					}
			));
		})
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

  async getRandomCommitMessage(): Promise<string | null> {
	try {
		const response = await fetch("https://whatthecommit.com")
		const body = await response.text()

		const regex = /<p>(.*?)<\/p>/;
		const match = body.match(regex);

		if (match && match[1]) {
			return match[1];
		}

		return null
	} catch (err) {
		return null
	}
  }
}
