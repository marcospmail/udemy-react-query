import { useQuery, useMutation } from "react-query";

/* eslint-disable no-unused-vars */
async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isError, error, isFetching } = useQuery(`post/${post.id}`, () => fetchComments(post.id), { staleTime: 5000 })

  const deleteMutation = useMutation((postId) => deletePost(postId))
  const updateMutation = useMutation((postId) => updatePost(postId))

  if (isFetching) return <h3>Loading...</h3>

  if (isError) return <><span>Ops, something went wrong, {error}</span></>

  return (
    <>
      <h3 style={{ color: "blue" }}>{data.title}</h3>
      <button onClick={() => {
        deleteMutation.mutate(post.id)

        setTimeout(() => {
          deleteMutation.reset()
        }, [3000])

      }}>Delete</button>

      <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>

      {updateMutation.isError && (
        <p style={{ color: 'red' }}>Error updating the post</p>
      )}

      {updateMutation.isLoading && (
        <p style={{ color: 'blue' }}>Loading</p>
      )}

      {updateMutation.isSuccess && (
        <p style={{ color: 'green' }}>Updated successfully</p>
      )}

      {deleteMutation.isError && (
        <p style={{ color: 'red' }}>Error deleting the post</p>
      )}

      {deleteMutation.isLoading && (
        <p style={{ color: 'blue' }}>Loading</p>
      )}

      {deleteMutation.isSuccess && (
        <p style={{ color: 'green' }}>Success</p>
      )}

      <p>{data.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
