import { useEffect, useState } from "react";

/** Buffer short scrub films so Safari can seek without HTTP range support. */
export default function useLocalVideoSource(assetUrl) {
  const [source, setSource] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    let objectUrl;
    let disposed = false;
    const load = async () => {
      try {
        const response = await fetch(assetUrl, {
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Video request: ${response.status}`);
        const blob = await response.blob();
        if (
          !blob.size ||
          (blob.type &&
            !blob.type.startsWith("video/") &&
            blob.type !== "application/octet-stream")
        ) {
          throw new Error("The video response did not contain media.");
        }
        if (disposed) return;
        objectUrl = URL.createObjectURL(
          blob.type === "video/mp4"
            ? blob
            : new Blob([blob], { type: "video/mp4" }),
        );
        setSource(objectUrl);
      } catch (error) {
        if (!disposed && error.name !== "AbortError") {
          // A direct source still lets browsers with range tolerance recover.
          setSource(assetUrl);
        }
      }
    };
    load();
    return () => {
      disposed = true;
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [assetUrl]);
  return source;
}
