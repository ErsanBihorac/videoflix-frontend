import { Component, inject, OnInit } from '@angular/core';
import { OfferVideoCollectionComponent } from "../offer-video-collection/offer-video-collection.component";
import { OfferInfoPreviewComponent } from "../offer-info-preview/offer-info-preview.component";
import { OfferHeaderComponent } from "../offer-header/offer-header.component";
import { OfferFooterComponent } from "../offer-footer/offer-footer.component";
import { Collection } from '../../interfaces/collection.model';
import { ContentService } from '../../services/content.service';
import { VideoData } from '../../interfaces/video-data.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-video-offer',
  standalone: true,
  imports: [OfferVideoCollectionComponent, OfferInfoPreviewComponent, OfferHeaderComponent, OfferFooterComponent],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss'
})

export class VideoOfferComponent implements OnInit {
  cs = inject(ContentService);
  content: Collection[] = [];
  selectedVideo: number = 0;

  ngOnInit() {
    this.cs.receiveContent().then((resp: any) => {
      this.transformResponse(resp);
      console.log(resp);
      console.log(this.content);
      let random_zero_to_three = Math.floor(Math.random() * 4)
      let random_zero_to_six = Math.floor(Math.random() * 7)
      console.log('random_zero_to_four', random_zero_to_three)
      console.log('random_zero_to_seven', random_zero_to_six)
      this.cs.selectedVideo = this.content[random_zero_to_three].videos[random_zero_to_six];
    }).catch(error => {
      console.error('Fehler beim Laden des Inhalts:', error);
    });
  }

  transformResponse(data: any[]) {
    const categoryMapping: { [key: string]: string } = {
      'new': 'New on Videoflix',
      'documentary': 'Documentary',
      'drama': 'Drama',
      'romance': 'Romance'
    };

    // Erstelle eine leere Sammlung für jede benutzerfreundliche Kategorie
    const collections: Collection[] = Object.values(categoryMapping).map(category => ({
      category: category,
      videos: []  // Leeres Array für die Videos in jeder Kategorie
    }));

    // Gehe die Videos durch und füge sie in die richtige Kategorie-Sammlung ein
    data.forEach(item => {
      const video: VideoData = {
        video_id: item.id,
        video_title: item.title,
        video_description: item.description,
        video_category: item.category,  // Verwende das Mapping hier für die Video-Daten
        video_img: `${environment.baseUrl}/media/thumbnails/${item.id}/thumbnail.jpeg`,  // Verwende das Thumbnail
        video_source: `${environment.baseUrl}/media/videos/${item.id}/master.m3u8`,  // Generiere den HLS-Link
        video_preview: `${environment.baseUrl}/media/previews/${item.id}/preview.mp4`  // Generiere den Preview-Link
      };

      // Finde die Sammlung mit dem passenden Kategorienamen und füge das Video hinzu
      const collection = collections.find(c => c.category === categoryMapping[item.category]);
      if (collection) {
        collection.videos.push(video);
      } else {
        console.log(`Kategorie nicht gefunden: ${item.category}`);
      }
    });

    this.content = collections
  }
}
