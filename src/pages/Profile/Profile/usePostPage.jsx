import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useState } from "react";

function usePostPage() {
  const { fetcher } = useFetcher();
  const { showNotification, setLoading, te, ts, loading } = useAppBase();

  //state
  const [posts, setPosts] = useState([]);

  const createPost = async (content, files) => {
    const formData = new FormData();

    formData.append(
      "post",
      new Blob([JSON.stringify({ content })], { type: "application/json" })
    );

    files.forEach((file) => {
      formData.append("mediaFile", file);
    });

    setLoading(true);
    try {
      await fetcher({
        url: `/api/v1/posts`,
        method: "POST",
        data: formData,
      });
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const res = await fetcher({
        url: `/api/v1/posts/me`,
        method: "GET",
      });
      setPosts(res.data);
    } catch (e) {
      showNotification(te(e.errorCode) || e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, fetchMyPosts, posts };
}

export default usePostPage;
