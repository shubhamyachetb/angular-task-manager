import { Directive, ElementRef, inject, input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnChanges {
  private readonly el = inject(ElementRef<HTMLElement>);

  readonly appHighlight = input<string>('');
  readonly searchTerm = input<string>('');

  ngOnChanges(): void {
    const term = this.searchTerm().trim();
    const text = this.appHighlight();

    if (!term) {
      this.el.nativeElement.textContent = text;
      return;
    }

    const regex = new RegExp(`(${this.escapeRegex(term)})`, 'gi');
    const parts = text.split(regex);

    this.el.nativeElement.innerHTML = parts
      .map((part) =>
        part.toLowerCase() === term.toLowerCase()
          ? `<mark class="highlight">${part}</mark>`
          : part,
      )
      .join('');
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
