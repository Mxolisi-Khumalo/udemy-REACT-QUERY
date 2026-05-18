import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // replace with useQuery, destructuring the data property that is returned from the query function we pass to useQuery
  const {data} = useQuery({  // Takes an object of objetcs
    queryKey: ["posts"],    // Defines the data inside the query cache, always an array. Only defines the data after query function has returned, till then data is undefined
    queryFn: fetchPosts,    // The function that's going to run to fetch the data
  });

  if (!data) {
    return <div />
  }

  return (
    <>
      <ul>
        {data.map((post) => (
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
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
