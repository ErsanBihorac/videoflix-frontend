import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer-video-collection',
  standalone: true,
  imports: [CommonModule, OfferVideoCollectionComponent],
  templateUrl: './offer-video-collection.component.html',
  styleUrl: './offer-video-collection.component.scss'
})
export class OfferVideoCollectionComponent {
  @Input() title: string = '';
  @Input() videos: string[] = [];
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  scroll_btn_active: boolean | null = true;

  checkForScroll(): void {
    const container = this.scrollContainer.nativeElement;
    const clientWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;

    if (scrollWidth > clientWidth) {
      this.scroll_btn_active = true;
      console.log('true')
    } else {
      this.scroll_btn_active = false;
      console.log('false')
    }
  }

  scroll(direction: 'next' | 'back') {
    const scrollAmount = 640;
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;

      if (direction === 'next') {
        container.scrollLeft += scrollAmount;
      } else if (direction === 'back') {
        container.scrollLeft -= scrollAmount;
      }
    }
  }
}