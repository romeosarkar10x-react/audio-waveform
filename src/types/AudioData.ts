import type { MyAudioPlayer } from "@/lib/utils/audio/MyAudioPlayer";

export type AudioDataType = {
    player: MyAudioPlayer;
    buffer: AudioBuffer;
};
