import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery('sw-species', ({ pageParam = initialUrl }) => fetchUrl(pageParam), {
    getNextPageParam: (data) => data.next || undefined
  })

  if (isLoading) return null

  return (
    <InfiniteScroll hasMore={hasNextPage} loadMore={fetchNextPage}>

      {data.pages.map(pageData =>
        pageData.results.map(specie => (
          <Species
            name={specie.name}
            language={specie.language}
            averageLifespan={specie.averageLifespan}
          />
        ))
      )}

    </InfiniteScroll>
  )
}
