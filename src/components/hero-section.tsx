'use client'

import * as React from "react"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import Hls from 'hls.js'
import { cn, getImageUrl } from '@/lib/utils'

interface Action {
  text: string
  href: string
  variant: 'default' | 'outline'
}

interface Media {
  url: string
  type: 'image' | 'video'
  thumbnail?: string
  duration?: number // 视频时长（秒）
  alt?: string
  width?: number
  height?: number
  caption?: string
}

interface HeroSectionProps {
  title: string
  description: string
  badge?: {
    text: string
    action?: {
      text: string
      href: string
    }
  }
  actions?: Action[]
  media?: Media | Media[] // 支持单个媒体或媒体数组
}

interface VideoPlayerProps {
  src: string
  autoPlay?: boolean
  controls?: boolean
  className?: string
  onMetadata?: (isShort: boolean) => void
}

function VideoPlayer({ src, autoPlay = false, controls = false, className = '', onMetadata }: VideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isHls, setIsHls] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isShortVideo, setIsShortVideo] = React.useState(false)

  const handleVideoMetadata = React.useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const isShort = video.duration <= 10
    setIsShortVideo(isShort)
    
    if (isShort) {
      video.loop = true
      video.muted = true
      video.play().catch(error => {
        console.error('Failed to autoplay short video:', error)
      })
    }

    if (onMetadata) {
      onMetadata(isShort)
    }
  }, [onMetadata])

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current
    const isHlsSource = src.endsWith('.ts') || src.endsWith('.m3u8')

    setError(null)
    setIsShortVideo(false)

    try {
      if (isHlsSource && Hls.isSupported()) {
        setIsHls(true)
        const hls = new Hls({
          debug: false,
          enableWorker: false,
          manifestLoadingTimeOut: 20000,
          manifestLoadingMaxRetry: 3,
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError()
                break
              default:
                hls.destroy()
                setError('Failed to load video')
                break
            }
          }
        })

        hls.loadSource(src)
        hls.attachMedia(video)

        return () => {
          hls.destroy()
        }
      } else {
        video.src = src
        video.load()
      }

      const events = ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough']
      events.forEach(event => {
        video.addEventListener(event, handleVideoMetadata)
      })
      
      return () => {
        events.forEach(event => {
          video.removeEventListener(event, handleVideoMetadata)
        })
      }
    } catch (err) {
      console.error('Video player error:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize video player')
    }
  }, [src, handleVideoMetadata])

  return (
    <>
      <video
        ref={videoRef}
        className={cn(className, "relative")}
        controls={controls}
        playsInline
        muted={isShortVideo || autoPlay}
        loop={isShortVideo}
        autoPlay={isShortVideo || autoPlay}
        onLoadedMetadata={handleVideoMetadata}
        onError={(e) => {
          console.error('Video error:', e)
          setError('Failed to play video')
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center p-4">
            <p className="text-red-400">Error: {error}</p>
            <p className="text-sm mt-2">Please try refreshing the page</p>
          </div>
        </div>
      )}
    </>
  )
}

