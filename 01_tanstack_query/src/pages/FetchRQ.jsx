import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deletePost, fetchPosts, updatePost } from "../api/api";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export const FetchRQ = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", pageNumber], // act as useState
    queryFn: () => fetchPosts(pageNumber), // act as useEffect
    placeholderData: keepPreviousData, // It is used to show the previous data when the new data is fetching
    // staleTime: 10000, // stale time (by default 0 which means re fetch request send again and again)
    // gcTime: 10000, // garbage collection time (default 5 minutes)
    // refetchInterval: 2000, // re fetch interval (by default 0 which means re fetch request send again and again)
    // refetchIntervalInBackground: true, // re fetch interval in background (by default false)
    // refetchOnMount: true, // re fetch on mount (by default true)
    // refetchOnWindowFocus: true, // re fetch on window focus (by default true)
    // retry: 2, // retry (by default 3 times we can change the by using retry property)
    // enabled: false, // enabled (by default true) if set to false then query will not be executed
    // retryDelay: 1000, // retry delay (by default 1000ms) we can change the by using retryDelay property
    // networkMode: "offline", // network mode (by default "online") we can change the by using networkMode property
    // refetchOnReconnect: true, // re fetch on reconnect (by default true)
  });

  // mutation function to delete the post
  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(["posts", pageNumber], (curElem) => {
        return curElem?.filter((post) => post.id !== id);
      });
    },
  });

  // mutation function to update the post
  const updateMutation = useMutation({
    mutationFn: (id) => updatePost(id),
    onSuccess: (apiData, postId) => {
      console.log(apiData, postId);

      queryClient.setQueryData(["posts", pageNumber], (postsData) => {
        return postsData?.map((curPost) => {
          return curPost.id === postId
            ? { ...curPost, title: apiData.data.title }
            : curPost;
        });
      });
    },
  });

  // Conditional rendering based on loading, error, and posts data
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p> Error: {error.message || "Something went wrong!"}</p>;

  return (
    <div>
      <ul className="section-accordion">
        {data?.map((curElem) => {
          const { id, title, body } = curElem;
          return (
            <li key={id}>
              <NavLink to={`/rq/${id}`}>
                <p>{id}</p>
                <p>{title}</p>
                <p>{body}</p>
              </NavLink>
              <button onClick={() => deleteMutation.mutate(id)}>Delete</button>
              <button onClick={() => updateMutation.mutate(id)}>Update</button>
            </li>
          );
        })}
      </ul>

      <div className="pagination-section container">
        <button
          disabled={pageNumber === 0 ? true : false}
          onClick={() => setPageNumber((prev) => prev - 3)}
        >
          Prev
        </button>
        <p>{pageNumber / 3 + 1}</p>
        <button onClick={() => setPageNumber((prev) => prev + 3)}>Next</button>
      </div>
    </div>
  );
};
