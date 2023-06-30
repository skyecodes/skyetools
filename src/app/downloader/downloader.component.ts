import {Component, OnInit} from '@angular/core';
import {DownloaderService} from './downloader.service';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorStateMatcher} from "@angular/material/core";

const urlReg = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';

type DownloadType = 'all' | 'audio' | 'video';
type DownloadQuality = 'best' | 'worst';
type DownloadSize = '0' | '25' | '50' | '500';

export interface DownloadForm {
  url: FormControl<string>
  type: FormControl<DownloadType>
  quality: FormControl<DownloadQuality>
  size: FormControl<DownloadSize>
  preferFreeFormats: FormControl<boolean>
}

const defaultType: DownloadType = 'all'
const defaultQuality: DownloadQuality = 'best'
const defaultSize: DownloadSize = '0'
const defaultPreferFreeFormats: boolean = false

class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && isSubmitted);
  }
}

@Component({
  selector: 'app-downloader',
  templateUrl: './downloader.component.html',
  styleUrls: ['./downloader.component.scss']
})
export class DownloaderComponent implements OnInit {
  downloading: boolean = false;
  form = new FormGroup(<DownloadForm>{
    url: new FormControl('', [Validators.required, Validators.pattern(urlReg)]),
    type: new FormControl(defaultType, [Validators.required]),
    quality: new FormControl(defaultQuality, [Validators.required]),
    size: new FormControl(defaultSize, [Validators.required]),
    preferFreeFormats: new FormControl(defaultPreferFreeFormats)
  });

  typeValues = {
    'all': 'Audio + Video',
    'audio': 'Audio only',
    'video': 'Video only'
  }

  qualityValues = {
    'best': 'Best quality',
    'worst': 'Worst quality',
  }

  sizeValues = {
    0: 'No size limit',
    25: '25MB limit (Discord)',
    50: '50MB limit (Discord Nitro Basic)',
    500: '500MB limit (Discord Nitro)',
  }

  matcher = new CustomErrorStateMatcher();

  constructor(private service: DownloaderService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  download() {
    if (this.form.invalid) return;
    this.downloading = true;
    let download = this.service.download(this.form.value);
    download.subscribe({
      next: response => {
        this.downloading = false;
        let downloadUrl = window.URL.createObjectURL(response.body!);
        let filename = response.headers.get('Content-Disposition')!.substring(22);
        filename = filename.substring(0, filename.length - 2);
        let link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.click();
      },
      error: () => {
        this.downloading = false;
        this.snackBar.open('Could not download from URL', 'CLOSE', {
          panelClass: 'snackbar-error'
        });
      }
    });
  }

  getAdvancedOptionsText() {
    let str = '';
    let separator = ', '
    if (this.form.value.type != defaultType) {
      str += this.typeValues[this.form.value.type!] + separator;
    }
    if (this.form.value.quality != defaultQuality) {
      str += this.qualityValues[this.form.value.quality!] + separator;
    }
    if (this.form.value.size != defaultSize) {
      str += this.sizeValues[this.form.value.size!] + separator;
    }
    if (this.form.value.preferFreeFormats != defaultPreferFreeFormats) {
      str += 'Prefer free formats' + separator;
    }
    if (str == '') return 'Default options';
    return str.substring(0, str.length - separator.length);
  }

  resetOptions() {
    this.form.setValue({
      url: this.form.value.url!,
      type: defaultType,
      quality: defaultQuality,
      size: defaultSize,
      preferFreeFormats: defaultPreferFreeFormats
    });
  }
}
