# 🚀 The Complete Guide to TanStack — Beginner to Advanced

> A deep, chapter-wise reference for mastering **TanStack Query** and **TanStack Table** in React. Every concept ships with a definition, a "why it matters" note, and copy-pasteable code.

![TanStack](https://img.shields.io/badge/TanStack-Query%20%26%20Table-FF4154?style=for-the-badge)
![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)

---

<a id="table-of-contents"></a>

## 📑 Table of Contents

### Part I — TanStack Query

| #   | Chapter                                                                                                           | Key Concepts                                                                      |
| --- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 0   | [Introduction & Setup](#chapter-0--introduction--setup)                                                           | What is TanStack Query, Installation, `QueryClient`, `QueryClientProvider`        |
| 1   | [Traditional Fetching vs React Query](#chapter-1--traditional-fetching-vs-react-query)                            | `useEffect`/`useState` approach vs `useQuery` — why Query wins                    |
| 2   | [Fetching Data with `useQuery`](#chapter-2--fetching-data-with-usequery)                                          | `queryKey`, `queryFn`, status flags (`isPending`, `isError`)                      |
| 3   | [Loading, Error States & DevTools](#chapter-3--loading-error-states--devtools)                                    | Conditional rendering, React Query DevTools                                       |
| 4   | [Caching — Garbage Collection, Stale Time & Polling](#chapter-4--caching--garbage-collection-stale-time--polling) | `gcTime`, `staleTime`, `refetchInterval`, config reference table                  |
| 5   | [Query Keys in Depth](#chapter-5--query-keys-in-depth)                                                            | Dynamic keys, per-post keys, key rules                                            |
| 6   | [Pagination with TanStack Query](#chapter-6--pagination-with-tanstack-query)                                      | `pageNumber` state, `keepPreviousData`, paginated query key                       |
| 7   | [Mutations — Delete & Update](#chapter-7--mutations--delete--update)                                              | `useMutation`, `mutationFn`, `onSuccess`, manual cache update with `setQueryData` |
| 8   | [Infinite Scrolling](#chapter-8--infinite-scrolling)                                                              | `useInfiniteQuery`, `getNextPageParam`, `react-intersection-observer`             |
| 9   | [Optimistic Updates](#chapter-9--optimistic-updates)                                                              | `onMutate`, rollback, cache surgery                                               |
| 10  | [Dependent & Parallel Queries](#chapter-10--dependent--parallel-queries)                                          | `enabled`, `useQueries`                                                           |
| 11  | [Prefetching & SSR](#chapter-11--prefetching--ssr)                                                                | `prefetchQuery`, hydration                                                        |
| 12  | [Query Patterns & Architecture](#chapter-12--query-patterns--architecture)                                        | Custom hooks, key factories                                                       |

### Part II — TanStack Table

| #   | Chapter                                                            | Key Concepts                                    |
| --- | ------------------------------------------------------------------ | ----------------------------------------------- |
| 13  | [Table Basics](#chapter-13--table-basics)                          | Headless concept, `useReactTable`, `flexRender` |
| 14  | [Column Definitions](#chapter-14--column-definitions)              | Accessors, `createColumnHelper`, custom cells   |
| 15  | [Sorting](#chapter-15--sorting)                                    | Sort state, multi-sort, custom sort fns         |
| 16  | [Filtering](#chapter-16--filtering)                                | Column filters, global filter, fuzzy search     |
| 17  | [Pagination](#chapter-17--pagination)                              | Client & manual pagination                      |
| 18  | [Row Selection & Expansion](#chapter-18--row-selection--expansion) | Checkboxes, sub-rows                            |
| 19  | [Column Features](#chapter-19--column-features)                    | Visibility, ordering, pinning, resizing         |
| 20  | [Query + Table Together](#chapter-20--query--table-together)       | Server-side data table                          |

### Part III — Reference

| #   | Chapter                                                                  | Key Concepts                     |
| --- | ------------------------------------------------------------------------ | -------------------------------- |
| 21  | [Best Practices & Cheat Sheet](#chapter-21--best-practices--cheat-sheet) | Pitfalls, performance, structure |

---

# Part I — TanStack Query

---

## Chapter 0 — Introduction & Setup

[⬆ Back to Menu](#table-of-contents)

### What is TanStack Query?

**TanStack Query** (formerly React Query) is an **asynchronous state manager**. It is _not_ a data-fetching library — you still use `fetch` or `axios`. Instead, it manages the **server state**: caching, background refetching, deduping, and synchronization.

> **Server state vs. Client state**
>
> - **Client state**: owned by your app (e.g. a modal's open/closed, form input). Use `useState`/`zustand`.
> - **Server state**: lives on a remote server, you only borrow a snapshot (e.g. a list of posts). Use TanStack Query.

### Why use it?

| Without Query                                    | With Query                          |
| ------------------------------------------------ | ----------------------------------- |
| Manual `useState` for `data`, `loading`, `error` | All three handled automatically     |
| `useEffect` fetch waterfalls                     | Declarative, deduped requests       |
| No caching — refetch on every mount              | Smart cache with background updates |
| Manual refetch logic                             | `invalidateQueries`                 |

### Installation


```bash
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
npm install axios
```

The project uses **axios** for HTTP requests and **react-router-dom** for routing.

### Setting up QueryClient & QueryClientProvider

The `QueryClient` is the central object that holds the cache, manages background refetching, and handles data synchronization. The `QueryClientProvider` makes it available to your entire component tree via React context.

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

- `QueryClient` → creates a new client instance that holds the cache and config
- `QueryClientProvider` → wraps the app so every child component can access the client
- `ReactQueryDevtools` → dev-only panel that shows all queries, their status, cached data, and refetch timing

### Project Structure

```
tanstack-query/src/
├── api/
│   └── api.jsx              # All fetch functions (axios)
├── components/
│   ├── Layouts/
│   │   ├── Header.jsx       # Navigation bar
│   │   ├── Footer.jsx
│   │   └── MainLayout.jsx   # Layout with <Outlet />
│   └── UI/
│       └── FetchIndv.jsx    # Individual post detail
├── pages/
│   ├── Home.jsx
│   ├── FetchOld.jsx         # Traditional fetch (no Query)
│   ├── FetchRQ.jsx          # React Query fetch + pagination + mutations
│   └── InfiniteScroll.jsx   # Infinite scrolling with useInfiniteQuery
├── App.jsx                  # Routes + QueryClientProvider
└── main.jsx                 # Entry point
```

---

## Chapter 1 — Traditional Fetching vs React Query

[⬆ Back to Menu](#table-of-contents)

### The Old Way: `useEffect` + `useState`

This is how you fetch data **without** TanStack Query — manually managing loading, error, and data state.


```jsx
import axios from "axios";
import { useEffect, useState } from "react";

export const FetchOld = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getPostsData = async () => {
    try {
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/posts?_start=0&_limit=5",
      );
      if (res.status === 200) {
        setPosts(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await getPostsData();
    })();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;

  return (
    <ul className="section-accordion">
      {posts?.map((curElem) => {
        const { id, title, body } = curElem;
        return (
          <li key={id}>
            <p>{title}</p>
            <p>{body}</p>
          </li>
        );
      })}
    </ul>
  );
};
```

**Problems with this approach:**

- 3 separate `useState` calls just to track loading, error, and data
- Manual `useEffect` to trigger the fetch
- No caching — navigating away and back refetches everything
- No background refetch, no deduplication, no retry logic

### The New Way: TanStack Query

The same functionality, but the loading/error/data management is handled automatically by `useQuery`.


```jsx
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/api";

export const FetchRQ = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", 0],
    queryFn: () => fetchPosts(0),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message || "Something went wrong!"}</p>;

  return (
    <ul className="section-accordion">
      {data?.map((curElem) => {
        const { id, title, body } = curElem;
        return (
          <li key={id}>
            <p>{title}</p>
            <p>{body}</p>
          </li>
        );
      })}
    </ul>
  );
};
```

| Old Way (`FetchOld`)                | New Way (`FetchRQ`)                 |
| ----------------------------------- | ----------------------------------- |
| 3 `useState` for data/loading/error | All returned from `useQuery`        |
| Manual `useEffect`                  | `queryFn` runs automatically        |
| No caching                          | Built-in cache + background refetch |
| No retry                            | Auto retry (3 times by default)     |
| ~30 lines of boilerplate            | ~5 lines of config                  |

---

## Chapter 2 — Fetching Data with `useQuery`

[⬆ Back to Menu](#table-of-contents)

### The API Layer

All fetch functions are centralized in a single API file using **axios**. This keeps data-fetching logic separate from UI components.


```jsx
import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export const fetchPosts = async (pageNumber) => {
  try {
    const res = await api.get(`/posts?_start=${pageNumber}&_limit=5`);
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log(error);
  }
};

export const fetchInvPost = async (id) => {
  try {
    const res = await api.get(`/posts/${id}`);
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log(error);
  }
};
```

Key points:

- `axios.create({ baseURL })` avoids repeating the base URL in every request
- Each function returns a **promise** — this is what `queryFn` expects

### The `useQuery` Hook

`useQuery` takes a configuration object with two required properties:

| Property   | Purpose                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `queryKey` | A unique array that identifies this query in the cache (think of it like `useState`'s identity) |
| `queryFn`  | An async function that fetches the data (think of it like `useEffect`'s callback)               |


```jsx
const { data, isPending, isError, error } = useQuery({
  queryKey: ["posts", pageNumber],
  queryFn: () => fetchPosts(pageNumber),
});
```

The hook returns an object with everything you need:

| Returned Value | Type               | Meaning                                                               |
| -------------- | ------------------ | --------------------------------------------------------------------- |
| `data`         | `any \| undefined` | The resolved data from `queryFn`                                      |
| `isPending`    | `boolean`          | `true` while there is no cached data yet (first load)                 |
| `isError`      | `boolean`          | `true` if `queryFn` threw an error                                    |
| `error`        | `Error \| null`    | The thrown error object                                               |
| `isFetching`   | `boolean`          | `true` ANY time a request is in flight (including background refetch) |
| `isSuccess`    | `boolean`          | `true` when data is available                                         |
| `refetch`      | `function`         | Manually trigger a refetch                                            |

> ⚠️ **`isPending` vs `isFetching`**: When you have cached data and Query is refetching in the background, `isPending` is `false` (data exists) but `isFetching` is `true` (request is running).

### Fetching Individual Items


```jsx
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchInvPost } from "../../api/api";

export const FetchIndv = () => {
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchInvPost(id),
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message || "Something went wrong!"}</p>;

  return (
    <div className="section-accordion">
      <h1>Post ID Number - {id}</h1>
      <div>
        <p>ID: {data.id}</p>
        <p>Title: {data.title}</p>
        <p>Body: {data.body}</p>
      </div>
    </div>
  );
};
```

Notice how the `queryKey` uses `["post", id]` — a different base key (`"post"` singular) and the dynamic `id` from the URL. This means each post gets its own cache entry.

---

## Chapter 3 — Loading, Error States & DevTools

[⬆ Back to Menu](#table-of-contents)

### Handling Loading & Error States

TanStack Query gives you `isPending` and `isError` flags to handle conditional rendering cleanly:


```jsx
if (isPending) return <p>Loading...</p>;
if (isError) return <p>Error: {error.message || "Something went wrong!"}</p>;
```

This replaces the old pattern of manually setting `setIsLoading(false)` and `setIsError(true)` in try/catch blocks. TanStack Query manages the state transitions automatically:

1. Query starts → `isPending = true`
2. Success → `isPending = false`, `isSuccess = true`, `data = ...`
3. Failure → `isPending = false`, `isError = true`, `error = ...`

### React Query DevTools

DevTools give you a floating panel (bottom of screen) that shows:

- Every active query and its key
- Query status (fresh, stale, fetching, inactive)
- The cached data for each query
- When each query last fetched


```jsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Inside the QueryClientProvider:
<ReactQueryDevtools initialIsOpen={false} />;
```

- `initialIsOpen={false}` → the panel starts collapsed (click the flower icon to open)
- DevTools are **only loaded in development** — they're automatically excluded from production builds
- Install with: `npm install -D @tanstack/react-query-devtools`

---

## Chapter 4 — Caching — Garbage Collection, Stale Time & Polling

[⬆ Back to Menu](#table-of-contents)

### Understanding the Cache

When you use `useQuery`, the fetched data is **cached** using the `queryKey` as the identifier. This means:

- Navigating away and back serves data from cache instantly (no loading spinner)
- A background refetch updates the data silently

### `gcTime` — Garbage Collection Time

`gcTime` (default: **5 minutes**) controls how long **inactive** (unused) data stays in cache before being garbage collected.

- **Inactive** means no component is currently using that query
- Once a component unmounts, the cache entry starts a countdown
- After `gcTime` expires, the data is removed from memory

### `staleTime` — When to Refetch

`staleTime` (default: **0**) controls how long data is considered **fresh**. Fresh data is served from cache with **no background refetch**.

- With `staleTime: 0` (default) → data is immediately "stale" → triggers a background refetch every time a component mounts
- With `staleTime: 10000` → data stays "fresh" for 10 seconds → no refetch during that window

**Mental model:**

- `staleTime` answers: _"When should I refetch in the background?"_
- `gcTime` answers: _"When should I forget data nobody is using?"_

### Polling with `refetchInterval`

Polling makes your app feel real-time by automatically refetching at a fixed interval.

### Configuration Reference Table

These options were explored in the project. You can pass them to `useQuery`:


| Option                        | Default          | Purpose                                                                    |
| ----------------------------- | ---------------- | -------------------------------------------------------------------------- |
| `staleTime`                   | `0`              | ms before data is considered stale. `staleTime: 10000` means fresh for 10s |
| `gcTime`                      | `5 min (300000)` | ms to keep inactive (unused) data in cache before garbage collection       |
| `refetchInterval`             | `false`          | Polling interval in ms. `refetchInterval: 2000` refetches every 2s         |
| `refetchIntervalInBackground` | `false`          | Keep polling even when the browser tab is inactive                         |
| `refetchOnMount`              | `true`           | Refetch when a new component mounts with this query                        |
| `refetchOnWindowFocus`        | `true`           | Refetch when the browser tab regains focus                                 |
| `refetchOnReconnect`          | `true`           | Refetch when network reconnects                                            |
| `retry`                       | `3`              | Number of retry attempts on failure. Set `false` to disable                |
| `retryDelay`                  | `1000`           | ms delay between retries                                                   |
| `enabled`                     | `true`           | Set `false` to disable the query entirely (won't execute)                  |
| `networkMode`                 | `"online"`       | Controls when queries run: `"online"`, `"always"`, or `"offlineFirst"`     |

```jsx
const { data, isPending, isError, error } = useQuery({
  queryKey: ["posts", pageNumber],
  queryFn: () => fetchPosts(pageNumber),
  // Uncomment any of these to experiment:
  // staleTime: 10000,
  // gcTime: 10000,
  // refetchInterval: 2000,
  // refetchIntervalInBackground: true,
  // retry: 2,
  // enabled: false,
});
```

---

## Chapter 5 — Query Keys in Depth

[⬆ Back to Menu](#table-of-contents)

### What are Query Keys?

The **query key** is an array that uniquely identifies a query's data in the cache. It must be **serializable** (strings, numbers, objects — no functions or class instances).

### Key Rules

🔑 **Golden rule**: if a value is used inside `queryFn`, it **must** be in the `queryKey`. This keeps the cache correct and enables automatic refetching when inputs change.

### How Keys Work in the Project


```jsx
// List of posts — key includes page number
queryKey: ["posts", pageNumber];
```

When `pageNumber` changes (e.g. 0 → 3 → 6), TanStack Query treats each as a **separate cache entry**:

- `["posts", 0]` → first page data
- `["posts", 3]` → second page data
- `["posts", 6]` → third page data


```jsx
// Single post — key includes post id
queryKey: ["post", id];
```

Each post gets its own cache entry: `["post", "1"]`, `["post", "2"]`, etc.


```jsx
// Users list for infinite scroll — simple static key
queryKey: ["users"];
```

Since infinite scroll stores all pages internally, a single key is enough.

### Key Patterns

```jsx
// ✅ Simple key — no inputs
useQuery({ queryKey: ["todos"], queryFn: fetchTodos });

// ✅ Key with a variable — changing id creates a NEW cache entry
useQuery({ queryKey: ["todo", id], queryFn: () => fetchTodo(id) });

// ✅ Key with an object for filters (object key ORDER does NOT matter)
useQuery({
  queryKey: ["todos", { status: "done", page: 2 }],
  queryFn: () => fetchTodos({ status: "done", page: 2 }),
});

// ❌ Wrong — id is used in queryFn but not in queryKey
useQuery({ queryKey: ["todo"], queryFn: () => fetchTodo(id) });
```

---

## Chapter 6 — Pagination with TanStack Query

[⬆ Back to Menu](#table-of-contents)

### How Pagination Works

Pagination is implemented by:

1. Keeping a `pageNumber` state
2. Including `pageNumber` in the `queryKey` — when it changes, a new query is triggered
3. Using `keepPreviousData` to avoid jarring blank screens between page transitions

### The API


The JSONPlaceholder API supports pagination via `_start` and `_limit` query params:

```jsx
export const fetchPosts = async (pageNumber) => {
  try {
    const res = await api.get(`/posts?_start=${pageNumber}&_limit=5`);
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log(error);
  }
};
```

### Full Pagination Implementation


```jsx
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/api";
import { useState } from "react";

export const FetchRQ = () => {
  const [pageNumber, setPageNumber] = useState(0);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["posts", pageNumber],
    queryFn: () => fetchPosts(pageNumber),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ul className="section-accordion">
        {data?.map((curElem) => {
          const { id, title, body } = curElem;
          return <li key={id}>...</li>;
        })}
      </ul>

      <div className="pagination-section container">
        <button
          disabled={pageNumber === 0}
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
```

**How it works:**

- `pageNumber` starts at `0`, increments by `3` (matching the `_start` param)
- `queryKey: ["posts", pageNumber]` → each page is a separate cache entry
- `placeholderData: keepPreviousData` → while the new page is loading, the old page's data stays visible instead of showing a loading spinner
- Page display is calculated as `pageNumber / 3 + 1` (so 0→Page 1, 3→Page 2, etc.)

> 💡 **`keepPreviousData`** is imported from `@tanstack/react-query`. Without it, switching pages would flash "Loading..." every time.

---

## Chapter 7 — Mutations — Delete & Update

[⬆ Back to Menu](#table-of-contents)

### What is a Mutation?

A **Mutation** creates/updates/deletes server data. Unlike queries (which are reactive and cached), mutations are **imperative** — you call `mutate()` when you want them to run.

### The Mutation API Functions


```jsx
export const deletePost = (id) => {
  return api.delete(`/posts/${id}`);
};

export const updatePost = (id) => {
  return api.patch(`/posts/${id}`, { title: "I have updated" });
};
```

### Delete Mutation with `useMutation`


```jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

const deleteMutation = useMutation({
  mutationFn: (id) => deletePost(id),
  onSuccess: (data, id) => {
    queryClient.setQueryData(["posts", pageNumber], (curElem) => {
      return curElem?.filter((post) => post.id !== id);
    });
  },
});
```

**How it works:**

- `mutationFn` receives the `id` passed to `mutate(id)` and calls the API
- `onSuccess` fires after the server confirms deletion
- Instead of refetching the entire list, it uses `setQueryData` to **manually remove** the deleted post from the cache
- The `queryKey` includes `pageNumber` to update the correct page's cache

**Triggering the mutation:**

```jsx
<button onClick={() => deleteMutation.mutate(id)}>Delete</button>
```

### Update Mutation


```jsx
const updateMutation = useMutation({
  mutationFn: (id) => updatePost(id),
  onSuccess: (apiData, postId) => {
    queryClient.setQueryData(["posts", pageNumber], (postsData) => {
      return postsData?.map((curPost) => {
        return curPost.id === postId
          ? { ...curPost, title: apiData.data.title }
          : curPost;
      });
    });
  },
});
```

**How it works:**

- After the API responds, `onSuccess` receives `apiData` (the axios response) and `postId` (what was passed to `mutate`)
- It maps over the cached posts and replaces the matching post's title with the server response
- No need to refetch — the cache is updated directly

**Triggering the mutation:**

```jsx
<button onClick={() => updateMutation.mutate(id)}>Update</button>
```

### Cache Update Strategies

| Strategy          | Method                                               | When to use                                                                                       |
| ----------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Invalidate**    | `queryClient.invalidateQueries({ queryKey: [...] })` | When you want to refetch fresh data from the server                                               |
| **Manual update** | `queryClient.setQueryData([...], updaterFn)`         | When you can derive the new cache state from the mutation response (avoids extra network request) |

The project uses **manual update** for both delete and update — it directly modifies the cached array instead of refetching.

### Mutation Lifecycle Callbacks

They fire in this exact order: `onMutate` → _(network request)_ → `onSuccess` **or** `onError` → `onSettled`.

| Callback    | When it fires                 | Common use                                    |
| ----------- | ----------------------------- | --------------------------------------------- |
| `onMutate`  | Before the request leaves     | Optimistic updates, cancel in-flight queries  |
| `onSuccess` | Request succeeded             | Invalidate/update cache, show success toast   |
| `onError`   | Request failed                | Roll back optimistic update, show error toast |
| `onSettled` | Success **or** error (always) | Final cleanup, always-invalidate fallback     |

### Mutation State Flags

```jsx
const {
  mutate, // fire-and-forget: mutate(variables)
  mutateAsync, // returns a promise: await mutateAsync(variables)
  isPending, // request is in flight
  isSuccess, // last call succeeded
  isError, // last call failed
  isIdle, // never called yet
  data, // last successful response
  error, // last error object
  reset, // clear isError / isSuccess back to idle
} = deleteMutation;
```

---

## Chapter 8 — Infinite Scrolling

[⬆ Back to Menu](#table-of-contents)

### What is Infinite Scrolling?

Instead of pagination buttons, content loads automatically as the user scrolls down. TanStack Query provides `useInfiniteQuery` to manage this pattern, storing data as an array of `pages`.

### The API


```jsx
export const fetchUsers = async ({ pageParam }) => {
  try {
    const res = await axios.get(
      `https://api.github.com/users?per_page=10&page=${pageParam}`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
```

Notice: `useInfiniteQuery` automatically passes `{ pageParam }` to the `queryFn`. You don't call this function manually.

### Full Infinite Scroll Implementation


```jsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/api";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const InfiniteScroll = () => {
  const { data, hasNextPage, fetchNextPage, status, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["users"],
      queryFn: fetchUsers,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 10 ? allPages.length + 1 : undefined;
      },
    });

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Infinite Scroll with React Query v5</h1>

      {data?.pages?.map((page, index) => (
        <ul key={index}>
          {page.map((user) => (
            <li
              key={user.id}
              style={{ padding: "10px", border: "1px solid #ccc" }}
            >
              <p>{user.login}</p>
              <img
                src={user.avatar_url}
                alt={user.login}
                width={50}
                height={50}
              />
            </li>
          ))}
        </ul>
      ))}

      <div ref={ref} style={{ padding: "20px", textAlign: "center" }}>
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
            ? "Scroll down to load more"
            : "No more users"}
      </div>
    </div>
  );
};
```

### How `useInfiniteQuery` Works

| Property / Return    | Purpose                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `queryKey`           | Cache key for all pages (single key stores all pages)                         |
| `queryFn`            | Receives `{ pageParam }` automatically from the hook                          |
| `getNextPageParam`   | Determines the next `pageParam`. Return `undefined` to signal "no more pages" |
| `data.pages`         | Array of all fetched pages — each element is one API response                 |
| `data.pageParams`    | Array of all page params used                                                 |
| `fetchNextPage()`    | Trigger fetching the next page                                                |
| `hasNextPage`        | `true` if `getNextPageParam` returned a value (not `undefined`)               |
| `isFetchingNextPage` | `true` while the next page is being fetched                                   |

### The `getNextPageParam` Logic

```jsx
getNextPageParam: (lastPage, allPages) => {
  return lastPage.length === 10 ? allPages.length + 1 : undefined;
};
```

- `lastPage` → the data from the most recently fetched page
- `allPages` → array of all pages fetched so far
- If the last page has 10 items (a full page), return the next page number
- If it has less than 10 items, return `undefined` → signals no more data → `hasNextPage` becomes `false`

### Auto-triggering with Intersection Observer

Instead of a "Load More" button, the project uses `react-intersection-observer` to detect when the user scrolls to the bottom:

```bash
npm install react-intersection-observer
```

```jsx
import { useInView } from "react-intersection-observer";

const { ref, inView } = useInView({ threshold: 1 });

useEffect(() => {
  if (inView && hasNextPage) {
    fetchNextPage();
  }
}, [inView, fetchNextPage, hasNextPage]);
```

- `ref` is attached to a sentinel `<div>` at the bottom of the list
- When that div becomes visible (`inView = true`), and there are more pages, it auto-fetches
- `threshold: 1` means the element must be 100% visible to trigger

> 📦 **Data shape**: Infinite query data is `{ pages: [...], pageParams: [...] }`. Always map over `data.pages` — each element is one page's API response.

---

## Chapter 9 — Optimistic Updates

[⬆ Back to Menu](#table-of-contents)

> 📝 _This chapter covers an advanced pattern not implemented in the project, but essential for production apps._

### Definition

An **optimistic update** changes the UI _immediately_ — before the server confirms — assuming the request will succeed. If it fails, you **roll back**. This makes apps feel instant.

### The Full Pattern (with rollback)

```tsx
const queryClient = useQueryClient();

const toggleTodo = useMutation({
  mutationFn: (todo) =>
    fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    }),

  // 1️⃣ Before the request — update the UI now
  onMutate: async (todo) => {
    // Cancel any outgoing refetches so they don't overwrite our optimistic update
    await queryClient.cancelQueries({ queryKey: ["todos"] });

    // Snapshot the current value so we can roll back on failure
    const previousTodos = queryClient.getQueryData(["todos"]);

    // Optimistically flip `done` in the cache
    queryClient.setQueryData(["todos"], (old = []) =>
      old.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)),
    );

    // Return context carrying the snapshot
    return { previousTodos };
  },

  // 2️⃣ On failure — restore the snapshot
  onError: (_err, _todo, context) => {
    if (context?.previousTodos) {
      queryClient.setQueryData(["todos"], context.previousTodos);
    }
  },

  // 3️⃣ Always sync with the server (success OR error)
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
  },
});
```

> 🎯 **The 4 steps of every optimistic update**: **Cancel → Snapshot → Update → Rollback on error**. Memorize this rhythm.

---

## Chapter 10 — Dependent & Parallel Queries

[⬆ Back to Menu](#table-of-contents)

> 📝 _This chapter covers patterns not implemented in the project, but useful for multi-query workflows._

### Dependent Queries (`enabled`)

Run a query only **after** another finishes by using the `enabled` flag.

```jsx
function UserDashboard({ email }) {
  // Step 1: fetch user by email
  const { data: user } = useQuery({
    queryKey: ["user", email],
    queryFn: () => getUserByEmail(email),
  });

  // Step 2: fetch projects — only runs once userId exists
  const { data: projects } = useQuery({
    queryKey: ["projects", user?.id],
    queryFn: () => getProjectsByUser(user.id),
    enabled: !!user?.id, // 👈 prevents fetching with undefined id
  });

  return <div>/* render dashboard */</div>;
}
```

### Parallel Queries

Just call multiple `useQuery` hooks — they run concurrently and dedupe automatically.

```jsx
function AdminDashboard() {
  const users = useQuery({ queryKey: ["users"], queryFn: fetchUsers });
  const teams = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const projects = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });

  const isLoading = users.isPending || teams.isPending || projects.isPending;
  if (isLoading) return <p>Loading dashboard…</p>;

  return <div>/* render stats */</div>;
}
```

### Dynamic Parallel Queries (`useQueries`)

When the number of queries changes at runtime:

```jsx
import { useQueries } from "@tanstack/react-query";

function MultiUserProfiles({ userIds }) {
  const results = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => fetchUser(id),
      staleTime: 5 * 60 * 1000,
    })),
    combine: (results) => ({
      users: results.map((r) => r.data).filter(Boolean),
      isPending: results.some((r) => r.isPending),
    }),
  });

  if (results.isPending) return <p>Loading…</p>;
  return (
    <ul>
      {results.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Chapter 11 — Prefetching & SSR

[⬆ Back to Menu](#table-of-contents)

> 📝 _This chapter covers advanced patterns not implemented in the project._

### Prefetching on Hover

Fetch data _before_ the user navigates — the destination page feels instant.

```jsx
function ProjectCard({ id, name }) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ["project", id],
      queryFn: () => fetchProject(id),
      staleTime: 10_000,
    });
  };

  return (
    <a href={`/projects/${id}`} onMouseEnter={prefetch} onFocus={prefetch}>
      {name}
    </a>
  );
}
```

### `initialData` — Seed the Cache

Skip the loading state by seeding from an existing cache entry.

```jsx
function TodoDetail({ id }) {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => fetchTodo(id),
    initialData: () => {
      return queryClient.getQueryData(["todos"])?.find((t) => t.id === id);
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(["todos"])?.dataUpdatedAt,
  });

  return <div>{data?.title}</div>;
}
```

### `placeholderData` — Static Skeleton Data

Show hardcoded placeholder while real data loads:

```jsx
const { data } = useQuery({
  queryKey: ["config"],
  queryFn: fetchConfig,
  placeholderData: { theme: "light", language: "en" },
});
```

---

## Chapter 12 — Query Patterns & Architecture

[⬆ Back to Menu](#table-of-contents)

> 📝 _This chapter covers best practices for larger apps — your project is a great starting point to evolve toward these patterns._

### Custom Hooks (the #1 best practice)

Never scatter `useQuery` calls across your components. Wrap each query in a dedicated hook.

```jsx
// hooks/usePosts.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPosts } from "../api/api";

export function usePosts(pageNumber) {
  return useQuery({
    queryKey: ["posts", pageNumber],
    queryFn: () => fetchPosts(pageNumber),
    placeholderData: keepPreviousData,
  });
}

// hooks/useDeletePost.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../api/api";

export function useDeletePost(pageNumber) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(["posts", pageNumber], (curElem) =>
        curElem?.filter((post) => post.id !== id),
      );
    },
  });
}
```

### Query Key Factories

Centralize all keys to prevent typos and enable precise invalidation.

```jsx
// keys/postKeys.js
export const postKeys = {
  all: ["posts"],
  lists: () => [...postKeys.all, "list"],
  list: (page) => [...postKeys.lists(), { page }],
  details: () => [...postKeys.all, "detail"],
  detail: (id) => [...postKeys.details(), id],
};

// Usage:
postKeys.all; // ['posts']
postKeys.list(0); // ['posts', 'list', { page: 0 }]
postKeys.detail(42); // ['posts', 'detail', 42]

// Surgical invalidation:
queryClient.invalidateQueries({ queryKey: postKeys.lists() }); // lists only
queryClient.invalidateQueries({ queryKey: postKeys.all }); // everything
```

---

# Part II — TanStack Table

---

## Chapter 13 — Table Basics

[⬆ Back to Menu](#table-of-contents)

### Definition: Headless UI

**TanStack Table is headless** — it gives you the **logic** (sorting, filtering, pagination, selection) but renders **zero markup**. You own 100% of the HTML and styling. This means it works with any design system, any CSS framework, anywhere.

```tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

type Person = { id: number; name: string; age: number; email: string };

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "email", header: "Email" },
];

function PeopleTable({ data }: { data: Person[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // always required
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {table.getRowModel().rows.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          No results found.
        </p>
      )}
    </div>
  );
}
```

### Key Terms

| Term                   | Meaning                                                                          |
| ---------------------- | -------------------------------------------------------------------------------- |
| **Row Model**          | A processed set of rows. `getCoreRowModel` is the base; others layer on top.     |
| **`flexRender`**       | Renders a column's header/cell whether it's a string, JSX, or a render function. |
| **Header Group**       | A row of headers — supports multi-level grouped headers out of the box.          |
| **Instance (`table`)** | The object from `useReactTable` — contains all state, getters, and setters.      |

---

## Chapter 14 — Column Definitions

[⬆ Back to Menu](#table-of-contents)

### `createColumnHelper` — Type-safe Columns

```tsx
import { createColumnHelper } from "@tanstack/react-table";

type Person = {
  id: number;
  name: string;
  age: number;
  email: string;
  status: "active" | "inactive";
  role: string;
};

const col = createColumnHelper<Person>();

const columns = [
  // 1️⃣ Accessor by key — maps to `person.name`
  col.accessor("name", {
    header: "Full Name",
    cell: (info) => (
      <span className="font-medium text-gray-900">{info.getValue()}</span>
    ),
  }),

  // 2️⃣ Accessor by function — compute/combine fields
  col.accessor((row) => `${row.name} · ${row.role}`, {
    id: "nameRole", // id is required when using a function accessor
    header: "Person",
  }),

  // 3️⃣ Display column — no data (actions, checkboxes, expanders)
  col.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          className="text-xs text-blue-600 hover:underline"
          onClick={() => alert(`Edit ${row.original.name}`)}
        >
          Edit
        </button>
        <button
          className="text-xs text-red-600 hover:underline"
          onClick={() => alert(`Delete ${row.original.id}`)}
        >
          Delete
        </button>
      </div>
    ),
  }),
];
```

### Custom Cell Rendering

The `cell` function receives a context object with these helpers:

| Helper              | Returns                 |
| ------------------- | ----------------------- |
| `info.getValue()`   | The cell's typed value  |
| `info.row.original` | The raw data row object |
| `info.row.index`    | The row's index         |
| `info.column.id`    | The column's id string  |
| `info.table`        | The full table instance |

```tsx
// Status badge
col.accessor("status", {
  header: "Status",
  cell: (info) => {
    const value = info.getValue();
    const isActive = value === "active";
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium
        ${
          isActive
            ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
        />
        {value}
      </span>
    );
  },
});

// Age with progress bar
col.accessor("age", {
  header: "Age",
  cell: (info) => {
    const age = info.getValue();
    return (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-16 rounded-full bg-gray-100">
          <div
            className="h-1.5 rounded-full bg-blue-500"
            style={{ width: `${Math.min((age / 100) * 100, 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-500">{age}</span>
      </div>
    );
  },
});
```

---

## Chapter 15 — Sorting

[⬆ Back to Menu](#table-of-contents)

### Enable Sorting

```tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

function SortableTable({ data }: { data: Person[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // 👈 required to enable sorting
  });

  return (
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id} className="border-b border-gray-200">
            {hg.headers.map((header) => (
              <th key={header.id} className="px-4 py-3 text-left">
                {header.column.getCanSort() ? (
                  <button
                    className="group inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900"
                    onClick={header.column.getToggleSortingHandler()}
                    title={
                      header.column.getNextSortingOrder() === "asc"
                        ? "Sort ascending"
                        : "Sort descending"
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{
                      asc: <ArrowUp size={13} className="text-blue-500" />,
                      desc: <ArrowDown size={13} className="text-blue-500" />,
                    }[header.column.getIsSorted() as string] ?? (
                      <ArrowUpDown
                        size={13}
                        className="opacity-0 group-hover:opacity-50"
                      />
                    )}
                  </button>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* tbody unchanged */}
    </table>
  );
}
```

### Sorting Options per Column

```tsx
col.accessor("name", {
  header: "Name",
  enableSorting: true, // default true
  sortingFn: "alphanumeric", // built-in: 'alphanumeric' | 'text' | 'datetime' | 'basic'
  sortDescFirst: false, // first click sorts asc (default for strings)
  invertSorting: false,
});

col.accessor("age", {
  header: "Age",
  sortDescFirst: true, // first click sorts desc (common for numbers)
});

// Custom sort function
col.accessor("priority", {
  header: "Priority",
  sortingFn: (rowA, rowB) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[rowA.original.priority] - order[rowB.original.priority];
  },
});
```

> 🔁 **Multi-sort**: hold `Shift` and click multiple headers. Enabled by default — no extra config needed.

---

## Chapter 16 — Filtering

[⬆ Back to Menu](#table-of-contents)

### Global Filter (search all columns)

```tsx
import {
  getCoreRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";

function FilterableTable({ data }: { data: Person[] }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString", // built-in filter fn
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // 👈 required
  });

  return (
    <div>
      <div className="mb-4">
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns…"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
                     shadow-sm focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-blue-500"
        />
        {globalFilter && (
          <p className="mt-1 text-xs text-gray-500">
            {table.getFilteredRowModel().rows.length} result(s) found
          </p>
        )}
      </div>
      {/* table render */}
    </div>
  );
}
```

### Per-Column Filters

```tsx
import { type ColumnFiltersState } from "@tanstack/react-table";

const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

const table = useReactTable({
  data,
  columns,
  state: { columnFilters },
  onColumnFiltersChange: setColumnFilters,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});

// Render an input under each sortable header:
function ColumnFilterInput({ column }: { column: Column<Person> }) {
  return (
    <input
      value={(column.getFilterValue() as string) ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Filter…`}
      className="mt-1 w-full rounded border border-gray-200 px-2 py-1 text-xs"
    />
  );
}
```

### Built-in Filter Functions

| Function         | Matches when…                                            |
| ---------------- | -------------------------------------------------------- |
| `includesString` | Cell value contains the filter string (case-insensitive) |
| `equalsString`   | Cell value exactly equals the filter string              |
| `arrIncludes`    | Array cell includes the filter value                     |
| `inNumberRange`  | Number falls within `[min, max]`                         |
| `equals`         | Strict equality                                          |

### Custom Filter Function

```tsx
import { filterFns } from "@tanstack/react-table";

// Define on the column:
col.accessor("tags", {
  header: "Tags",
  filterFn: (row, columnId, filterValue: string) => {
    const tags: string[] = row.getValue(columnId);
    return tags.some((tag) =>
      tag.toLowerCase().includes(filterValue.toLowerCase()),
    );
  },
});
```

---

## Chapter 17 — Pagination

[⬆ Back to Menu](#table-of-contents)

### Client-Side Pagination

```tsx
import { getPaginationRowModel } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(), // 👈 enables pagination
  initialState: {
    pagination: { pageIndex: 0, pageSize: 10 },
  },
});

// Pagination controls:
function PaginationBar() {
  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-gray-600">
        {pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, total)}{" "}
        of {total}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-3 text-gray-700">
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      <select
        value={pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
        className="rounded border border-gray-200 px-2 py-1 text-sm"
      >
        {[5, 10, 20, 50, 100].map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Manual (Server-Side) Pagination

When your server handles paging, tell the table not to paginate locally.

```tsx
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

const { data } = useQuery({
  queryKey: ["people", pagination],
  queryFn: () => fetchPeople(pagination),
  placeholderData: keepPreviousData,
});

const table = useReactTable({
  data: data?.rows ?? [], // only the current page
  columns,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true, // 👈 we control it
  pageCount: data?.pageCount ?? -1, // -1 = unknown page count
  state: { pagination },
  onPaginationChange: setPagination,
});
```

---

## Chapter 18 — Row Selection & Expansion

[⬆ Back to Menu](#table-of-contents)

### Row Selection (checkboxes)

```tsx
import { type RowSelectionState } from "@tanstack/react-table";

const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

const selectionColumn = col.display({
  id: "select",
  header: ({ table }) => (
    <input
      type="checkbox"
      checked={table.getIsAllPageRowsSelected()}
      ref={(el) => {
        if (el) el.indeterminate = table.getIsSomePageRowsSelected();
      }}
      onChange={table.getToggleAllPageRowsSelectedHandler()}
      className="h-4 w-4 rounded border-gray-300"
    />
  ),
  cell: ({ row }) => (
    <input
      type="checkbox"
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onChange={row.getToggleSelectedHandler()}
      className="h-4 w-4 rounded border-gray-300"
    />
  ),
});

const table = useReactTable({
  data,
  columns: [selectionColumn, ...columns],
  state: { rowSelection },
  enableRowSelection: true,
  enableMultiRowSelection: true,
  onRowSelectionChange: setRowSelection,
  getCoreRowModel: getCoreRowModel(),
});

// Get the selected data objects:
const selectedPeople = table.getSelectedRowModel().rows.map((r) => r.original);

// Show count + bulk action:
{
  Object.keys(rowSelection).length > 0 && (
    <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">
      <span>{Object.keys(rowSelection).length} selected</span>
      <button
        onClick={() => deleteMany(selectedPeople)}
        className="font-medium underline"
      >
        Delete selected
      </button>
    </div>
  );
}
```

### Row Expansion

```tsx
import { getExpandedRowModel, type ExpandedState } from "@tanstack/react-table";

const [expanded, setExpanded] = useState<ExpandedState>({});

const expanderColumn = col.display({
  id: "expander",
  header: () => null,
  cell: ({ row }) =>
    row.getCanExpand() ? (
      <button onClick={row.getToggleExpandedHandler()}>
        {row.getIsExpanded() ? "▼" : "▶"}
      </button>
    ) : null,
});

const table = useReactTable({
  data,
  columns: [expanderColumn, ...columns],
  state: { expanded },
  onExpandedChange: setExpanded,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getSubRows: (row) => row.children, // for tree/nested data
});

// In the tbody, render expanded detail row:
{
  row.getIsExpanded() && (
    <tr>
      <td colSpan={columns.length} className="bg-gray-50 px-8 py-4">
        <pre className="text-xs">{JSON.stringify(row.original, null, 2)}</pre>
      </td>
    </tr>
  );
}
```

---

## Chapter 19 — Column Features

[⬆ Back to Menu](#table-of-contents)

### Column Visibility

```tsx
import { type VisibilityState } from "@tanstack/react-table";

const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
  email: false, // hidden by default
});

const table = useReactTable({
  // ...
  state: { columnVisibility },
  onColumnVisibilityChange: setColumnVisibility,
});

// Toggle panel:
<div className="flex flex-wrap gap-2">
  {table.getAllLeafColumns().map((column) => (
    <label
      key={column.id}
      className="flex cursor-pointer items-center gap-2 text-sm"
    >
      <input
        type="checkbox"
        checked={column.getIsVisible()}
        onChange={column.getToggleVisibilityHandler()}
        className="h-4 w-4 rounded border-gray-300"
      />
      <span className="capitalize">{column.id}</span>
    </label>
  ))}
</div>;
```

### Column Ordering

```tsx
import { type ColumnOrderState } from "@tanstack/react-table";

const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
  columns.map((c) => c.id as string),
);

const table = useReactTable({
  // ...
  state: { columnOrder },
  onColumnOrderChange: setColumnOrder,
});

// Drag-and-drop reorder (pseudocode with react-dnd):
const onDrop = (fromId: string, toId: string) => {
  const newOrder = [...columnOrder];
  const from = newOrder.indexOf(fromId);
  const to = newOrder.indexOf(toId);
  newOrder.splice(to, 0, newOrder.splice(from, 1)[0]);
  setColumnOrder(newOrder);
};
```

### Column Pinning

```tsx
import { type ColumnPinningState } from "@tanstack/react-table";

const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
  left: ["select", "name"], // pinned left
  right: ["actions"], // pinned right
});

const table = useReactTable({
  // ...
  state: { columnPinning },
  onColumnPinningChange: setColumnPinning,
  enableColumnPinning: true,
});
```

### Column Resizing

```tsx
const table = useReactTable({
  // ...
  enableColumnResizing: true,
  columnResizeMode: "onChange", // or 'onEnd'
});

// Resize handle in each header:
<th
  key={header.id}
  style={{ width: header.getSize() }}
  className="relative px-4 py-3"
>
  {flexRender(header.column.columnDef.header, header.getContext())}
  <div
    onMouseDown={header.getResizeHandler()}
    onTouchStart={header.getResizeHandler()}
    className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none
      ${header.column.getIsResizing() ? "bg-blue-500" : "bg-gray-200 hover:bg-gray-400"}`}
  />
</th>;
```

---

## Chapter 20 — Query + Table Together

[⬆ Back to Menu](#table-of-contents)

### Definition

The real power comes from combining both libraries: **TanStack Query** fetches and caches, **TanStack Table** manages UI state. When table state changes (sort, page), it becomes part of the query key, triggering an automatic refetch from the server.

### Full Server-Driven Data Table

```tsx
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type PaginationState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";

type Person = { id: number; name: string; email: string; age: number };
type ApiResponse = { rows: Person[]; pageCount: number; total: number };

const col = createColumnHelper<Person>();

const columns = [
  col.accessor("name", { header: "Name" }),
  col.accessor("email", { header: "Email" }),
  col.accessor("age", { header: "Age" }),
];

export function ServerTable() {
  // Table state — all of these drive query key changes
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const { data, isPending, isFetching } = useQuery<ApiResponse>({
    queryKey: ["people", { sorting, pagination, globalFilter }],
    queryFn: () =>
      fetch("/api/people", {
        method: "POST",
        body: JSON.stringify({ sorting, pagination, globalFilter }),
      }).then((r) => r.json()),
    placeholderData: keepPreviousData, // smooth transitions between pages
  });

  const table = useReactTable({
    data: data?.rows ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    state: { sorting, pagination, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true, // server sorts
    manualPagination: true, // server paginates
    manualFiltering: true, // server filters
  });

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        value={globalFilter}
        onChange={(e) => {
          setGlobalFilter(e.target.value);
          setPagination((p) => ({ ...p, pageIndex: 0 })); // reset to page 1
        }}
        placeholder="Search…"
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />

      {/* Table */}
      <div className="relative overflow-x-auto rounded-xl border border-gray-200">
        {/* Refetch indicator */}
        {isFetching && (
          <div className="absolute inset-x-0 top-0 h-0.5 animate-pulse bg-blue-500" />
        )}

        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}{" "}
                    {header.column.getIsSorted() === "asc"
                      ? "↑"
                      : header.column.getIsSorted() === "desc"
                        ? "↓"
                        : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-gray-700">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{data?.total ?? 0} total rows</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded border border-gray-200 px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded border border-gray-200 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
```

> 🧠 **The key insight**: table state (`sorting`, `pagination`, `globalFilter`) lives inside the **query key**. When the user sorts a column, the key changes → Query refetches → Table re-renders with fresh server data. Zero extra wiring needed.

---

# Part III — Reference

---

## Chapter 21 — Best Practices & Cheat Sheet

[⬆ Back to Menu](#table-of-contents)

### ✅ Query Do's and Don'ts

| ✅ Do                                         | ❌ Don't                                           |
| --------------------------------------------- | -------------------------------------------------- |
| Wrap queries in custom hooks                  | Call `useQuery` directly in big page components    |
| Put every `queryFn` input in the `queryKey`   | Forget variables in the key (stale cache!)         |
| Use key factories for consistent invalidation | Hardcode key arrays in every file                  |
| Set sensible `staleTime` per data type        | Leave everything at `staleTime: 0` (over-fetching) |
| Throw errors inside `queryFn`                 | Return `{ error }` objects silently                |
| Use `mutateAsync` when you need to chain      | Mix `mutate` + `await` (it doesn't await)          |

### ✅ Table Do's and Don'ts

| ✅ Do                                            | ❌ Don't                                            |
| ------------------------------------------------ | --------------------------------------------------- |
| Memoize `columns` and `data` with `useMemo`      | Define columns inline in render (causes re-renders) |
| Use `createColumnHelper` for full type inference | Cast types with `as ColumnDef<T>[]` everywhere      |
| Use `manual*` flags for server-side features     | Mix client + server pagination/sorting              |
| Lift all table state with `useState`             | Reach into the table instance to set state          |
| Use `flexRender` for every header/cell           | Directly call column defs (breaks generics)         |

### Memoization (Critical for Table Performance)

```tsx
import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";

// ✅ Defined outside component, or wrapped in useMemo
const columns = useMemo<ColumnDef<Person>[]>(
  () => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "age", header: "Age" },
    { accessorKey: "email", header: "Email" },
  ],
  [],
); // empty deps = defined once

// ✅ Stable data reference
const data = useMemo(() => rawData ?? [], [rawData]);

// ❌ Bad — new array/object on every render breaks the table
const columns = [{ accessorKey: "name" }]; // defined inside component render
```

### Recommended Folder Structure

```
src/
├── hooks/
│   ├── useTodos.ts           # useQuery wrapper
│   ├── useCreateTodo.ts      # useMutation wrapper
│   ├── useUpdateTodo.ts
│   └── useDeleteTodo.ts
├── keys/
│   ├── todoKeys.ts           # query key factory
│   └── userKeys.ts
├── api/
│   ├── todos.ts              # fetch functions (no React)
│   └── users.ts
└── components/
    ├── TodoTable/
    │   ├── TodoTable.tsx     # table UI
    │   ├── columns.ts        # column definitions
    │   └── filters.tsx       # filter components
    └── TodoForm.tsx
```

### Quick Reference: Row Models

| Model                   | Import         | Enables                    |
| ----------------------- | -------------- | -------------------------- |
| `getCoreRowModel`       | required       | Base rows — always include |
| `getSortedRowModel`     | add to options | Client-side sorting        |
| `getFilteredRowModel`   | add to options | Client-side filtering      |
| `getPaginationRowModel` | add to options | Client-side pagination     |
| `getExpandedRowModel`   | add to options | Row expansion / sub-rows   |
| `getGroupedRowModel`    | add to options | Grouping & aggregation     |

### Quick Reference: Common Query Options

| Option                 | Type              | Purpose                                |
| ---------------------- | ----------------- | -------------------------------------- |
| `staleTime`            | `number`          | ms before data is considered stale     |
| `gcTime`               | `number`          | ms to keep inactive data in cache      |
| `enabled`              | `boolean`         | conditionally enable/disable the query |
| `retry`                | `number \| false` | retry count on network failure         |
| `refetchInterval`      | `number`          | polling interval in ms                 |
| `placeholderData`      | `T \| fn`         | data to show while fetching            |
| `select`               | `fn`              | transform / derive from raw response   |
| `initialData`          | `T \| fn`         | seed the cache, skip loading state     |
| `refetchOnWindowFocus` | `boolean`         | refetch when tab regains focus         |
| `refetchOnReconnect`   | `boolean`         | refetch when network returns           |

---

<div align="center">

### 🎉 You've completed the TanStack journey!

**Query** masters your server state. **Table** masters your data UI. Together, they build fast, scalable, production-ready React apps.

[⬆ Back to Menu](#table-of-contents)

Generated with ❤️ for TanStack developers — happy shipping!

</div>
