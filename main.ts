import { App, FileSystemAdapter, Modal, Notice, Plugin, Setting } from 'obsidian';
import { exec as ex } from 'child_process';
import * as util from 'util'

const exec = util.promisify(ex);

export default class ObsidianGitPlugin extends Plugin {
	async onload() {
		this.addRibbonIcon('arrow-down-to-line', 'Pull', (evt: MouseEvent) => this.pull());

		this.addRibbonIcon('arrow-up-from-line', 'Push', (evt: MouseEvent) => this.push());
	}

	async pull() {
		new Notice("Initiating pull")

		const vaultPath = this.getVaultAbsolutePath()

		if (vaultPath == null) {
			new Notice("Failed to get vault directory");
			return
		}

		const { stdout } = await exec('git pull', {cwd: vaultPath})

		new Notice(stdout)
	}

	async push() {
		const vaultPath = this.getVaultAbsolutePath()

		if (vaultPath == null) {
			new Notice("Failed to get vault directory");
			return
		}

		const changedFiles = await this.getChangedFiles(vaultPath)

		if (changedFiles.length == 0) {
			new Notice("No changed files found")
			return
		}

		const branch = await this.getBranch(vaultPath)		

		const props = {
			onSubmit: async (commitMessage: string) => {
				new Notice(`Initiating push with message '${commitMessage}'`)

				const { stdout } = await exec(`git add * && git commit -m "${commitMessage}" && git push`, {cwd: vaultPath})
				new Notice(stdout);
		
			},
			changedFiles: changedFiles,
			branch: branch
		}

		new PushModal(this.app, props).open();
	}

	async getBranch(vaultPath: string): Promise<string> {
		const { stdout } = await exec(`git branch --show-current`, {cwd: vaultPath})

		return stdout
	}

	async getChangedFiles(vaultPath: string): Promise<string[]> {
		const { stdout } = await exec(`git status -s`, {cwd: vaultPath})

		if (!stdout) {
			return []
		}

		const changedFiles = stdout
			.replaceAll("\"", "")
			.replaceAll("??", "A") // files added are showns as ?? for some reason
			.split("\n");

		return changedFiles
	}

	getVaultAbsolutePath(): string | null {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return adapter.getBasePath();
		}

		return null
	}
	
	onunload() {
	}

	async loadSettings() {
	}

	async saveSettings() {
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
