import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { lastValueFrom } from 'rxjs';
import { VideoData } from '../interfaces/video-data.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  http = inject(HttpClient);
  selectedVideo: VideoData = {
    video_id: 1,
    video_title: 'Breakout',
    video_description: 'In a high-security prison, a wrongly convicted man formulates a meticulous plan to break out and prove his innocence. He must navigate a web of alliances and betrayals to reclaim his freedom and expose the truth.',
    video_category: 'New on Videoflix',
    video_img: `${environment.baseUrl}/media/thumbnails/1/thumbnail.jpeg`,
    video_source: `${environment.baseUrl}/media/videos/1/master.m3u8`,
    video_preview: `${environment.baseUrl}/media/previews/1/preview.mp4`
}

  public receiveContent() {
    const url = environment.baseUrl + '/api/content/videos/';
    return lastValueFrom(this.http.get(url));
  }

  returnHeaders() {
    const csrfToken = this.getCookie('csrftoken');
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    });

    return headers
  }

  private getCookie(name: string): string {
    let cookieValue = '';
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
}
