import {Component} from '@angular/core';
import {DownloaderService} from './downloader.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProgressSpinnerMode} from "@angular/material/progress-spinner";
import {StorageService} from "../common/storage.service";
import {CustomErrorStateMatcher} from "../common/utils";

const urlReg = 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';

export interface DownloadForm {
  url: FormControl<string>
  convertAudio: FormControl<boolean>
}

@Component({
  selector: 'app-downloader',
  templateUrl: './downloader.component.html',
  styleUrls: ['./downloader.component.scss']
})
export class DownloaderComponent {
  processing: boolean = false;
  form = new FormGroup(<DownloadForm>{
    url: new FormControl('', [Validators.required, Validators.pattern(urlReg)]),
    convertAudio: new FormControl(false),
  });

  matcher = new CustomErrorStateMatcher();
  progressMode: ProgressSpinnerMode = 'indeterminate';
  progressValue: number = 0;
  isCompleted: boolean = false;

  constructor(private downloaderService: DownloaderService, private storageService: StorageService, private snackBar: MatSnackBar) {
  }

  getProgressText() {
    if (this.isCompleted) {
      return 'Finalizing...';
    } else if (this.progressValue == 0) {
      return 'Preparing...';
    } else {
      return 'Processing ' + this.progressValue.toFixed() + '%';
    }
  }

  process() {
    if (this.form.invalid) return;
    this.processing = true;
    this.downloaderService.process(this.form.value.url!, this.form.value.convertAudio!).subscribe({
      next: response => this.handleProgress(response),
      error: () => {
        this.snackBar.open('A server error occurred.', 'CLOSE', {
          panelClass: 'snackbar-error'
        });
        this.resetProgress();
      }
    });
  }

  private handleProgress(processId: string) {
    this.downloaderService.getProgress(processId).subscribe({
      next: response => {
        this.isCompleted = response.isCompleted;
        if (!this.isCompleted) {
          this.progressMode = 'determinate';
          this.progressValue = response.progress;
        } else {
          this.progressMode = 'indeterminate';
          this.progressValue = 0;
          if (!!response.fileId) {
            this.downloaderService.closeEventSource();
            this.storageService.download(response.fileId);
            this.resetProgress();
          }
        }
      },
      error: err => {
        if (!!err && typeof err.data === 'string') { // this is an error sent by the API
          this.form.controls.url.setErrors({'invalid': true});
          this.snackBar.open('Could not process URL.', 'CLOSE', {
            panelClass: 'snackbar-error'
          });
        } else { // this is a communication error
          this.snackBar.open('A communication error has occurred.', 'CLOSE', {
            panelClass: 'snackbar-error'
          });
        }
        this.downloaderService.closeEventSource();
        this.resetProgress();
      }
    })

  }

  private resetProgress() {
    this.processing = false;
    this.progressMode = 'indeterminate';
    this.progressValue = 0;
    this.isCompleted = false;
    this.form.markAsPristine();
  }
}
