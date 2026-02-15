import type { EventEmitterForPlayerEvents, PlayerAdapter } from "peaks.js";
import debug from "debug";
import type { Debugger } from "debug";

export class MyAudioPlayer implements PlayerAdapter {
    private htmlAudioElem: HTMLAudioElement;
    private logger: Debugger;

    constructor(htmlAudioElem: HTMLAudioElement) {
        this.htmlAudioElem = htmlAudioElem;
        this.logger = debug("[MyAudioPlayer]");
        debug.enable("[MyAudioPlayer]");

        this.logger("[MyAudioPlayer] constructor() called");
    }

    async init(eventEmitter: EventEmitterForPlayerEvents): Promise<void> {
        this.logger("init() called");

        const loaded = new Promise<void>((resolve, reject) => {
            this.htmlAudioElem.addEventListener("loadeddata", () => resolve());
            this.htmlAudioElem.addEventListener("error", () => reject());
        });

        this.htmlAudioElem.addEventListener("ended", () => {
            this.logger("ended event");
            eventEmitter.emit("player.ended");
        });

        this.htmlAudioElem.addEventListener("error", () => {
            this.logger("error event", this.htmlAudioElem.error);
            eventEmitter.emit("player.error", this.htmlAudioElem.error);
        });

        this.htmlAudioElem.addEventListener("pause", () => {
            this.logger("pause event, currentTime:", this.htmlAudioElem.currentTime);
            eventEmitter.emit("player.pause", this.htmlAudioElem.currentTime);
        });

        this.htmlAudioElem.addEventListener("playing", () => {
            this.logger("playing event, currentTime:", this.htmlAudioElem.currentTime);
            eventEmitter.emit("player.playing", this.htmlAudioElem.currentTime);
        });

        this.htmlAudioElem.addEventListener("seeked", () => {
            this.logger("seeked event, currentTime:", this.htmlAudioElem.currentTime);
            eventEmitter.emit("player.seeked", this.htmlAudioElem.currentTime);
        });

        this.htmlAudioElem.addEventListener("timeupdate", () => {
            this.logger("timeupdate event, currentTime:", this.htmlAudioElem.currentTime);
            eventEmitter.emit("player.timeupdate", this.htmlAudioElem.currentTime);
        });

        await loaded;
    }

    destroy(): void {
        this.logger("destroy() called");

        // this.htmlAudioElem.removeEventListener("")
        this.htmlAudioElem.pause();
        this.htmlAudioElem.src = "";
        this.htmlAudioElem.load();
    }

    play(): Promise<void> {
        this.logger("play() called");
        return this.htmlAudioElem.play();
    }

    pause(): void {
        this.logger("pause() called");
        this.htmlAudioElem.pause();
    }

    isPlaying(): boolean {
        const playing = !this.htmlAudioElem.paused;
        this.logger("isPlaying() called, returning:", playing);
        return playing;
    }

    isSeeking(): boolean {
        const seeking = this.htmlAudioElem.seeking;
        this.logger("isSeeking() called, returning:", seeking);
        return seeking;
    }

    getCurrentTime(): number {
        const time = this.htmlAudioElem.currentTime;
        this.logger("getCurrentTime() called, returning:", time);
        return time;
    }

    getDuration(): number {
        this.logger("getDuration() called, returning:", this.htmlAudioElem.duration);
        return this.htmlAudioElem.duration;
    }

    seek(time: number): void {
        this.logger("seek() called with time:", time);
        this.htmlAudioElem.currentTime = time;
    }
}
