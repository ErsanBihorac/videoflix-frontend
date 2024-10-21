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
    video_title: '',
    video_description: '',
    video_category: '',
    video_img: ``,
    video_source: ``,
    video_preview: ``
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
