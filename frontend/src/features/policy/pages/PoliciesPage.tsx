// src/features/policy/pages/PoliciesPage.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/layouts/PageHeader";
import Card from "@/components/ui/Card";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import PolicyTable from "../components/PolicyTable";
import { deletePolicy, getPolicies } from "../policy.api";
import type { Policy } from "../policy.types";

const PAGE_SIZE = 10;

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const nextPage = useRef(1);
  const isFetching = useRef(false); // blocks duplicate requests while one is running

  const loadMore = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setIsLoading(true);
    setError("");

    try {
      // Only ready policies are shown here. The rest belong to the Processing Queue page.
      const data = await getPolicies({
        page: nextPage.current,
        page_size: PAGE_SIZE,
        status: "ready",
      });

      // Skip items already in the list (protects against duplicates)
      setPolicies((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...data.results.filter((p) => !ids.has(p.id))];
      });
      setHasMore(data.next !== null);
      nextPage.current += 1;
    } catch {
      setError("Failed to load policies");
    } finally {
      isFetching.current = false;
      setIsLoading(false);
    }
  }, []);

  // First page
  useEffect(() => {
    loadMore();
  }, [loadMore]);

  // Next pages: loads when the sentinel below the table scrolls into view
  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: hasMore && !error, // stop auto-retrying after an error
    isLoading,
  });

  const handleDelete = async (policy: Policy) => {
    // TODO: replace window.confirm with a proper confirm modal
    if (!window.confirm(`Delete "${policy.name}"?`)) return;

    try {
      await deletePolicy(policy.id);
      setPolicies((prev) => prev.filter((p) => p.id !== policy.id));
    } catch {
      setError("Failed to delete policy");
    }
  };

  const isInitialLoad = isLoading && policies.length === 0;

  return (
    <div>
      <PageHeader
        title="Policies"
        subtitle="Policies that are ready for employees to ask about"
        action={
          <Link
            to="/admin/upload"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-inverse transition-colors hover:bg-primary-hover"
          >
            Upload New Policy
          </Link>
        }
      />

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
          <button onClick={loadMore} className="font-medium underline">
            Try again
          </button>
        </div>
      )}

      <Card className="p-0">
        {isInitialLoad ? (
          <p className="p-8 text-center text-sm text-muted">
            Loading policies...
          </p>
        ) : policies.length === 0 && !isLoading && !error ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <p className="text-sm text-muted">No ready policies yet</p>
            <Link
              to="/admin/queue"
              className="text-sm text-primary hover:underline"
            >
              Check the processing queue
            </Link>
          </div>
        ) : (
          <>
            <PolicyTable policies={policies} onDelete={handleDelete} />

            {/* Sentinel: when this comes into view, the next page loads */}
            <div
              ref={sentinelRef}
              className="p-4 text-center text-sm text-muted"
            >
              {isLoading && "Loading more..."}
              {!hasMore && policies.length > 0 && "You've reached the end"}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
