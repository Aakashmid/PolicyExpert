
import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void; // must be stable (wrap it in useCallback)
  hasMore: boolean;
  isLoading: boolean;
}

export default function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: "200px" } // start loading 200px before the bottom is reached
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading]);

  return sentinelRef;
}