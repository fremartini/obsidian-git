import { FileSystemAdapter, Notice, Plugin, WorkspaceLeaf } from "obsidian";
import { exec as ex } from "child_process";
import * as util from "util";
import { PushModal } from "modals/push_modal";
import type ChangedFile from "components/ChangedFile";
import { DiffViewModal } from "modals/diff_view_modal";

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
			openDiffView: async (file: string) => {
				const diff = await this.getDiff(vaultPath, file);

				const props = {
					content: diff,
				};

				new DiffViewModal(this.app, props).open();
			},
			resetFile: async (file: string) => {
				await this.checkoutFile(vaultPath, file);
			},
		};

		new PushModal(this.app, props).open();
	}

	async checkoutFile(vaultPath: string, fileName: string) {
		const { stdout } = await exec(`git checkout ${fileName}`, {
			cwd: vaultPath,
		});

		new Notice(stdout);
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

	async getDiff(vaultPath: string, filename: string): Promise<string[]> {
		const { stdout } = await exec(`git diff ${filename}`, {
			cwd: vaultPath,
		});

		if (!stdout) {
			return [];
		}

		var diffs = stdout
			.split("\n")
			.filter((s) => s.startsWith("+") || s.startsWith("-"));

		diffs.shift();
		diffs.shift();

		return diffs;
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
