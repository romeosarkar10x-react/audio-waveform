import { useCallback, useEffect, useState } from "react";
import AudioWaveform from "./components/AudioWaveform";
import { GLOBALS } from "./globals";
import { audioContext } from "./lib/utils/audio/context";

type AudioType = {
    player: HTMLAudioElement;
    buffer: AudioBuffer;
};

export default function App() {
    /*
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [audioPlayer] = useState(() => {
        const audioPlayer = new Audio(`${GLOBALS.BASE_URL}/sounds/valhallaTheme.mp3`);

        return audioPlayer;
    });
    */

    // const firstRender = useRef(true);
    const [audio, setAudio] = useState<AudioType | null>(null);

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

            setAudio({ player: audioElem, buffer: audioBuffer });
        })();
        // if()
    }, []);

    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = useCallback(() => {
        setIsPlaying(true);
    }, [setIsPlaying]);

    const handlePause = useCallback(() => {
        setIsPlaying(false);
    }, [setIsPlaying]);

    return (
        <>
            <h1>Hello world!</h1>
            <div className="px-8 pt-8">
                {/*{audioBuffer ? (
                    <AudioWaveform id={0} onPlay={handlePlay} onPause={handlePause} {...{ audioBuffer, isPlaying }} />
                ) : (
                    <p>Failed to load audio buffer...</p>
                )}*/}
                {audio ? (
                    <AudioWaveform
                        id={0}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        {...{ audioPlayer: audio.player, audioBuffer: audio.buffer, isPlaying }}
                    />
                ) : (
                    <p>Failed to load audio buffer...</p>
                )}
            </div>
        </>
    );
}
