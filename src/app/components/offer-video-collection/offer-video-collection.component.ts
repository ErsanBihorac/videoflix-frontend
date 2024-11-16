import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoData } from '../../interfaces/video-data.model';
import { ContentService } from '../../services/content.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-offer-video-collection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-video-collection.component.html',
  styleUrl: './offer-video-collection.component.scss'
})

export class OfferVideoCollectionComponent {
  @Input() title: string = '';
  @Input() videos: VideoData[] = [];
  @Input() scrollAmount: number = 600;
  @Input() collectionHidden: boolean= false;;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  cs = inject(ContentService);
  
  constructor(private viewportScroller: ViewportScroller) { }

  /**
   * Function to select the preview video
   * @param video -Video
   */
  selectVideo(video: VideoData) {
    this.cs.selectedVideo = video;
    this.scrollToPreview();
  }

  /**
   * Function to scroll to the preview video
   */
  scrollToPreview() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  /**
   * Function to scroll left and right to see the other videos displayed
   * @param direction -Scroll direction
   */
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
