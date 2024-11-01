import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoData } from '../../interfaces/video-data.model';
import { ContentService } from '../../services/content.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-offer-video-collection',
  standalone: true,
  imports: [CommonModule, OfferVideoCollectionComponent],
  templateUrl: './offer-video-collection.component.html',
  styleUrl: './offer-video-collection.component.scss'
})

export class OfferVideoCollectionComponent {
  @Input() title: string = '';
  @Input() videos: VideoData[] = [];
  @Input() scrollAmount: number = 600;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  cs = inject(ContentService);

  constructor(private viewportScroller: ViewportScroller) { }

  selectVideo(video: VideoData) {
    this.cs.selectedVideo = video;
    this.scrollToPreview();
  }

  scrollToPreview() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  scroll(direction: 'next' | 'back') {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;

      if (direction === 'next') {
        container.scrollLeft += this.scrollAmount;
      } else if (direction === 'back') {
        container.scrollLeft -= this.scrollAmount;
      }
    }
  }
}
