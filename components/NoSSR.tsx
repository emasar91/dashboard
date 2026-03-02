"use client"
import dynamic from "next/dynamic"
import { Spinner } from "./ui/spinner"

const NoSSRWrapper = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

const LoadingSpinner = () => (
  <div className="w-full h-full bg-card rounded-xl border border-border flex flex-col p-6 justify-center items-center">
    <Spinner className="w-12 h-12 text-primary" />
  </div>
)

export const NoSSR = dynamic(() => Promise.resolve(NoSSRWrapper), {
  loading: LoadingSpinner,
  ssr: false,
})
