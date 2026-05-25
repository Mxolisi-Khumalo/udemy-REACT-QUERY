import { useQueries } from "@tanstack/react-query";
import { fetchComments } from "./api";
import "./PostDetail.css";
import { useQuery } from "@tanstack/react-query";

export function PostDetail({ post, deleteMutation, updateMutation }) {  // add the delete mutation as a prop
  // replace with useQuery
  const {data, isLoading, isError, error} = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
  });

  if (isLoading){
    return <h3>Loading...!</h3>
  }

  if (isError){
    return (
      <>
        <h3>Error occured!</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button> {/*Run the deleteMutation when delete button is clicked*/}
        {deleteMutation.isPending && (
          <p className="loading">Deleting the post...</p>
        )}
        {deleteMutation.isError && (
          <p className="error">
            Error deleting the post: {deleteMutation.error.toString()}
          </p>
        )}
        {deleteMutation.isSuccess && (
          <p className="success">Post was deleted(not)</p>
        )}
      </div>
      <div>
        <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>
        {updateMutation.isPending && (<p className="loading">Updating post title...</p>)}
        {updateMutation.isError && (<p className="error">Error pudating title: {updateMutation.error.toString()}</p>)}
        {updateMutation.isSuccess && (<p className="success">Title was updated</p>)}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
