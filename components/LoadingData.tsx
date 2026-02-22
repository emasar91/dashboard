import { Spinner } from "./ui/spinner"

type Props = {
  title: string
  className?: string
}

function LoadingData({ title, className }: Props) {
  return (
    <div
      className={`flex h-full flex-col rounded-xl border border-border bg-card p-4 lg:p-5 items-center justify-center ${className}`}
    >
      <Spinner className="size-12 text-primary" />
      <p className="text-center text-xs text-muted-foreground py-4">{title}</p>
    </div>
  )
}

export default LoadingData
