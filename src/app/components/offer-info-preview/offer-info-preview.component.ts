import { AfterViewInit, Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-info-preview',
  standalone: true,
  imports: [],
  templateUrl: './offer-info-preview.component.html',
  styleUrl: './offer-info-preview.component.scss'
})
export class OfferInfoPreviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;
  @ViewChild('videoBg', { static: false }) videoBg!: ElementRef;
  cs = inject(ContentService)

  constructor(private router: Router) { }

  ngAfterViewInit() {
    this.handleResize = this.handleResize.bind(this);
    this.videoPlayer.nativeElement.addEventListener('loadedmetadata', this.handleResize);
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy() {
    this.videoPlayer.nativeElement.removeEventListener('loadedmetadata', this.handleResize);
    window.removeEventListener('resize', this.handleResize);
  }

  /**
   * Function to handle the resize event listener
   */
  handleResize() {
    this.setVideoBgHeight();
  }

  /**
   * Function to set the video background height
   */
  setVideoBgHeight() {
    const videoHeight = this.videoPlayer.nativeElement.offsetHeight;
    this.videoBg.nativeElement.style.height = `${videoHeight}px`;
  }

  /**
   * Function to open the videoplayer page and set the query parameters
   * @param videoUrl -String value / video url
   */
  openVideoPlayer(videoUrl: string) {
    this.router.navigate(['/videoplayer'], { queryParams: { source: videoUrl } });
  }
}
