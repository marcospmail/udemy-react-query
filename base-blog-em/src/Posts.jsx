import React, { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'

import { PostDetail } from './PostDetail'

const maxPostPage = 10

async function fetchPosts(page) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${page}`
  )
  return response.json()
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedPost, setSelectedPost] = useState(null)

  const queryClient = useQueryClient()

  useEffect(() => {
    console.log('caiu')

    if (currentPage >= maxPostPage) return

    console.log('e passou = ', currentPage)

    const nextPage = currentPage + 1
    queryClient.prefetchQuery(['posts', nextPage], () => fetchPosts(nextPage))

  }, [currentPage])


  const { data, isLoading, isError, error } = useQuery(['posts', currentPage], () => fetchPosts(currentPage), { staleTime: 2000, keepPreviousData: true })

  if (isLoading) return <h3>Loading...</h3>

  if (isError) return <><span>Ops, something went wrong, {error}</span></>

  return (
    <>
      <ul>
        {data.map(post => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(v => v - 1)}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage === maxPostPage}
          onClick={() => setCurrentPage(v => v + 1)}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  )
}
