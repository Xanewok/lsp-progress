'use strict';

import { WindowProgressNotification, WindowProgressClientCapabilities, ProgressParams } from "../protocol/progress.proposed";
import { ClientCapabilities, BaseLanguageClient, StaticFeature } from "vscode-languageclient";
import { window, Progress, ProgressLocation } from 'vscode';

export class WindowProgressFeature implements StaticFeature {
    private _progresses: Map<string, WindowProgress> = new Map<string, WindowProgress>();

    constructor(private _client: BaseLanguageClient) {}

    public fillClientCapabilities(capabilities: ClientCapabilities): void {
        capabilities.experimental = capabilities.experimental || {};
        let windowProgressCapabilities = capabilities as WindowProgressClientCapabilities;
        windowProgressCapabilities.experimental.progress = true;
    }

    public initialize(): void {
        let client = this._client;
        let progresses = this._progresses;

        let handler = function (params: ProgressParams) {
            let progress = progresses.get(params.id);
            if (progress !== undefined) {
                progress.updateProgress(params);
            } else {
                window.withProgress({ location: ProgressLocation.Window, title: params.title || ''}, p => {
                    progress = new WindowProgress(p);
                    progresses.set(params.id, progress);

                    progress.updateProgress(params);
                    return progress.promise;
                });
            }
            // In both cases progress shouldn't be undefined, but make the compiler happy.
            if (params.done && progress !== undefined) {
                progress.finish();
                progresses.delete(params.id);
            }
        };

        client.onNotification(WindowProgressNotification.type, handler);
    }
}

class WindowProgress {
    public promise: Promise<{}>;
    private resolve: (value?: {} | PromiseLike<{}> | undefined) => void;
    private reject: (reason?: any) => void;

    private progress: Progress<{ message?: string; }>;

    private message: string | undefined;
    private percentage: number | undefined;

    constructor(progress: Progress<{ message?: string; }>) {
        this.progress = progress;

        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    public updateProgress(params: ProgressParams) {
        const message = params.message || this.message;
        const percentage = params.percentage || this.percentage;

        const progressMessage = this.createProgressMessage(message, percentage);
        this.progress.report({message: progressMessage});
    }

    public finish() {
        this.resolve();
    }

    public cancel() {
        this.reject();
    }

    createProgressMessage(message: string | undefined, percentage: number | undefined): string {
        if (message !== undefined && percentage !== undefined) {
            return `${message} (${percentage}%)`;
        } else if (message !== undefined) {
            return message;
        } else if (percentage !== undefined) {
            return percentage.toString();
        } else {
            return "It's impossible.";
        }
    }
}
