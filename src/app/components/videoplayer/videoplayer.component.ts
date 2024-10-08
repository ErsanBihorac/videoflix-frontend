import { Component, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Hls from 'hls.js';
@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoplayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('previewImg', { static: false }) previewImg!: ElementRef<HTMLImageElement>;
  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('timelineContainer', { static: false }) timelineContainer!: ElementRef<HTMLDivElement>;
  
  private timer: any;
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
  
  constructor(private route: ActivatedRoute, private location: Location) { }
  
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
  }
  
  ngOnDestroy() {
    const video = this.videoPlayer.nativeElement;
    video.removeEventListener('progress', this.handleProgressEvent);
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.handleDocumentMouseUp);
    document.removeEventListener('mousemove', this.handleDocumentMouseMove);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
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
  
  handleTimelineUpdate(e: MouseEvent) {
    const rect = this.timelineContainer.nativeElement.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width;

    if (this.isScrubbing) {
      e.preventDefault();
      this.timelineContainer.nativeElement.style.setProperty("--progress-position", percent.toString());
    }
  }
  
  handleDocumentMouseUp = (e: MouseEvent) => {
    if (this.isScrubbing) {
      this.toggleScrubbing(e);
    }
  };

  handleDocumentMouseMove = (e: MouseEvent) => {
    if (this.isScrubbing) {
      this.handleTimelineUpdate(e);
    }
  };

  handleFullscreenChange = () => {
    if (document.fullscreenElement) {
      this.videoContainer.nativeElement.classList.add('fullscreen');
    } else {
      this.videoContainer.nativeElement.classList.remove('fullscreen');
    }
  };

  handleProgressEvent = () => {
    this.getVideoLoadProgress();
  }

  onMouseMove() {
    clearTimeout(this.mouseTimeout);
    
    if (!this.isOverlayVisible) {
      this.showOverlay();
    }
    
    this.mouseTimeout = setTimeout(() => {
      this.hideOverlay();
    }, 3000);
  }

  showOverlay() {
    this.isOverlayVisible = true;
  }

  hideOverlay() {
    this.isOverlayVisible = false;
  }

  showVolumeSlider() {
    this.isVolumeSliderVisible = true;
  }

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

  mute() {
    const video = this.videoPlayer.nativeElement;
    if (!video.muted) {
      video.muted = !video.muted;
      this.volume_mute = video.muted;
    }
  }

  unmute() {
    const video = this.videoPlayer.nativeElement;
    if (video.muted) {
      video.muted = !video.muted;
      this.volume_mute = video.muted;
    }
  }

  hideVolumeSlider() {
    setTimeout(() => {
      if (!this.isVolumeSliderHover) {
        this.isVolumeSliderVisible = false;
      }
    }, 300);
  }

  onVolumeSliderMouseEnter() {
    this.isVolumeSliderHover = true;
  }

  onVolumeSliderMouseLeave() {
    this.isVolumeSliderHover = false; 
  }

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
  
  startTimer() {
    this.timer = setInterval(() => {
      this.getRemainingTime();
      this.updateProgressPosition();
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getRemainingTime() {
    const video = this.videoPlayer.nativeElement;
    const currentTime = video.currentTime;
    const duration = video.duration;
    const remainingTime = duration - currentTime;
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = Math.floor(remainingTime % 60);
    this.video_duration = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Gibt die verbleibende Zeit zurück
  }

  updateProgressPosition() {
    const video = this.videoPlayer?.nativeElement;
    const timeline = this.timelineContainer?.nativeElement;
    if (!video || !timeline) {
      return;
    }
    const progress = video.currentTime / video.duration;
    timeline.style.setProperty('--progress-position', progress.toString());
  }

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

  returnToPreviousPage() {
    if (document.fullscreenElement) {
      this.toggleFullscreen();
    }
    this.location.back();
  }

  toggleStartStop(){
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      this.startVideo();
    } else {
      this.pauseVideo();
    }
  }

  startVideo() {
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play();
      this.video_paused = false;
    }
  }

  pauseVideo() {
    const video = this.videoPlayer.nativeElement;
    if (!video.paused) {
      video.pause();
      this.video_paused = true;
    }
  }

  skipForward() {
    const video = this.videoPlayer.nativeElement;
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
  }

  skipBackward() {
    const video = this.videoPlayer.nativeElement;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  }

  changeVolume(event: any) {
    const video = this.videoPlayer.nativeElement;
    video.volume = event.target.value / 100;
  }

  loadVideo() {
    if (this.videoSource) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(this.videoSource);
        hls.attachMedia(this.videoPlayer.nativeElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.videoPlayer.nativeElement.volume = this.volume / 100;
        });
      } else if (this.videoPlayer.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
        this.videoPlayer.nativeElement.src = this.videoSource;
        this.videoPlayer.nativeElement.volume = this.volume / 100;
      }
    }
  }
}
