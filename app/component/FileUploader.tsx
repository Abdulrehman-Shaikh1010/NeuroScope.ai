"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

interface FileUploaderProps {
  onDrop: (files: File[]) => void
  accept: string // should be something like "image/*" or "image/png,image/jpeg"
  label?: string
  className?: string
  onDragStateChange?: (dragging: boolean) => void
}

const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(" ")

export const FileUploader: React.FC<FileUploaderProps> = ({
  onDrop,
  accept,
  label = "Upload File",
  className,
  onDragStateChange,
}) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles)
      if (onDragStateChange) onDragStateChange(false)
    },
    [onDrop, onDragStateChange]
  )

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: handleDrop,
    accept: accept, // Pass directly as string, e.g., "image/*"
    onDragEnter: () => onDragStateChange?.(true),
    onDragLeave: () => onDragStateChange?.(false),
    onDropAccepted: () => onDragStateChange?.(false),
    onDropRejected: () => onDragStateChange?.(false),
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-cyan-400 rounded-xl p-6 text-center cursor-pointer hover:bg-cyan-950/10 bg-black text-white transition-colors duration-300",
        className
      )}
      aria-label={`${label} area. Drag and drop files or click to select.`}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          ;(getInputProps() as any).onClick?.(e)
        }
      }}
    >
      <input {...getInputProps()} aria-hidden="true" title={`${label} input`} />
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{label}</h3>
        {isDragActive ? (
          <p
            className={cn("text-cyan-400", {
              "text-green-400": isDragAccept,
              "text-red-400": isDragReject,
            })}
          >
            {isDragAccept
              ? "Drop the files here..."
              : isDragReject
              ? "Unsupported file type, please try again..."
              : "Drop the files here..."}
          </p>
        ) : (
          <p className="text-gray-400">Drag & drop a file here, or click to select one</p>
        )}
      </div>
    </div>
  )
}

export default FileUploader
