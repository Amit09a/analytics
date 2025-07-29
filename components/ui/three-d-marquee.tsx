"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const ThreeDMarquee = ({
  images,
  className,
}: {
  images: string[]
  className?: string
}) => {
  // Split the images array into 4 equal parts
  const chunkSize = Math.ceil(images.length / 4)
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize
    return images.slice(start, start + chunkSize)
  })

  return (
    <div className={cn("mx-auto block h-full w-full overflow-hidden", className)}>
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-75 sm:scale-90 lg:scale-100">
          <div
            style={{
              transform: "rotateX(45deg) rotateY(5deg) rotateZ(-35deg)",
            }}
            className="relative top-80 right-[45%] grid size-full origin-center grid-cols-4 gap-6 transform-3d"
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ y: colIndex % 2 === 0 ? [0, 150, 0] : [0, -150, 0] }}
                transition={{
                  duration: colIndex % 2 === 0 ? 12 : 18,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                key={colIndex + "marquee"}
                className="flex flex-col items-start gap-6"
              >
                <GridLineVertical className="-left-3" offset="60px" />
                {subarray.map((image, imageIndex) => (
                  <div className="relative" key={imageIndex + image}>
                    <GridLineHorizontal className="-top-3" offset="15px" />
                    <motion.div
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                      className="relative overflow-hidden rounded-xl shadow-2xl bg-white dark:bg-gray-900 p-8"
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`ADmyBRAND logo ${imageIndex + 1}`}
                        className="aspect-[4/3] w-full object-contain opacity-90 dark:opacity-80 transition-opacity duration-300 hover:opacity-100"
                        width={400}
                        height={300}
                      />
                      {/* Subtle overlay for better visibility */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string
  offset?: string
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.15)",
          "--height": "1px",
          "--width": "4px",
          "--fade-stop": "85%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.15)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-20",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  )
}

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string
  offset?: string
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.15)",
          "--height": "4px",
          "--width": "1px",
          "--fade-stop": "85%",
          "--offset": offset || "120px",
          "--color-dark": "rgba(255, 255, 255, 0.15)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-20",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  )
}
