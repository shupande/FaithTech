import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, access, constants } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'

// 配置 Next.js API 路由
export const config = {
  runtime: 'nodejs', // 使用 Node.js runtime
  api: {
    bodyParser: false, // 禁用默认的 body parser
    responseLimit: false, // 禁用响应大小限制
    maxDuration: 60, // 设置最大执行时间为 60 秒
  },
}

// 确保所有响应都是 JSON 格式
function jsonResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

// 配置
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// 验证上传目录
async function validateUploadDirectory(uploadDir: string) {
  try {
    if (!existsSync(uploadDir)) {
      console.log('Creating upload directory:', uploadDir)
      await mkdir(uploadDir, { recursive: true })
    }
    await access(uploadDir, constants.R_OK | constants.W_OK)
    console.log('Upload directory validated successfully')
    return true
  } catch (error) {
    console.error('Upload directory error:', error)
    return false
  }
}

// 延迟加载 FFmpeg
async function loadFFmpeg() {
  try {
    console.log('Starting FFmpeg load...')
    
    // 使用 dynamic import 导入模块
    const ffmpeg = await import('fluent-ffmpeg')
    const ffmpegInstaller = await import('@ffmpeg-installer/ffmpeg')
    
    const ffmpegPath = ffmpegInstaller.default.path
    console.log('FFmpeg path:', ffmpegPath)

    // 设置 FFmpeg 路径
    ffmpeg.default.setFfmpegPath(ffmpegPath)

    // 设置 FFprobe 路径（Windows 系统需要）
    const ffprobePath = ffmpegPath.replace('ffmpeg.exe', 'ffprobe.exe')
    console.log('FFprobe path:', ffprobePath)
    ffmpeg.default.setFfprobePath(ffprobePath)
    
    return ffmpeg.default
  } catch (error) {
    console.error('Failed to load FFmpeg:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Stack trace:', error.stack)
    }
    return null
  }
}

// 获取视频时长
async function getVideoDuration(inputPath: string): Promise<number> {
  try {
    console.log('Loading FFmpeg for duration check...')
    const ffmpeg = await loadFFmpeg()
    if (!ffmpeg) {
      console.error('FFmpeg failed to load')
      return 0
    }

    return new Promise((resolve) => {
      console.log('Starting duration check for:', inputPath)
      
      try {
        const command = ffmpeg(inputPath)
        command.ffprobe((err: any, metadata: any) => {
          if (err) {
            console.error('FFprobe error:', err)
            resolve(0)
            return
          }
          
          console.log('Raw video metadata:', JSON.stringify(metadata, null, 2))
          
          // 尝试从不同位置获取时长
          let duration = 0
          if (metadata?.format?.duration) {
            duration = Number(metadata.format.duration)
            console.log('Duration from format:', duration)
          } else if (metadata?.streams?.[0]?.duration) {
            duration = Number(metadata.streams[0].duration)
            console.log('Duration from stream:', duration)
          }

          if (isNaN(duration)) {
            console.log('Invalid duration value, defaulting to 0')
            duration = 0
          }

          console.log('Final duration value:', duration)
          resolve(duration)
        })
      } catch (probeError) {
        console.error('FFprobe execution error:', probeError)
        if (probeError instanceof Error) {
          console.error('Error details:', probeError.message)
          console.error('Stack trace:', probeError.stack)
        }
        resolve(0)
      }
    })
  } catch (error) {
    console.error('Error in getVideoDuration:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Stack trace:', error.stack)
    }
    return 0
  }
}

