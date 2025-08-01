import {Component, Input} from '@angular/core';
import {UseSagaReturn} from '@promise-saga/plugin-angular';

@Component({
  selector: 'saga-checkbox',
  templateUrl: './saga-checkbox.component.html',
  standalone: true,
})
export class SagaCheckbox {
  @Input() flow!: UseSagaReturn<any>;
}