export function HeroSection({
  title,
  description,
  badge,
  actions = [],
  media
}: HeroSectionProps) {
  const [isVideoOpen, setIsVideoOpen] = React.useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0)
  const mediaArray = Array.isArray(media) ? media : media ? [media] : []
  const [currentVideoIsShort, setCurrentVideoIsShort] = React.useState(false)

  // 检查当前媒体是否为短视频
  useEffect(() => {
    if (!mediaArray[currentMediaIndex]) return
    
    const currentMedia = mediaArray[currentMediaIndex]
    if (currentMedia.type === 'video') {
      const duration = currentMedia.duration
      
      if (typeof duration === 'number' && !isNaN(duration)) {
        const isShort = duration <= 10
        setCurrentVideoIsShort(isShort)
      } else {
        setCurrentVideoIsShort(false)
      }
    }
  }, [currentMediaIndex, mediaArray])

  // 自动轮播
  useEffect(() => {
    if (mediaArray.length <= 1) return

    const interval = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % mediaArray.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [mediaArray.length])

  const handleVideoMetadata = (isShort: boolean) => {
    setCurrentVideoIsShort(isShort)
  }

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaArray.length)
  }

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + mediaArray.length) % mediaArray.length)
  }

  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-gray-900">
      {/* 背景装饰 */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-center lg:justify-between py-12 sm:py-20 lg:py-32 gap-8 lg:gap-12">
          {/* 内容区域 */}
          <div className="w-full max-w-2xl lg:max-w-xl">
            {badge && (
              <div className="inline-block">
                <div className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-sm font-medium text-blue-600 ring-1 ring-inset ring-blue-500 dark:text-blue-400 dark:ring-blue-400">
                  {badge.text}
                  {badge.action && (
                    <Link href={badge.action.href} className="ml-2 text-blue-500 hover:text-blue-400">
                      {badge.action.text}
                    </Link>
                  )}
                </div>
              </div>
            )}
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              {description}
            </p>
            {actions.length > 0 && (
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    asChild
                  >
                    <Link href={action.href}>{action.text}</Link>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* 媒体区域 */}
          {mediaArray.length > 0 && (
            <div className="w-full lg:w-[60%]">
              <div className="relative aspect-[16/9] w-full rounded-xl shadow-2xl ring-1 ring-gray-900/10 overflow-hidden bg-gray-100 dark:bg-gray-800">
                {mediaArray[currentMediaIndex].type === 'video' ? (
                  <>
                    <div 
                      className={cn(
                        "absolute inset-0",
                        !currentVideoIsShort && "cursor-pointer group"
                      )}
                      onClick={() => {
                        if (!currentVideoIsShort) {
                          setIsVideoOpen(true)
                        }
                      }}
                    >
                      {currentVideoIsShort ? (
                        // 短视频直接在页面上播放
                        <VideoPlayer
                          src={mediaArray[currentMediaIndex].url}
                          className="w-full h-full object-cover"
                          autoPlay={true}
                          onMetadata={(isShort) => {
                            // 只在没有后端时长信息时使用前端检测的结果
                            const currentMedia = mediaArray[currentMediaIndex]
                            if (currentMedia.type === 'video') {
                              const duration = currentMedia.duration
                              if (typeof duration !== 'number' || isNaN(duration)) {
                                console.log('Using frontend video length detection:', isShort)
                                setCurrentVideoIsShort(isShort)
                              } else {
                                console.log('Skipping frontend detection, using backend duration:', duration)
                              }
                            }
                          }}
                        />
                      ) : (
                        // 长视频显示缩略图或第一帧
                        <>
                          {mediaArray[currentMediaIndex].thumbnail ? (
                            <Image
                              src={mediaArray[currentMediaIndex].thumbnail}
                              alt={title}
                              fill
                              priority
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                              className="object-cover"
                            />
                          ) : (
                            <VideoPlayer
                              src={mediaArray[currentMediaIndex].url}
                              className="w-full h-full object-cover"
                              autoPlay={false}
                              onMetadata={handleVideoMetadata}
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                              <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {!currentVideoIsShort && (
                      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                        <DialogContent className="max-w-6xl p-0 overflow-hidden bg-black">
                          <VideoPlayer
                            src={mediaArray[currentMediaIndex].url}
                            controls
                            autoPlay={true}
                            className="w-full h-full"
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </>
                ) : (
                  <Image
                    src={getImageUrl(mediaArray[currentMediaIndex].url)}
                    alt={mediaArray[currentMediaIndex].alt || title}
                    width={mediaArray[currentMediaIndex].width || 1280}
                    height={mediaArray[currentMediaIndex].height || 720}
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
                    priority
                  />
                )}

                {/* 轮播控制按钮 */}
                {mediaArray.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        prevMedia()
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm rounded-full p-2 hover:bg-white/50 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        nextMedia()
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm rounded-full p-2 hover:bg-white/50 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                    {/* 轮播指示器 */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {mediaArray.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentMediaIndex(index)
                          }}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentMediaIndex
                              ? 'bg-white'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
      </div>
    </div>
  )
} 