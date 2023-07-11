import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import {NgZone} from "@angular/core";
import {Observable} from "rxjs";

interface Link {
  name: string;
  url: string;
  icon: string;
  description: string;
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
    description: 'Convert between different media file formats.'
  },
  {
    name: 'SkyeTV',
    url: '/tv',
    icon: 'live_tv',
    description: 'Watch movies and shows online (not made by me, only self-hosting).'
  },
];

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted);
  }
}

export interface ProgressMessage {
  isCompleted: boolean;
  progress: number;
  fileId: string;
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

export interface Theme {
  backgroundColor: string;
  buttonColor: string;
  headingColor: string;
  label: string;
  value: string;
}

export const themes: Theme[] = [
  {
    "backgroundColor": "#fff",
    "buttonColor": "#ffc107",
    "headingColor": "#673ab7",
    "label": "Deep Purple & Amber",
    "value": "deeppurple-amber"
  },
  {
    "backgroundColor": "#fff",
    "buttonColor": "#ff4081",
    "headingColor": "#3f51b5",
    "label": "Indigo & Pink",
    "value": "indigo-pink"
  },
  {
    "backgroundColor": "#303030",
    "buttonColor": "#607d8b",
    "headingColor": "#e91e63",
    "label": "Pink & Blue Grey",
    "value": "pink-bluegrey"
  },
  {
    "backgroundColor": "#303030",
    "buttonColor": "#4caf50",
    "headingColor": "#9c27b0",
    "label": "Purple & Green",
    "value": "purple-green"
  }
];
