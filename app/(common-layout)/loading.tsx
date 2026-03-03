export default function Loading() {
  return (
    <div className="max-w-7xl space-y-4 mx-auto animate-pulse">
      {/* Skeleton de Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-muted/50 border border-border/50"
          />
        ))}
      </div>

      {/* Skeleton de la Tabla/Lista */}
      <div className="space-y-3">
        <div className="h-10 w-48 bg-muted/50 rounded-lg" />
        <div className="h-[400px] w-full rounded-xl bg-muted/30 border border-border/50" />
      </div>
    </div>
  )
}
