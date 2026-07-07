import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string          // 当前图片数据（Base64 或 URL）
  onChange: (base64: string) => void
  defaultPlaceholder?: string
  className?: string
}

export default function ImageUpload({
  value,
  onChange,
  defaultPlaceholder = '点击或拖拽上传图片',
  className,
}: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(file: File) {
    // 限制文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }
    // 限制大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      onChange(base64)
      setPreviewError(false)
    }
    reader.onerror = () => {
      alert('图片读取失败')
    }
    reader.readAsDataURL(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // 清空 input，允许重复选同一个文件
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleRemove() {
    onChange('')
    setPreviewError(false)
  }

  const hasImage = value && !previewError

  return (
    <div className={cn('space-y-2', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg transition-colors',
          'flex flex-col items-center justify-center',
          hasImage ? 'p-2' : 'p-6',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-muted-foreground/30',
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {hasImage ? (
          <div className="relative w-full">
            <img
              src={value}
              alt="预览"
              className="max-h-48 w-auto mx-auto rounded object-contain"
              onError={() => setPreviewError(true)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-7 w-7 bg-background/80 hover:bg-background"
              onClick={handleRemove}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="size-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              {defaultPlaceholder}
            </p>
          </>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          {hasImage ? '重新上传' : '选择图片'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        {hasImage && (
          <Button variant="ghost" size="sm" type="button" onClick={handleRemove}>
            移除
          </Button>
        )}
      </div>
    </div>
  )
}