import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  readonly size = input<'sm' | 'md'>('md');
  readonly label = input('Loading...');
}
