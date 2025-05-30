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
				const changedFiles = execSync(`git status -s`, {cwd: vaultPath})
					.toString()
					.replaceAll("\"", "")
					.replaceAll("??", "A") // files added are showns as ?? for some reason
					.split("\n");

				new PushModal(this.app, (commitMessage) => {
					new Notice(`Initiating push with message '${commitMessage}'`)

					try {
						const output = execSync(`git add * && git commit -m "${commitMessage}" && git push`, {cwd: vaultPath}).toString();
						new Notice(output);
					} catch (err) {
						new Notice(err)
					}
				}, changedFiles).open();
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

export class PushModal extends Modal {
  constructor(
	app: App, 
	onSubmit: (result: string) => void,
	changedFiles: string[]) {
    super(app);
	this.setTitle('Push changes');

	let message = '';

    new Setting(this.contentEl)
		.setName("Commit message")
		.addText((text) => {
			text.onChange((value) => {
				message = value;
			})
		});

	const changedFilesContainer = this.contentEl.createEl('div', { cls: "changedFilesContainer" });
	changedFiles.forEach((changedFile) => changedFilesContainer.createEl('div', { text: changedFile }))

    new Setting(this.contentEl)
		.addButton((btn) =>
			btn
			.setButtonText('Push')
			.setCta()
			.onClick(() => {
				this.close();
				onSubmit(message);
			}
		));
  }
}
