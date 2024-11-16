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
  baseUrl = 'https://ersan-bihorac.developerakademie.org';
  cs = inject(ContentService);
  content: Collection[] = [];
  selectedVideo: number = 0;
  scrollAmount: number = 720;
  constructor(private router: Router) { }

  ngOnInit() {
    this.fillContent();
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
  selectRandomVideoNewOnVideoflix() {
    let randomVideoNewOnVideoflix = Math.floor(Math.random() * this.content[1].videos.length);

    if (this.content[1].videos[randomVideoNewOnVideoflix]) {
      this.cs.selectedVideo = this.content[1].videos[randomVideoNewOnVideoflix];
    } else {
      this.selectFirstAvailableVideo();
    }
  }

  /**
   * Function to select the first video available
   */
  selectFirstAvailableVideo() {
    for (let i = 0; i < this.content.length; i++) {
      for (let j = 0; j < this.content[i].videos.length; j++) {
        if (this.content[i].videos[j]) {
          this.cs.selectedVideo = this.content[i].videos[j];
          return
        }
      }
    }

    this.setNoVideos()
  }

  /**
   * Function to display the message that there are no uploaded videos
   */
  setNoVideos(){
    this.cs.selectedVideo.video_description = 'There are currently no Videos uploaded!'
    this.cs.videos_uploaded = false;
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
      'started': 'Started Videos',
      'new': 'New on Videoflix',
      'documentary': 'Documentary',
      'drama': 'Drama',
      'romance': 'Romance'
    }

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
      // video_img: `${this.baseUrl}/media/thumbnails/${item.id}/thumbnail.jpeg`,
      // video_source: `${this.baseUrl}/media/videos/${item.id}/master.m3u8`,
      // video_preview: `${this.baseUrl}/media/previews/${item.id}/preview.mp4`
    }

    return video
  }

  /**
   * Function to sort all videos in the correct format
   * @param categoryMapping -Category map for the keys
   * @param collections -Collection to put the videos in the correct format
   */
  async sortThenReturnData(categoryMapping: { [key: string]: string; }, collections: Collection[]) {
    const content: any = await this.cs.receiveContent().catch(e => {
      this.logout();
    })

    content.forEach((item: any) => {
      const video = this.returnVideo(item);
      const collection = collections.find(c => c.category === categoryMapping[item.category]);
      if (collection) {
        collection.videos.push(video);
      }
    })

    this.selectRandomVideoNewOnVideoflix();
  }

  /**
   * Function to sort all videos that already were started to get watched in the correct format
   * @param categoryMapping -Category map for the keys
   * @param collections -Collection to put the videos in the correct format
   */
  async sortStartedVideos(categoryMapping: { [key: string]: string; }, collections: Collection[]) {
    const startedVideos: any = await this.cs.getInProgressVideos();

    startedVideos.forEach((item: any) => {
      const video = this.returnVideo(item.video);
      const collection = collections.find(c => c.category === categoryMapping['started']);
      if (collection) {
        collection.videos.push(video);
      }
    })
  }

  /**
   * Function to fill the Content object
   */
  fillContent() {
    const categoryMapping = this.returnCategoryMapping();
    const collections = this.returnCollections();
    this.sortThenReturnData(categoryMapping, collections);
    this.sortStartedVideos(categoryMapping, collections);
    this.content = collections
  }
}
