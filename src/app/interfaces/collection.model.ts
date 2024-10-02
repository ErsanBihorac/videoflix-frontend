import { VideoData } from './video-data.model';

export interface Collection {
  category: string;
  videos: VideoData[];
}