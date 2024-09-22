import { Component } from '@angular/core';
import { OfferVideoCollectionComponent } from "../offer-video-collection/offer-video-collection.component";
import { OfferInfoPreviewComponent } from "../offer-info-preview/offer-info-preview.component";
import { OfferHeaderComponent } from "../offer-header/offer-header.component";
import { OfferFooterComponent } from "../offer-footer/offer-footer.component";

export interface Video {
  title: string;
  collections: string[]
}

@Component({
  selector: 'app-video-offer',
  standalone: true,
  imports: [OfferVideoCollectionComponent, OfferInfoPreviewComponent, OfferHeaderComponent, OfferFooterComponent],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss'
})

export class VideoOfferComponent {
  content = [
    { title: 'New on Videoflix', collection: ['/img/preview_img1.jpeg', '/img/preview_img1.jpeg', '/img/preview_img1.jpeg', '/img/preview_img1.jpeg', '/img/preview_img1.jpeg', '/img/preview_img1.jpeg', '/img/preview_img1.jpeg', '/img/preview_img1.jpeg','/img/preview_img1.jpeg','/img/preview_img1.jpeg',] },
    { title: 'Documentary', collection: ['/img/preview_img2.jpeg','/img/preview_img2.jpeg','/img/preview_img2.jpeg', '/img/preview_img2.jpeg', '/img/preview_img2.jpeg', '/img/preview_img2.jpeg', '/img/preview_img2.jpeg', '/img/preview_img2.jpeg', '/img/preview_img2.jpeg', '/img/preview_img2.jpeg',] },
    { title: 'Drama', collection: ['/img/preview_img3.jpeg', '/img/preview_img3.jpeg', '/img/preview_img3.jpeg', '/img/preview_img3.jpeg', '/img/preview_img3.jpeg', '/img/preview_img3.jpeg', '/img/preview_img3.jpeg', '/img/preview_img3.jpeg', '/img/preview_img3.jpeg', '/img/preview_img3.jpeg',] },
    { title: 'Romance', collection: ['/img/preview_img4.jpeg', '/img/preview_img4.jpeg', '/img/preview_img4.jpeg', '/img/preview_img4.jpeg', '/img/preview_img4.jpeg', '/img/preview_img4.jpeg', '/img/preview_img4.jpeg', '/img/preview_img4.jpeg', '/img/preview_img4.jpeg', '/img/preview_img4.jpeg',] }
  ]
}
