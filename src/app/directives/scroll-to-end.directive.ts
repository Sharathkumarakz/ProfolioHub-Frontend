import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    Output
  } from '@angular/core';
  
  @Directive({
    selector: '[appScrollToEnd]',
    standalone: true
  })
  export class ScrollToEndDirective {
    @Output() scrollToEnd = new EventEmitter<void>();
  
    private elementRef = inject(ElementRef);
  
    @HostListener('scroll')
    onScroll() {
      const element = this.elementRef.nativeElement;
      const atBottom =
        element.scrollHeight - element.scrollTop === element.clientHeight;
      if (atBottom) {
        this.scrollToEnd.emit();
      }
    }
  }
  