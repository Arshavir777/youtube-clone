import {useEffect, useRef} from 'react';
import type {Video} from '../../types';
import 'cloudinary-video-player/cld-video-player.min.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'cloudinary-video-player/adaptive-streaming';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import 'cloudinary-video-player/dash';
import type {VideoPlayer} from "cloudinary-video-player";

interface Props {
    video: Video
}

export default function Player({video}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<VideoPlayer | null>(null);

    useEffect(() => {
        let mounted = true;

        const initPlayer = async () => {
            if (!containerRef.current) return;

            // Clean up existing player first
            if (playerRef.current) {
                try {
                    playerRef.current.dispose();
                } catch (error) {
                    console.error('Error disposing player:', error);
                }
                playerRef.current = null;
            }

            // Remove the old video element completely
            containerRef.current.innerHTML = '';

            // Create a fresh video element
            const videoElement = document.createElement('video');
            videoElement.className = 'cld-video-player w-full';
            videoElement.controls = true;
            videoElement.id = 'video-player';
            containerRef.current.appendChild(videoElement);

            if (!video.public_id) {
                console.error('Missing public_id for video');
                return;
            }

            if (!mounted) return;

            try {
                // Dynamically import Cloudinary Video Player
                const cloudinary = await import('cloudinary-video-player');

                if (!mounted) return;

                const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

                // Initialize Cloudinary Video Player with BTS (Bitmovin Technology Stack)
                playerRef.current = cloudinary.videoPlayer(videoElement.id, {
                    cloud_name: cloudName,
                    publicId: video.public_id,
                    fluid: true,
                    controls: true,
                    sourceTypes: ['hls', 'dash', 'mp4'],
                    transformation: {
                        streaming_profile: 'hd',
                    },
                    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
                    autoplay: false,
                    muted: false,
                    qualitySelector: true,
                    hlsConfig: {
                        enableWorker: true
                    }
                });
            } catch (error) {
                console.error('Error initializing player:', error);
            }
        };

        void initPlayer();

        // Cleanup
        return () => {
            mounted = false;
            if (playerRef.current) {
                try {
                    playerRef.current.dispose();
                } catch (error) {
                    console.error('Error disposing player:', error);
                }
                playerRef.current = null;
            }
        };
    }, [video.public_id]);

    return (
        <div
            ref={containerRef}
            className="w-full rounded-xl overflow-hidden bg-black"
        />
    );
}
