import {useEffect, useRef} from 'react';
import type {Video} from '../../types';
import 'cloudinary-video-player/cld-video-player.min.css';
import type {VideoPlayer} from "cloudinary-video-player";

interface Props {
    video: Video
}

export default function Player({video}: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<VideoPlayer>(null);

    useEffect(() => {
        const initPlayer = async () => {
            if (!videoRef.current || playerRef.current) return;

            // Dynamically import Cloudinary Video Player
            const cloudinary = await import('cloudinary-video-player');

            // Extract public_id from Cloudinary URL
            const publicId = video.public_id

            if (!publicId) {
                console.error('Could not extract public_id from video URL');
                return;
            }

            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

            // Initialize Cloudinary Video Player
            playerRef.current = cloudinary.videoPlayer('#vidoe-player', {
                cloud_name: cloudName,
                publicId: publicId,
                fluid: true,
                controls: true,
                sourceTypes: ['hls', 'dash', 'mp4'],
                transformation: {
                    streaming_profile: 'hd',
                },
                playbackRates: [0.75, 1, 1.25],
                autoplay: false,
                muted: false,
            });
        };

        void initPlayer();

        // Cleanup
        return () => {
            if (playerRef.current) {
                playerRef.current.dispose?.();
                playerRef.current = null;
            }
        };
    }, [video.video_url, video.public_id]);

    return (
        <div className="w-full rounded-xl overflow-hidden bg-black">
            <video
                ref={videoRef}
                id='vidoe-player'
                className="cld-video-player w-full"
                controls
            />
        </div>
    );
}