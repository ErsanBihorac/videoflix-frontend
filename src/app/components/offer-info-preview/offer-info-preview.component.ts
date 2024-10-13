import { Component, inject } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-info-preview',
  standalone: true,
  imports: [],
  templateUrl: './offer-info-preview.component.html',
  styleUrl: './offer-info-preview.component.scss'
})
export class OfferInfoPreviewComponent {
  cs = inject(ContentService)

  constructor(private router: Router) {}
  
  openVideoPlayer(videoUrl: string) {
    this.router.navigate(['/videoplayer'], { queryParams: { source: videoUrl } });
  }
}
