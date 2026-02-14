import { useEffect, useRef, useState } from "react";
import Peaks from "peaks.js";
import type { PeaksInstance, PeaksOptions } from "peaks.js";
import { Button } from "../ui/button";
import { Pause, Play } from "lucide-react";
import { audioContext } from "@/lib/utils/audio/context";
import { MyAudioPlayer } from "@/lib/utils/audio/MyAudioPlayer";

export default function AudioWaveform({
    id,
    audioPlayer,
    isPlaying,
    audioBuffer,
    onPlay,
    onPause,
}: {
    id: number;
    audioPlayer: HTMLAudioElement;
    audioBuffer: AudioBuffer;
    isPlaying: boolean;
    onPlay: (id: number) => void;
    onPause: (id: number) => void;
}) {
    const firstRender = useRef(true);

    const zoomviewContainerRef = useRef<HTMLDivElement | null>(null);
    const overviewContainerRef = useRef<HTMLDivElement | null>(null);

    const [peaks, setPeaks] = useState<PeaksInstance | null>(null);

    const [myAudioPlayer, setMyAudioPlayer] = useState(() => {
        return new MyAudioPlayer(audioPlayer);
    });

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        (async function () {
            setMyAudioPlayer(new MyAudioPlayer(audioPlayer));
        })();
    }, [audioPlayer]);

    useEffect(() => {
        (async () => {
            if (!(zoomviewContainerRef.current && overviewContainerRef.current)) {
                return;
            }

            const options: PeaksOptions = {
                axisTopMarkerHeight: 0,
                axisBottomMarkerHeight: 0,
                zoomview: { container: zoomviewContainerRef.current, showAxisLabels: false },
                overview: { container: overviewContainerRef.current, showAxisLabels: false },
                webAudio: {
                    audioContext,
                    audioBuffer,
                },
                player: myAudioPlayer,
            };

            Peaks.init(options, (err, instance) => {
                if (!instance) {
                    console.log("Peaks init error:", err);
                    return;
                }

                if (instance) {
                    setPeaks(instance);
                    instance.on("player.playing", (time) => {
                        console.log("Playing:", time);
                    });
                    instance.on("player.timeupdate", (time) => {
                        console.log("TimeUpdate:", time);
                    });
                    instance.on("player.ended", () => {
                        console.log("ended");
                        onPause(id);
                    });
                }
            });
        })();
    }, [setPeaks, onPause, id]);

    useEffect(() => {
        if (!peaks) {
            return;
        }

        if (isPlaying) {
            peaks.player.play();
        } else {
            peaks.player.pause();
        }
    }, [isPlaying]);

    return (
        <>
            <div className="flex gap-2 items-center">
                <Button size="sm" onClick={() => (isPlaying ? onPause : onPlay)(id)}>
                    {isPlaying ? <Pause /> : <Play />}
                </Button>
                <div className="border-border border w-120 rounded-md p-1">
                    <div ref={zoomviewContainerRef} className="peaks_zoomview_container h-24"></div>
                    <div ref={overviewContainerRef} className="peaks_overview_container h-8 border-t-2"></div>
                </div>
            </div>
        </>
    );
}
