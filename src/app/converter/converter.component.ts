import {Component} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent {
  form = new FormGroup({});
}
