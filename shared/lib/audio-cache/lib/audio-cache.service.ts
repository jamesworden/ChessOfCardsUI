import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioCacheService {
  private readonly _isMuted$ = new BehaviorSubject<boolean>(false);
  private readonly _filePathsToAudios = new Map<string, HTMLAudioElement>();

  public isMuted$ = this._isMuted$.asObservable();

  public mute() {
    this._isMuted$.next(true);
  }

  public unmute() {
    this._isMuted$.next(false);
  }

  public play(filePath: string): HTMLAudioElement | undefined {
    if (this._isMuted$.getValue()) {
      return undefined;
    }

    const existingAudio = this._filePathsToAudios.get(filePath);
    if (existingAudio) {
      existingAudio.play();
      return existingAudio;
    }

    const newAudio = new Audio(filePath);
    this._filePathsToAudios.set(filePath, newAudio);
    newAudio.play();
    return newAudio;
  }
}
