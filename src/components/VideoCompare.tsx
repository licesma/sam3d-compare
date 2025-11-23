import { useEffect, useMemo, useState } from "react";

interface VideoCompareProps {
  label: "correct" | "objects" | "position";
}

export default function VideoCompare({ label }: VideoCompareProps) {
  const [keys, setKeys] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const toBaseUrl = (path: string) => {
    const base = import.meta.env.BASE_URL ?? "/";
    const normalizedBase = base.endsWith("/") ? base : `${base}/`;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
    return `${normalizedBase}${normalizedPath}`;
  };

  const jsonFileName = useMemo(() => {
    if (label === "objects") return "object.json";
    return `${label}.json`;
  }, [label]);

  const basePath = useMemo(() => toBaseUrl(`${label}/`), [label]);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError(null);

    fetch(toBaseUrl(jsonFileName), { cache: "no-cache" })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load ${jsonFileName} (${res.status})`);
        }
        const data = await res.json();
        const parsed: string[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.keys)
          ? data.keys
          : Array.isArray(data?.position)
          ? data.position
          : [];
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error("No keys found in JSON");
        }
        if (isActive) {
          setKeys(parsed);
          setLoading(false);
        }
      })
      .catch((e: unknown) => {
        if (isActive) {
          setError(e instanceof Error ? e.message : "Unknown error");
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [jsonFileName]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {keys.map((k) => {
        const originalSrc = `${basePath}${k}.mp4`;
        const sam3dSrc = `${basePath}${k}.gif`;
        return (
          <div key={k} className="space-y-2">
            <div className="font-semibold">{k}</div>
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Original
                </div>
                <video
                  src={originalSrc}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full max-h-[360px] bg-black"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  SAM3D
                </div>
                <img
                  src={sam3dSrc}
                  alt={`${k} SAM3D`}
                  className="w-full max-h-[360px] bg-black object-contain"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
