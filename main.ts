import { FileSystemAdapter, Notice, Plugin } from "obsidian";
import { exec as ex } from "child_process";
import * as util from "util";
import { PushModal } from "components/push_modal";

const exec = util.promisify(ex);

export default class ObsidianGitPlugin extends Plugin {
	async onload() {
		this.addRibbonIcon("arrow-down-to-line", "Pull", (evt: MouseEvent) =>
			this.pull(),
		);

		this.addRibbonIcon("arrow-up-from-line", "Push", (evt: MouseEvent) =>
			this.push(),
		);
	}

	async pull() {
		new Notice("Initiating pull");

		const vaultPath = this.getVaultAbsolutePath();

		if (vaultPath == null) {
			new Notice("Failed to get vault directory");
			return;
		}

		const { stdout } = await exec("git pull", { cwd: vaultPath });

		new Notice(stdout);
	}

	async push() {
		const vaultPath = this.getVaultAbsolutePath();

		if (vaultPath == null) {
			new Notice("Failed to get vault directory");
			return;
		}

		const changedFiles = await this.getChangedFiles(vaultPath);

		if (changedFiles.length == 0) {
			new Notice("No changed files found");
			return;
		}

		const branch = await this.getBranch(vaultPath);

		const props = {
			onSubmit: async (commitMessage: string) => {
				new Notice(`Initiating push with message '${commitMessage}'`);

				const { stdout } = await exec(
					`git add * && git commit -m "${commitMessage}" && git push`,
					{ cwd: vaultPath },
				);
				new Notice(stdout);
			},
			changedFiles: changedFiles,
			branch: branch,
		};

		new PushModal(this.app, props).open();
	}

	async getBranch(vaultPath: string): Promise<string> {
		const { stdout } = await exec(`git branch --show-current`, {
			cwd: vaultPath,
		});

		return stdout;
	}

	async getChangedFiles(vaultPath: string): Promise<string[]> {
		const { stdout } = await exec(`git status -s`, { cwd: vaultPath });

		if (!stdout) {
			return [];
		}

		const changedFiles = stdout
			.replaceAll('"', "")
			.replaceAll("??", "A") // files added are showns as ?? for some reason
			.split("\n");

		changedFiles.pop(); // last element is an empty string

		return changedFiles;
	}

	getVaultAbsolutePath(): string | null {
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return adapter.getBasePath();
		}

		return null;
	}

	onunload() {}

	async loadSettings() {}

	async saveSettings() {}
}
