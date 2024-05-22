import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioCacheService {
  private readonly _filePathsToAudios = new Map<string, HTMLAudioElement>();

  public getAudio(filePath: string): HTMLAudioElement {
    const existingAudio = this._filePathsToAudios.get(filePath);
    if (existingAudio) {
      return existingAudio;
    }

    const newAudio = new Audio(filePath);
    this._filePathsToAudios.set(filePath, newAudio);
    return newAudio;
  }
}
