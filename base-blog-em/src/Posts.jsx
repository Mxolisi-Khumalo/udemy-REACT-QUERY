import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({  // Create the deleteMutation hook using the useMutation 
    mutationFn: (postId) => deletePost(postId), // pass the deletePost funciton as the mutation function to execute
  });

  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId),
  });

  useEffect(() => { // The use effect hook detects when there is a change in a specific element and executes
    if (currentPage < maxPostPage){
      const nextPage = currentPage + 1; // we are prefetching data for the next page when we get to the new one
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],  // the query key must have a similar structure so we can check if the data is in cache or not
        queryFn: () => fetchPosts(nextPage),  // fecth posts data for the
      });
    }
  }, [currentPage, queryClient]);   // There are the elements who's change triggers the useEffect

  // destructuring the data property that is returned from the query function we pass to useQuery
  const {data, isError, error, isLoading} = useQuery({  // Takes an object of objetcs
    queryKey: ["posts", currentPage],    // Defines the data inside the query cache, always an array. Only defines the data after query function has returned, till then data is undefined
    queryFn: () => fetchPosts(currentPage),    // The function that's going to run to fetch the data
    staleTime: 2000,        // specifying the stale time for the data ["posts"] that is fected, 2000ms => 2 seconds
  });

  if (isLoading){
    return <h3>Loading...</h3>
  }

  if (isError){
    return (
      <> 
        <h3>Oops, something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => {
              deleteMutation.reset();
              updateMutation.reset();
              setSelectedPost(post);
            }}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage<=1} onClick={() => {
          setCurrentPage((previousValue) => previousValue - 1);}}>Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage} onClick={() => {
          setCurrentPage(previousValue => previousValue + 1)}}> Next page
        </button>
      </div>
      <hr />
      {/* Pass the deleteMutation hook to the PostDetail component as that is where it is gonna be executed */}
      {selectedPost && <PostDetail post={selectedPost} deleteMutation={deleteMutation} updateMutation={updateMutation} />} 
    </>
  );
}
