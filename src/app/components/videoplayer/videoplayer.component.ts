import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, HostListener, inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Hls from 'hls.js';
import { ContentService } from '../../services/content.service';
import { ErrToastComponent } from '../err-toast/err-toast.component';
@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, FormsModule, ErrToastComponent],
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoplayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('previewImg', { static: false }) previewImg!: ElementRef<HTMLImageElement>;
  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('timelineContainer', { static: false }) timelineContainer!: ElementRef<HTMLDivElement>;
  private resizeListener!: () => void;
  private timer: any;
  cs = inject(ContentService)
  resolution: number = 1080;
  hls!: Hls;
  availableQualities: Array<{ height: number, level: number }> = [];
  mouseTimeout: any;
  videoSource: string = '';
  isScrubbing: boolean = false;
  video_paused: boolean = true;
  video_duration: string = '';
  volume: number = 100;
  volume_mute: boolean = false;
  volume_pre_mute: number = 100;
  isVolumeSliderVisible: boolean = false;
  isVolumeSliderHover: boolean = false;
  isOverlayVisible: boolean = true;
  err_toast_msg: string = '';
  err_toast_is_error: boolean = true;
  err_toast_hidden: boolean = true;
  last_position_timestamp: number = 0;
  constructor(private route: ActivatedRoute, private router: Router, private renderer: Renderer2) { }

  ngOnInit() {
    const video = this.videoPlayer.nativeElement;
    document.addEventListener('mouseup', this.handleDocumentMouseUp);
    document.addEventListener('mousemove', this.handleDocumentMouseMove);
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    video.addEventListener('progress', this.handleProgressEvent);

    this.route.queryParams.subscribe(params => {
      this.videoSource = params['source'];
      this.loadVideo();
    });

    this.mouseTimeout = setTimeout(() => {
      this.hideOverlay();
    }, 3000);

    this.checkProgress();
  }

  ngOnDestroy() {
    const video = this.videoPlayer.nativeElement;
    video.removeEventListener('progress', this.handleProgressEvent);
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    if (this.resizeListener) {
      this.resizeListener();
    }
    this.stopTimer();
  }

  ngAfterViewInit() {
    if (this.timelineContainer && this.videoPlayer) {
      this.startTimer();
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange() {
    const isFullscreen = document.fullscreenElement;
    if (isFullscreen) {
      this.videoContainer.nativeElement.classList.add('fullscreen');
    } else {
      this.videoContainer.nativeElement.classList.remove('fullscreen');
    }
  }

  /**
   * Function to handle the time line update
   * @param e
   */
  handleTimelineUpdate(e: MouseEvent) {
    const rect = this.timelineContainer.nativeElement.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;

    if (this.isScrubbing) {
      e.preventDefault();
      this.timelineContainer.nativeElement.style.setProperty("--progress-position", percent.toString());
    }
  }

  /**
   * Function to handle the mouse up event on the document
   * @param e 
   */
  handleDocumentMouseUp = (e: MouseEvent) => {
    if (this.isScrubbing) {
      this.toggleScrubbing(e);
    }
  }

  /**
   * Function to handle the mouse move event on the document
   * @param e 
   */
  handleDocumentMouseMove = (e: MouseEvent) => {
    if (this.isScrubbing) {
      this.handleTimelineUpdate(e);
    }
  }

  /**
   * Function to handle the full screen change
   */
  handleFullscreenChange = () => {
    if (document.fullscreenElement) {
      this.videoContainer.nativeElement.classList.add('fullscreen');
    } else {
      this.videoContainer.nativeElement.classList.remove('fullscreen');
    }
  }

  /**
   * Function to handle the progress of the video loading
   */
  handleProgressEvent = () => {
    this.getVideoLoadProgress();
  }

  /**
   * Function to check if the mouse has moved in the past 3000 miliseconds / 3 seconds
   */
  onMouseMove() {
    clearTimeout(this.mouseTimeout);

    if (!this.isOverlayVisible) {
      this.showOverlay();
    }

    this.mouseTimeout = setTimeout(() => {
      this.hideOverlay();
    }, 3000);
  }

  /**
   * Function to display the overlay
   */
  showOverlay() {
    this.isOverlayVisible = true;
  }

  /**
   * Function to hide the overlay
   */
  hideOverlay() {
    this.isOverlayVisible = false;
  }

  /**
   * Function to display the volume slider
   */
  showVolumeSlider() {
    this.isVolumeSliderVisible = true;
  }

  /**
   * Function to enable full screen
   */
  toggleFullscreen() {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  /**
   * Function to mute the video
   */
  mute() {
    const video = this.videoPlayer.nativeElement;
    if (!video.muted) {
      video.muted = !video.muted;
      this.volume_mute = video.muted;
    }
  }

  /**
   * Function to unmute the video
   */
  unmute() {
    const video = this.videoPlayer.nativeElement;
    if (video.muted) {
      video.muted = !video.muted;
      this.volume_mute = video.muted;
    }
  }

  /**
   * Function to hide the volume sliderr
   */
  hideVolumeSlider() {
    setTimeout(() => {
      if (!this.isVolumeSliderHover) {
        this.isVolumeSliderVisible = false;
      }
    }, 300);
  }

  /**
   * Function to display the volume slider
   */
  onVolumeSliderMouseEnter() {
    this.isVolumeSliderHover = true;
  }

  /**
   * Function to hide the volume slider
   */
  onVolumeSliderMouseLeave() {
    this.isVolumeSliderHover = false;
  }

  /**
   * Function to get the time line progress of what's been loaded
   * @returns 
   */
  getVideoLoadProgress() {
    const video = this.videoPlayer.nativeElement;
    const timeline = this.timelineContainer?.nativeElement;
    if (!video || !timeline) {
      return;
    }

    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      const loadProgress = bufferedEnd / duration;
      timeline.style.setProperty("--preview-position", loadProgress.toFixed(2).toString());
      return loadProgress.toFixed(2);
    }
    return '0.00';
  }

  /**
   * Function to start video timer
   */
  startTimer() {
    this.timer = setInterval(() => {
      this.getRemainingTime();
      this.updateProgressPosition();
    }, 1000);
  }

  /**
   * Function to stop video timer
   */
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Function to get the remaining time of the video
   */
  getRemainingTime() {
    const video = this.videoPlayer.nativeElement;
    const currentTime = video.currentTime;
    const duration = video.duration;
    const remainingTime = duration - currentTime;
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = Math.floor(remainingTime % 60);
    this.video_duration = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  /**
   * Function to set the progress of the video time line
   * @returns 
   */
  updateProgressPosition() {
    const video = this.videoPlayer?.nativeElement;
    const timeline = this.timelineContainer?.nativeElement;
    if (!video || !timeline) {
      return;
    }
    const progress = video.currentTime / video.duration;
    timeline.style.setProperty('--progress-position', progress.toString());
  }

  /**
   * Function to toggle scrubbing when time line is changing
   * @param e 
   */
  toggleScrubbing(e: MouseEvent) {
    const rect = this.timelineContainer.nativeElement.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;
    this.isScrubbing = (e.buttons & 1) === 1;
    this.videoContainer.nativeElement.classList.toggle('scrubbing', this.isScrubbing);

    if (this.isScrubbing) {
      this.videoPlayer.nativeElement.play();
    } else {
      this.videoPlayer.nativeElement.currentTime = percent * this.videoPlayer.nativeElement.duration;
      if (!this.videoPlayer.nativeElement.paused) this.videoPlayer.nativeElement.play();
    }

    this.handleTimelineUpdate(e);
  }

  /**
   * Function to save video progress
   */
  async saveProgress() {
    const video = this.videoPlayer.nativeElement;
    const videoId = this.cs.selectedVideo.video_id;
    let lastPosition = video.currentTime;

    await this.cs.saveVideoProgress(videoId, lastPosition)
      .then((resp) => { })
      .catch(e => { });
  }

  /**
   * Function to return to the previous page
   */
  returnToPreviousPage() {
    this.saveProgress();
    if (document.fullscreenElement) {
      this.toggleFullscreen();
    }
    this.router.navigate(['/']);
  }

  /**
   * Function to start or stop the video
   */
  toggleStartStop() {
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      this.startVideo();
    } else {
      this.pauseVideo();
    }
  }

  /**
   * Function to start the video
   */
  startVideo() {
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play();
      this.video_paused = false;
    }
  }

  /**
   * Function to pause the video
   */
  pauseVideo() {
    const video = this.videoPlayer.nativeElement;
    if (!video.paused) {
      video.pause();
      this.video_paused = true;
    }
  }

  /**
   * Function to skip 10 seconds on the video
   */
  skipForward() {
    const video = this.videoPlayer.nativeElement;
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
  }

  /**
   * Function to return 10 seconds on the video
   */
  skipBackward() {
    const video = this.videoPlayer.nativeElement;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  }

  /**
   * Function to change the volume of the video
   * @param event 
   */
  changeVolume(event: any) {
    const video = this.videoPlayer.nativeElement;
    video.volume = event.target.value / 100;
  }

  /**
   * Function to load the video segments
   */
  loadVideo() {
    if (this.videoSource) {
      this.pauseVideo();

      if (Hls.isSupported()) {
        this.hls = new Hls();
        this.hls.loadSource(this.videoSource);
        this.hls.attachMedia(this.videoPlayer.nativeElement);
        this.hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          this.availableQualities = data.levels.map((level: any, index: number) => {
            return { height: level.height, level: index };
          });
          this.videoPlayer.nativeElement.volume = this.volume / 100;
          this.startVideo();
        });
      } else if (this.videoPlayer.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
        this.videoPlayer.nativeElement.src = this.videoSource;
        this.videoPlayer.nativeElement.volume = this.volume / 100;
      }
    }
  }

  /**
   * Function to select the video quality
   * @param height 
   */
  switchQuality(height: number) {
    if (this.hls) {
      this.resolution = height;
      const selectedQuality = this.availableQualities.find(q => q.height === height);
      if (selectedQuality) {
        this.hls.currentLevel = selectedQuality.level;
      }
    }
  }

  /**
   * Function to check if the video has been viewed to a certain point
   */
  async checkProgress() {
    let startedVideos = await this.cs.getInProgressVideos();
    const videosArray = Array.isArray(startedVideos) ? startedVideos : Object.values(startedVideos);

    videosArray.forEach((item: any) => {
      if (item.video.id === this.cs.selectedVideo.video_id) {
        this.progressPopupMessage(item.video.title, item.last_position);
      }
    });
  }

  /**
   * Function to set up the popup message to go to the last saved progress
   * @param videoTitle -Video title for the popup message
   * @param lastPosition -Number of the progress
   */
  progressPopupMessage(videoTitle: string, lastPosition: number) {
    this.last_position_timestamp = lastPosition;
    this.err_toast_msg = `Click on me for last watched position of ${videoTitle}`;
    this.err_toast_is_error = false;
    this.setAndShowErrToast(this.err_toast_msg, this.err_toast_is_error);
  }

  /**
 * Function to display, set the error toast message and if should appear as an error or normal popup
 * @param msg -Error toast message
 * @param is_err -Sets the error toast to an error if true
 */
  setAndShowErrToast(msg: string, is_err: boolean) {
    this.err_toast_msg = msg;
    this.err_toast_is_error = is_err;
    this.err_toast_hidden = false;

    setTimeout(() => {
      this.err_toast_hidden = true;
    }, 5000)
  }

  /**
   * Function to go to the last saved progress of the video
   */
  goToLastPosition() {
    this.pauseVideo();
    const video = this.videoPlayer.nativeElement;
    const timeline = this.timelineContainer?.nativeElement;

    const progress = this.last_position_timestamp / video.duration;
    timeline.style.setProperty('--progress-position', progress.toString());
    this.videoPlayer.nativeElement.currentTime = this.last_position_timestamp;
  }
}
