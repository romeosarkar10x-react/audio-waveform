import { useEffect, useState } from "react";
import AudioWaveform from "../AudioWaveform";
import { GLOBALS } from "@/globals";
import { audioContext } from "@/lib/utils/audio/context";
import { MyAudioPlayer } from "@/lib/utils/audio/MyAudioPlayer";
import { Button } from "../ui/button";
import { Pause, Play } from "lucide-react";
import type { AudioDataType } from "@/types/AudioData";

export default function AudioComponent() {
    const [audio, setAudio] = useState<AudioDataType | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        (async function () {
            const srcURL = `${GLOBALS.BASE_URL}/sounds/valhallaTheme.mp3`;
            const response = await fetch(srcURL);

            if (response.status !== 200) {
                return;
            }

            const buffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(buffer);

            const audioElem = new Audio(srcURL);
            const player = new MyAudioPlayer(audioElem);

            setAudio({ player, buffer: audioBuffer });
        })();
    }, []);

    if (!audio) {
        return <p>Audio is 'null'</p>;
    }

    return (
        <div className="flex gap-2 items-center">
            <Button
                size="sm"
                onClick={() =>
                    isPlaying ? (audio.player.pause(), setIsPlaying(false)) : (audio.player.play(), setIsPlaying(true))
                }
            >
                {isPlaying ? <Pause /> : <Play />}
            </Button>
            <AudioWaveform audioData={audio} />
        </div>
    );
}
