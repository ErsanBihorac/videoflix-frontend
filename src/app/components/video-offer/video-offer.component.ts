import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OfferVideoCollectionComponent } from "../offer-video-collection/offer-video-collection.component";
import { OfferInfoPreviewComponent } from "../offer-info-preview/offer-info-preview.component";
import { OfferHeaderComponent } from "../offer-header/offer-header.component";
import { OfferFooterComponent } from "../offer-footer/offer-footer.component";
import { Collection } from '../../interfaces/collection.model';
import { ContentService } from '../../services/content.service';
import { VideoData } from '../../interfaces/video-data.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-offer',
  standalone: true,
  imports: [OfferVideoCollectionComponent, OfferInfoPreviewComponent, OfferHeaderComponent, OfferFooterComponent],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss'
})

export class VideoOfferComponent implements OnInit, OnDestroy {
  cs = inject(ContentService);
  content: Collection[] = [];
  selectedVideo: number = 0;
  scrollAmount: number = 720;
  constructor(private router: Router) { }

  ngOnInit() {
    this.cs.receiveContent().then((resp: any) => {
      this.transformResponse(resp);
      this.selectRandomVideo();
    }).catch(e => {
      this.logout();
    });

    this.setWindowWidth();
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize)
  }

  /**
   * Function to handle the resize event listener
   */
  handleResize() {
    this.setWindowWidth();
  }

  /**
   * Function to select a random preview video
   */
  selectRandomVideo() {
    let num_zero_to_three = Math.floor(Math.random() * 4)
    let num_zero_to_six = Math.floor(Math.random() * 7)
    this.cs.selectedVideo = this.content[num_zero_to_three].videos[num_zero_to_six];
  }

  /**
   * Function to set how much you can scroll through a video category based on the window width
   */
  setWindowWidth() {
    if (window.innerWidth < 500) {
      this.scrollAmount = 240;
    } else if (window.innerWidth < 700) {
      this.scrollAmount = 360;
    } else if (window.innerWidth < 900) {
      this.scrollAmount = 360;
    } else if (window.innerWidth < 1275) {
      this.scrollAmount = 480;
    } else {
      this.scrollAmount = 720;
    }
  }

  /**
   * Function to log out
   */
  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  /**
   * Function to receive a value based of a key
   * @returns -Returns the whole map
   */
  returnCategoryMapping() {
    const categoryMapping: { [key: string]: string } = {
      'new': 'New on Videoflix',
      'documentary': 'Documentary',
      'drama': 'Drama',
      'romance': 'Romance'
    };

    return categoryMapping
  }

  /**
   * Function to create the collections, which will be used to fill the content, based on the category map
   * @returns 
   */
  returnCollections() {
    const categoryMapping = this.returnCategoryMapping();

    const collections: Collection[] = Object.values(categoryMapping).map(category => ({
      category: category,
      videos: []
    }));

    return collections
  }
  
/**
 * Function that returns a video object in the correct format
 * @param item -Values to create video object
 * @returns -Video object
 */
  returnVideo(item: any) {
    const video: VideoData = {
      video_id: item.id,
      video_title: item.title,
      video_description: item.description,
      video_category: item.category,
      video_img: `${environment.baseUrl}/media/thumbnails/${item.id}/thumbnail.jpeg`,
      video_source: `${environment.baseUrl}/media/videos/${item.id}/master.m3u8`,
      video_preview: `${environment.baseUrl}/media/previews/${item.id}/preview.mp4`
    }

    return video
  }

  /**
   * Function to sort the content in the correct format
   * @param data -Values received from backend
   * @param categoryMapping -Category map for the keys
   * @param collections -Collection to put the data in the correct format
   * @returns -Sorted collection with video objects and categories
   */
  sortThenReturnData(data: any[], categoryMapping: { [key: string]: string; }, collections: Collection[]) {
    data.forEach(item => {
      const video = this.returnVideo(item);
      const collection = collections.find(c => c.category === categoryMapping[item.category]);
      if (collection) {
        collection.videos.push(video);
      }
    })

    return collections
  }

  /**
   * Function to transform the data
   * @param data -Backend data
   */
  transformResponse(data: any[]) {
    const categoryMapping = this.returnCategoryMapping();
    const collections = this.returnCollections();
    const sortedCollections = this.sortThenReturnData(data, categoryMapping, collections);
    this.content = sortedCollections;
  }
}
