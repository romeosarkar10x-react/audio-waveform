import type { EventEmitterForPlayerEvents, PlayerAdapter } from "peaks.js";

export class MyAudioPlayer implements PlayerAdapter {
    private htmlAudioElem: HTMLAudioElement;
    // private eventEmitter!: EventEmitterForPlayerEvents;

    constructor(htmlAudioElem: HTMLAudioElement) {
        console.log("[MyAudioPlayer] Constructor called");
        this.htmlAudioElem = htmlAudioElem;
    }

    async init(eventEmitter: EventEmitterForPlayerEvents): Promise<void> {
        console.log("[MyAudioPlayer] init() called");

        const loaded = new Promise<void>((resolve, reject) => {
            this.htmlAudioElem.addEventListener("loadeddata", () => resolve());
            this.htmlAudioElem.addEventListener("error", () => reject());
        });

        this.htmlAudioElem.addEventListener("ended", () => {
            console.log("[MyAudioPlayer] ended event");
            eventEmitter.emit("player.ended");
        });

        this.htmlAudioElem.addEventListener("error", () => {
            console.log("[MyAudioPlayer] error event", this.htmlAudioElem.error);
            eventEmitter.emit("player.error", this.htmlAudioElem.error);
        });

        this.htmlAudioElem.addEventListener("pause", () => {
            console.log("[MyAudioPlayer] pause event, currentTime:", this.htmlAudioElem.currentTime);
            eventEmitter.emit("player.pause", this.htmlAudioElem.currentTime);
        });

        this.htmlAudioElem.addEventListener("playing", () => {
            console.log("[MyAudioPlayer] playing event, currentTime:", this.htmlAudioElem.currentTime);
            eventEmitter.emit("player.playing", this.htmlAudioElem.currentTime);
        });

        this.htmlAudioElem.addEventListener("seeked", () => {
            console.log("[MyAudioPlayer] seeked event, currentTime:", this.htmlAudioElem.currentTime);
            eventEmitter.emit("player.seeked", this.htmlAudioElem.currentTime);
        });

        this.htmlAudioElem.addEventListener("timeupdate", () => {
            console.log("[MyAudioPlayer] timeupdate event, currentTime:", this.htmlAudioElem.currentTime);
            eventEmitter.emit("player.timeupdate", this.htmlAudioElem.currentTime);
        });

        await loaded;
    }

    destroy(): void {
        console.log("[MyAudioPlayer] destroy() called");

        // this.htmlAudioElem.removeEventListener("")
        this.htmlAudioElem.pause();
        this.htmlAudioElem.src = "";
        this.htmlAudioElem.load();
    }

    play(): Promise<void> {
        console.log("[MyAudioPlayer] play() called");
        return this.htmlAudioElem.play();
    }

    pause(): void {
        console.log("[MyAudioPlayer] pause() called");
        this.htmlAudioElem.pause();
    }

    isPlaying(): boolean {
        const playing = !this.htmlAudioElem.paused;
        console.log("[MyAudioPlayer] isPlaying() called, returning:", playing);
        return playing;
    }

    isSeeking(): boolean {
        const seeking = this.htmlAudioElem.seeking;
        console.log("[MyAudioPlayer] isSeeking() called, returning:", seeking);
        return seeking;
    }

    getCurrentTime(): number {
        const time = this.htmlAudioElem.currentTime;
        console.log("[MyAudioPlayer] getCurrentTime() called, returning:", time);
        return time;
    }

    getDuration(): number {
        console.log("[MyAudioPlayer] getDuration() called, returning:", this.htmlAudioElem.duration);
        return this.htmlAudioElem.duration;
    }

    seek(time: number): void {
        console.log("[MyAudioPlayer] seek() called with time:", time);
        this.htmlAudioElem.currentTime = time;
    }
}
