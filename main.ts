import { FileSystemAdapter, Notice, Plugin } from "obsidian";
import { exec as ex } from "child_process";
import * as util from "util";
import { PushModal } from "push_modal";
import type ChangedFile from "components/ChangedFile";

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
			onSubmit: async (
				commitMessage: string,
				filesToPush: ChangedFile[],
			) => {
				new Notice(`Initiating push with message '${commitMessage}'`);

				await this.addFiles(filesToPush, vaultPath);

				await this.commitAndPushFiles(commitMessage, vaultPath);
			},
			changedFiles: changedFiles,
			branch: branch,
		};

		new PushModal(this.app, props).open();
	}

	async addFiles(files: ChangedFile[], vaultPath: string) {
		for (var idx in files) {
			let fileName = files[idx].Filename;

			try {
				await exec(`git add ${fileName}`, {
					cwd: vaultPath,
				});
			} catch (err) {
				new Notice(err);
				return;
			}
		}
	}

	async commitAndPushFiles(commitMessage: string, vaultPath: string) {
		try {
			const { stdout } = await exec(
				`git commit -m "${commitMessage}" && git push`,
				{ cwd: vaultPath },
			);
			new Notice(stdout);
		} catch (err) {
			new Notice(err);
		}
	}

	async getBranch(vaultPath: string): Promise<string> {
		const { stdout } = await exec(`git branch --show-current`, {
			cwd: vaultPath,
		});

		return stdout;
	}

	async getChangedFiles(vaultPath: string): Promise<ChangedFile[]> {
		const { stdout } = await exec(`git status -s`, { cwd: vaultPath });

		if (!stdout) {
			return [];
		}

		const changedFiles = stdout
			.replaceAll("??", "A") // files added are showns as ?? for some reason
			.split("\n");

		changedFiles.pop(); // last element is an empty string

		const models = changedFiles.map((f) => {
			// <state> <filename>
			const split = f.trim().split(" ");

			const state = split.shift();
			const filename = split.join(" ");
			const displayName = filename.replaceAll('"', "");

			return <ChangedFile>{
				State: state,
				Displayname: displayName,
				Filename: filename,
			};
		});

		return models;
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
