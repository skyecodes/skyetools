import {Component, ViewChild} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConverterService} from "./converter.service";

import {CustomErrorStateMatcher} from "../common/utils";
import {StorageService} from "../common/storage.service";
import {ProgressSpinnerMode} from "@angular/material/progress-spinner";

type FileType = 'none' | 'video' | 'audio' | 'image';

const formats = {
  none: [],
  video: ['mp4', 'webm', 'mkv', 'mov', 'wmv', 'flv', 'avi'],
  audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'pcm', 'aiff', 'alac'],
  image: ['jpeg', 'png', 'gif', 'tiff', 'bmp']
}

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent {
  @ViewChild('dropZone') dropZone!: any;
  format = new FormControl<string>('', [Validators.required]);
  convertAudio = new FormControl<boolean>(false);
  inputFile: File | undefined;
  inputFileType: FileType = 'none';
  processing: boolean = false;
  formats = formats;
  matcher = new CustomErrorStateMatcher();
  progressMode: ProgressSpinnerMode = 'indeterminate';
  progressValue: number = 0;

  constructor(private converterService: ConverterService, private storageService: StorageService, private snackBar: MatSnackBar) {
    this.resetFile();
  }

  onFileAdded(fileList: FileList | null) {
    if (fileList == null || fileList.length > 1) {
      this.snackBar.open('Please select only one file to upload.', 'CLOSE', {
        panelClass: 'snackbar-error'
      });
    } else {
      let inputFile = fileList.item(0)!;
      console.log(inputFile);
      if (inputFile.type.startsWith('audio') || inputFile.name.endsWith('ogg')) {
        this.inputFileType = 'audio';
        this.inputFile = inputFile;
        this.format.enable();
      } else if (inputFile.type.startsWith('video')) {
        this.inputFileType = 'video';
        this.inputFile = inputFile;
        this.format.enable();
        this.convertAudio.enable();
      } else if (inputFile.type.startsWith('image') && !inputFile.name.toLowerCase().endsWith("svg")) {
        this.inputFileType = 'image';
        this.inputFile = inputFile;
        this.format.enable();
      } else {
        this.snackBar.open('The file must be a video, audio or image file.', 'CLOSE', {
          panelClass: 'snackbar-error'
        });
      }
    }
  }

  resetFile() {
    this.inputFile = undefined;
    this.inputFileType = 'none';
    this.format.disable();
    this.convertAudio.setValue(false);
    this.convertAudio.disable();
  }

  getConvertedFileType() {
    return this.convertAudio.value ? 'audio' : this.inputFileType;
  }

  getProgressText() {
    if (this.progressValue == 0) {
      return 'Preparing...';
    } else if (this.progressValue == 100) {
      return 'Finalizing...';
    } else {
      return 'Processing ' + this.progressValue.toFixed() + '%';
    }
  }

  process() {
    this.processing = true;
    this.converterService.convert(this.inputFile!, this.format.value!).subscribe({
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
    this.converterService.getProgress(processId).subscribe({
      next: response => {
        console.log(response);
        if (!response.fileId) {
          this.progressMode = 'determinate';
          this.progressValue = response.progress;
        } else {
          this.converterService.closeEventSource();
          this.download(response.fileId);
        }
      },
      error: err => {
        if (!!err && typeof err.data === 'string') { // this is an error sent by the API
          this.snackBar.open('Could not process URL.', 'CLOSE', {
            panelClass: 'snackbar-error'
          });
        } else { // this is a communication error
          this.snackBar.open('A communication error has occurred.', 'CLOSE', {
            panelClass: 'snackbar-error'
          });
        }
        this.converterService.closeEventSource();
        this.resetProgress();
      }
    })

  }

  private download(fileId: string) {
    this.storageService.download(fileId).subscribe({
      next: () => {
        this.resetProgress();
      },
      error: () => {
        this.snackBar.open('An error occurred while downloading the file.', 'CLOSE', {
          panelClass: 'snackbar-error'
        });
        this.resetProgress();
      }
    });
  }

  private resetProgress() {
    this.processing = false;
    this.progressMode = 'indeterminate';
    this.progressValue = 0;
    //this.format.markAsPristine();
  }
}
