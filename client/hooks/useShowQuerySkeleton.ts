import type { UseQueryResult } from "@tanstack/react-query";

/** True until the query resolves for the first time — use for skeleton placeholders. */
export function useShowQuerySkeleton<T, E>(
  query: Pick<UseQueryResult<T, E>, "isPending">,
): boolean {
  return query.isPending;
}
