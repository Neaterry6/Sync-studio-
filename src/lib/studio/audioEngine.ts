import * as Tone from 'tone';

class AudioEngine {
  private players: Map<string, Tone.Player> = new Map();
  private effects: Map<string, Tone.ToneAudioNode> = new Map();
  private masterBus: Tone.Channel = new Tone.Channel().toDestination();
  private recorder: Tone.Recorder | null = null;
  private mic: Tone.UserMedia | null = null;

  constructor() {
    this.masterBus.volume.value = -6;
  }

  async init() {
    await Tone.start();
    console.log("Audio Engine Started");
  }

  async toggleMic() {
    if (!this.mic) {
      this.mic = new Tone.UserMedia();
      this.recorder = new Tone.Recorder();
      this.mic.connect(this.recorder);
    }

    if (this.mic.state === 'started') {
      await this.mic.close();
      return false;
    } else {
      await this.mic.open();
      return true;
    }
  }

  startRecording() {
    if (this.recorder) {
      this.recorder.start();
    }
  }

  async stopRecording() {
    if (this.recorder) {
      const blob = await this.recorder.stop();
      this.stop();
      return blob;
    }
    return null;
  }

  async loadTrack(id: string, url: string) {
    if (this.players.has(id)) {
      this.players.get(id)?.dispose();
    }

    const player = new Tone.Player(url).connect(this.masterBus);
    await player.load(url);
    player.sync().start(0);
    this.players.set(id, player);
    return player;
  }

  play() {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause();
    } else {
      Tone.Transport.start();
    }
  }

  stop() {
    Tone.Transport.stop();
  }

  seek(seconds: number) {
    Tone.Transport.seconds = seconds;
  }

  setVolume(id: string, db: number) {
    const player = this.players.get(id);
    if (player) {
      player.volume.value = db;
    }
  }

  get currentTime() {
    return Tone.Transport.seconds;
  }

  setMasterVolume(db: number) {
    this.masterBus.volume.value = db;
  }
}

export const audioEngine = new AudioEngine();
