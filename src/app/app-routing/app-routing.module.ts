import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "../home/home.component";
import {DownloaderComponent} from "../downloader/downloader.component";
import {ConverterComponent} from "../converter/converter.component";
import {TvComponent} from "../tv/tv.component";

const routes: Routes = [
  {path: 'downloader', component: DownloaderComponent, title: 'SkyeDownloader'},
  {path: 'converter', component: ConverterComponent, title: 'SkyeConverter'},
  {path: 'tv', component: TvComponent, title: 'SkyeTV'},
  {path: '**', component: HomeComponent, title: 'SkyeTools'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
