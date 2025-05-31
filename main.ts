import { App, FileSystemAdapter, Modal, Notice, Plugin, Setting } from 'obsidian';
import { execSync } from 'child_process';

export default class ObsidianGitPlugin extends Plugin {
	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('arrow-down-to-line', 'Pull', (evt: MouseEvent) => {
			new Notice("Initiating pull")

			const vaultPath = this.getVaultAbsolutePath()

			if (vaultPath == null) {
				new Notice("Failed to get vault directory");
				return
			}

			try {
				const output = execSync('git pull', {cwd: vaultPath}).toString();
				new Notice(output);
			} catch (err) {
				new Notice(err)
			}
		});

		this.addRibbonIcon('arrow-up-from-line', 'Push', (evt: MouseEvent) => {
			const vaultPath = this.getVaultAbsolutePath()

			if (vaultPath == null) {
				new Notice("Failed to get vault directory");
				return
			}

			try {
				const status = execSync(`git status -s`, {cwd: vaultPath}).toString()

				if (!status) {
					new Notice("No changed files found")
					return
				}

				const changedFiles = status
					.replaceAll("\"", "")
					.replaceAll("??", "A") // files added are showns as ?? for some reason
					.split("\n");

				const branch = execSync(`git branch --show-current`, {cwd: vaultPath}).toString()

				const props = {
					onSubmit: (commitMessage: string) => {
						new Notice(`Initiating push with message '${commitMessage}'`)

						try {
							const output = execSync(`git add * && git commit -m "${commitMessage}" && git push`, {cwd: vaultPath}).toString();
							new Notice(output);
						} catch (err) {
							new Notice(err)
						}
					},
					changedFiles: changedFiles,
					branch: branch
				}

				new PushModal(this.app, props).open();
			} catch (err) {
				new Notice(err)
			}
		});
	}

	onunload() {
	}

	async loadSettings() {
	}

	async saveSettings() {
	}

	getVaultAbsolutePath(): string | null {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return adapter.getBasePath();
		}

		return null
	}
}

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
		this.setTitle('Loading');

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
		} else {
			return null
		}
	} catch (err) {
		return null
	}
  }
}
