import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import {NgZone} from "@angular/core";
import {Observable} from "rxjs";

interface Link {
  name: string,
  url: string,
  icon: string,
  description: string
}

export const links: Link[] = [
  {
    name: 'SkyeDownloader',
    url: '/downloader',
    icon: 'download',
    description: 'Download media from Twitter, Youtube, Reddit and many other websites.'
  },
  {
    name: 'SkyeConverter',
    url: '/converter',
    icon: 'sync',
    description: 'Convert between different file formats.'
  },
  {
    name: 'SkyeTV',
    url: '/tv',
    icon: 'live_tv',
    description: 'Watch films and movies online (not made by me, only self-hosting).'
  },
]

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted);
  }
}

export interface ProgressMessage {
  isCompleted: boolean
  progress: number
  fileId: string
}

export function observeEventSource(source: EventSource, zone: NgZone) {
  return new Observable<ProgressMessage>(subscriber => {
    source.onerror = err => {
      zone.run(() => subscriber.error(err));
    };
    source.addEventListener("progress", data => {
      zone.run(() => subscriber.next(JSON.parse(data.data)));
    });
    source.addEventListener("err", data => {
      zone.run(() => subscriber.error(data.data));
    });
  });
}
