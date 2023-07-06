import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DownloaderComponent} from "./downloader.component";

describe('DownloaderComponent', () => {
  let component: DownloaderComponent;
  let fixture: ComponentFixture<DownloaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloaderComponent]
    });
    fixture = TestBed.createComponent(DownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
