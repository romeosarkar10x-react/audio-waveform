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

    /*
    const [myAudioPlayer, setMyAudioPlayer] = useState(() => {
        return new MyAudioPlayer(audioPlayer);
    });
    */

    // const firstRender = useRef(true);
    // audioContext.createOscillator();

    // const bufferSource = audioContext.createBufferSource();
    // bufferSource;

    useEffect(() => {
        /*
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
            */

        // return new Audio();
        (async function () {
            const srcURL = `${GLOBALS.BASE_URL}/sounds/valhallaTheme.mp3`;
            const response = await fetch(srcURL);

            if (response.status !== 200) {
                return;
            }

            const buffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(buffer);

            // const blob = new Blob([buffer], { type: "audio/mpeg" });
            // const blobURL = URL.createObjectURL(blob);
            // console.log("blobURL:", blobURL);
            const audioElem = new Audio(srcURL);
            const player = new MyAudioPlayer(audioElem);

            setAudio({ player, buffer: audioBuffer });
        })();
        // if()
    }, []);

    /*
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        (async function () {
            setMyAudioPlayer(new MyAudioPlayer(audioPlayer));
        })();
    }, [audioPlayer]);
    */

    // const [isPlaying, setIsPlaying] = useState(false);

    /*
    const handlePlay = useCallback(() => {
        setIsPlaying(true);
    }, [setIsPlaying]);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, [setIsPlaying]);
    */

    if (!audio) {
        return <p>Audio is 'null'</p>;
    }

    return (
        <div className="flex gap-2 items-center">
            <Button size="sm" onClick={() => (audio.player.isPlaying() ? audio.player.pause() : audio.player.play())}>
                {audio.player.isPlaying() ? <Pause /> : <Play />}
            </Button>
            <AudioWaveform audioData={audio} />
        </div>
    );
}
