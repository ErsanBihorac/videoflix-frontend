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

  getInProgressVideos() {
    const token = localStorage.getItem('authToken');
    const url = environment.baseUrl + '/api/content/video-progress/in_progress';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return lastValueFrom(this.http.get(url, { headers: headers }));
  }

  /**
   * Function to save Video Progress
   * @param videoId -Id of the video
   * @param lastPosition -Number of the progress in seconds
   * @returns 
   */
  saveVideoProgress(videoId: number, lastPosition: number) {
    const token = localStorage.getItem('authToken');
    const url = environment.baseUrl + `/api/content/video-progress/${videoId}/save_progress/`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return lastValueFrom(this.http.post(url, { last_position: lastPosition }, { headers: headers }));
  }

  /**
   * 
   * @returns Function to receive the content used for the videos
   */
  public receiveContent() {
    const token = localStorage.getItem('authToken');
    const url = environment.baseUrl + '/api/content/videos/';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return lastValueFrom(this.http.get(url, { headers: headers }));
  }

  /**
   * Function to return headers
   * @returns 
   */
  returnHeaders() {
    const csrfToken = this.getCookie('csrftoken');
    const headers = new HttpHeaders({
      'X-CSRFToken': csrfToken,
      'Content-Type': 'application/json'
    });

    return headers
  }

  /**
   * Function to get a specific cookie
   * @param name -Key name of the cookie
   * @returns -Value of the cookie
   */
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