// 视频格式转换函数
async function convertVideo(inputPath: string, outputPath: string): Promise<boolean> {
  try {
    const ffmpeg = await loadFFmpeg()
    if (!ffmpeg) {
      console.error('FFmpeg is not available')
      return false
    }

    return new Promise((resolve) => {
      try {
        console.log('Starting video conversion:', {
          input: inputPath,
          output: outputPath
        })

        const command = ffmpeg(inputPath)
          .outputOptions([
            '-c:v libx264',
            '-c:a aac',
            '-movflags +faststart',
            '-preset fast',
            '-crf 23'
          ])
          .toFormat('mp4')
          .on('start', (commandLine: string) => {
            console.log('FFmpeg command:', commandLine)
          })
          .on('progress', (progress: { percent: number }) => {
            console.log('Conversion progress:', progress.percent + '%')
          })
          .on('end', () => {
            console.log('Video conversion completed')
            resolve(true)
          })
          .on('error', (err: Error) => {
            console.error('Conversion error:', err)
            resolve(false)
          })

        command.save(outputPath)
      } catch (error) {
        console.error('Failed to initialize conversion:', error)
        resolve(false)
      }
    })
  } catch (error) {
    console.error('Conversion setup error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  console.log('Starting file upload process...')
  
  try {
    // 验证上传目录
    const uploadDir = join(process.cwd(), 'public/uploads')
    const isDirectoryValid = await validateUploadDirectory(uploadDir)
    
    if (!isDirectoryValid) {
      return jsonResponse({ error: 'Server configuration error: upload directory not accessible' }, 500)
    }

    // 解析表单数据
    const formData = await request.formData()
    console.log('Form data parsed successfully')

    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null
    const thumbnail = formData.get('thumbnail') as File | null

    if (!file || !type) {
      return jsonResponse({ error: 'Missing required fields' }, 400)
    }

    console.log('Received file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      uploadType: type
    })

    // 文件大小验证
    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse(
        { error: `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        400
      )
    }

    // 文件类型验证
    if (type === 'image' && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return jsonResponse(
        { error: 'Invalid image type. Allowed types: ' + ALLOWED_IMAGE_TYPES.join(', ') },
        400
      )
    }

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type) || file.name.endsWith('.ts')
    if (type === 'video' && !isVideo) {
      return jsonResponse(
        { error: 'Invalid video type. Allowed types: ' + ALLOWED_VIDEO_TYPES.join(', ') + ' or .ts files' },
        400
      )
    }

    // 生成唯一文件名
    const fileId = uuidv4()
    
    try {
      // 保存原始文件
      console.log('Saving original file...')
      const buffer = await file.arrayBuffer()
      const originalPath = join(uploadDir, `${fileId}-original${file.name.substring(file.name.lastIndexOf('.'))}`)
      await writeFile(originalPath, Buffer.from(buffer))
      console.log('Original file saved at:', originalPath)

      let finalVideoPath = originalPath
      let finalVideoUrl = `/uploads/${fileId}-original${file.name.substring(file.name.lastIndexOf('.'))}`
      let videoDuration = 0

      // 如果是视频，获取时长并进行转换
      if (type === 'video') {
        try {
          // 获取视频时长
          console.log('Starting video duration check for:', originalPath)
          videoDuration = await getVideoDuration(originalPath)
          console.log('Video duration result:', videoDuration)

          // 如果是 .ts 格式，尝试进行转换
          if (file.name.endsWith('.ts')) {
            const mp4Path = join(uploadDir, `${fileId}.mp4`)
            const conversionSuccess = await convertVideo(originalPath, mp4Path)
            
            if (conversionSuccess) {
              finalVideoPath = mp4Path
              finalVideoUrl = `/uploads/${fileId}.mp4`
              // 转换后重新获取时长
              console.log('Getting duration for converted video:', mp4Path)
              const newDuration = await getVideoDuration(mp4Path)
              console.log('Video duration after conversion:', newDuration)
              if (newDuration > 0) {
                videoDuration = newDuration
              }
            } else {
              console.log('Video conversion failed, using original file and duration')
            }
          }
        } catch (error) {
          console.error('Video processing error:', error)
          if (error instanceof Error) {
            console.error('Error details:', {
              message: error.message,
              stack: error.stack
            })
          }
        }
      }

      // 如果是视频且有缩略图，保存缩略图
      let thumbnailUrl = null
      if (type === 'video' && thumbnail) {
        try {
          console.log('Saving video thumbnail...')
          const thumbnailBuffer = await thumbnail.arrayBuffer()
          const thumbnailName = `${fileId}-thumb.jpg`
          const thumbnailPath = join(uploadDir, thumbnailName)
          await writeFile(thumbnailPath, Buffer.from(thumbnailBuffer))
          thumbnailUrl = `/uploads/${thumbnailName}`
          console.log('Thumbnail saved successfully')
        } catch (error) {
          console.error('Failed to save thumbnail:', error)
        }
      }

      // 返回文件URL和视频时长
      const response = {
        url: finalVideoUrl,
        type,
        thumbnail: thumbnailUrl,
        duration: type === 'video' && videoDuration > 0 ? videoDuration : undefined
      }
      console.log('Final response with duration:', response)
      return jsonResponse(response)
    } catch (error) {
      console.error('File processing error:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        })
      }
      return jsonResponse(
        { error: error instanceof Error ? error.message : 'Failed to process uploaded file' },
        500
      )
    }
  } catch (error) {
    console.error('Upload process failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      500
    )
  }
} 