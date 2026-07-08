import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { LivFeedResponse } from "@shared/liv";

export function useLivFeed(livSlug: string | null | undefined) {
  return useQuery({
    queryKey: ["liv-feed", livSlug],
    queryFn: () =>
      apiGet<LivFeedResponse>(
        `/api/liv-feed.php?slug=${encodeURIComponent(livSlug!)}`,
      ),
    enabled: !!livSlug,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
