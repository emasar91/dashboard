"use client"
import dynamic from "next/dynamic"

const NoSSRWrapper = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

export const NoSSR = dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
})
