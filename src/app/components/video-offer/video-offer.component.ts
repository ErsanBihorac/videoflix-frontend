import { Component } from '@angular/core';
import { OfferVideoCollectionComponent } from "../offer-video-collection/offer-video-collection.component";
import { OfferInfoPreviewComponent } from "../offer-info-preview/offer-info-preview.component";
import { OfferHeaderComponent } from "../offer-header/offer-header.component";
import { OfferFooterComponent } from "../offer-footer/offer-footer.component";
import { Collection } from '../../interfaces/collection.model';

@Component({
  selector: 'app-video-offer',
  standalone: true,
  imports: [OfferVideoCollectionComponent, OfferInfoPreviewComponent, OfferHeaderComponent, OfferFooterComponent],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss'
})

export class VideoOfferComponent {
    content: Collection[] = [
      {  
        category: 'New on Videoflix', 
        videos: [
          { video_img: '/img/preview_img1.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img1.jpeg', video_source: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8' },
          { video_img: '/img/preview_img1.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img1.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img1.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img1.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img1.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
        ]
      },
      {  
        category: 'Documentary', 
        videos: [
          { video_img: '/img/preview_img2.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img2.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img2.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img2.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img2.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img2.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img2.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
        ]
      },
      {  
        category: 'Drama', 
        videos: [
          { video_img: '/img/preview_img3.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img3.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img3.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img3.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img3.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img3.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img3.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
        ]
      },
      {  
        category: 'Romance', 
        videos: [
          { video_img: '/img/preview_img4.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img4.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img4.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img4.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img4.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img4.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
          { video_img: '/img/preview_img4.jpeg', video_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' }
        ]
      }
    ]

}
