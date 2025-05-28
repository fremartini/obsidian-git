import { App, FileSystemAdapter, Modal, Notice, Plugin, Setting } from 'obsidian';
import { exec } from 'child_process';

export default class HelloWorldPlugin extends Plugin {
	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('arrow-down-to-line', 'Pull', (evt: MouseEvent) => {
			new Notice("Initiating pull")

			const vaultPath = this.getVaultAbsolutePath()

			if (vaultPath == null) {
				new Notice("Failed to get vault directory");
				return
			}

			exec('git pull', {cwd: vaultPath}, (error, stdout, _) => {
				if (error) {
					new Notice(error.message)
					return;
				}
				new Notice(stdout);
			});
		});

		this.addRibbonIcon('arrow-up-from-line', 'Push', (evt: MouseEvent) => {
			const vaultPath = this.getVaultAbsolutePath()

			if (vaultPath == null) {
				new Notice("Failed to get vault directory");
				return
			}

			new PushModal(this.app, (commitMessage) => {
				new Notice(`Initiating push with message '${commitMessage}'`)

				exec('git add *', {cwd: vaultPath})
				exec(`git commit -m "${commitMessage}"`, {cwd: vaultPath})
				exec('git push', {cwd: vaultPath}, (error, stdout, _) => {
					if (error) {
						new Notice(error.message)
						return;
					}
					new Notice(`Pushed successful`);
				});
			}).open();
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
  constructor(app: App, onSubmit: (result: string) => void) {
    super(app);
	this.setTitle('Enter commit message');

	let message = '';

    new Setting(this.contentEl)
      .addText((text) =>
        text.onChange((value) => {
          message = value;
        }));

    new Setting(this.contentEl)
      .addButton((btn) =>
        btn
          .setButtonText('Push')
          .setCta()
          .onClick(() => {
            this.close();
            onSubmit(message);
          }));
  }
}
