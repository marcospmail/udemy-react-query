import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const { data, fetchNextPage, isLoading, isFetching, hasNextPage } = useInfiniteQuery('sw-query', ({ pageParam = initialUrl }) => fetchUrl(pageParam), {
    getNextPageParam: (data) => data.next || undefined
  })

  return (
    <>
      {(isFetching) && <span style={{ position: 'fixed', top: 0, right: 0 }}>Loading</span>}


      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data && data.pages.map(pageData => {
          return pageData.results.map(person => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            )
          })
        })}

      </InfiniteScroll>
    </>
  )
}
