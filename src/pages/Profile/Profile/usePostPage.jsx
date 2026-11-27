import { useFetcher } from "@api/fetcher";
import useAppBase from "@hooks/useAppBase";
import { useState } from "react";
import { Images } from "@assets/images";

const MOCK_POSTS = [
  {
    id: 101,
    user: {
      fullName: "Minh Nhật",
      username: "minhnhat",
      avatar: Images.avatar,
    },
    createdAt: "2 giờ trước",
    category: "Chia sẻ từ vựng",
    content:
      "Hôm nay ôn lại bộ IELTS Academic gặp từ này rất hữu ích khi viết Task 2 về chủ đề công nghệ và xã hội. Mọi người lưu lại dùng thử nhé.",
    vocab: {
      word: "Ubiquitous",
      phonetic: "/juːˈbɪk.wɪ.təs/ • adj",
      meaning:
        "Có mặt ở khắp mọi nơi, phổ biến rộng rãi (vd: Smartphones have become ubiquitous in modern life.)",
    },
    stats: { likes: 24, shares: 3 },
    initialComments: [
      {
        id: 1,
        author: { name: "Khánh Linh", avatar: Images.avatar },
        content: "Từ này dùng thay cho 'everywhere' trong Writing Task 2 rất tự nhiên.",
        date: "1 giờ trước",
      },
      {
        id: 2,
        author: { name: "Hải Đăng", avatar: Images.avatar },
        content: "Đã lưu vào bộ từ vựng của mình, cảm ơn bạn.",
        date: "40 phút trước",
      },
    ],
  },
  {
    id: 102,
    user: {
      fullName: "Minh Nhật",
      username: "minhnhat",
      avatar: Images.avatar,
    },
    createdAt: "Hôm qua lúc 21:15",
    category: "Thành tích",
    content:
      "Cán mốc chuỗi Streak 21 ngày liên tiếp và giữ vị trí #12 ở Giải Bạch Kim II. Tuần này đặt mục tiêu vào Top 10.",
    milestone: {
      title: "Cột mốc Streak 21 ngày",
      subtitle: "+15 Crystal • Giải Bạch Kim II",
    },
    stats: { likes: 41, shares: 5 },
    initialComments: [
      {
        id: 1,
        author: { name: "Phương Anh", avatar: Images.avatar },
        content: "Chúc mừng nhé, cố lên Top 10 tuần này!",
        date: "18 giờ trước",
      },
    ],
  },
  {
    id: 103,
    user: {
      fullName: "Minh Nhật",
      username: "minhnhat",
      avatar: Images.avatar,
    },
    createdAt: "3 ngày trước",
    category: "Ghi chú học tập",
    content:
      "Mẹo phân biệt nhanh Phrasal Verbs với 'Break':\n• Break down: hỏng hóc (máy móc) / suy sụp\n• Break out: bùng phát (dịch bệnh, hỏa hoạn)\n• Break through: đột phá, vượt qua rào cản",
    stats: { likes: 19, shares: 7 },
    initialComments: [],
  },
  {
    id: 104,
    user: {
      fullName: "Minh Nhật",
      username: "minhnhat",
      avatar: Images.avatar,
    },
    createdAt: "5 ngày trước",
    category: "Chia sẻ từ vựng",
    content:
      "Vừa hoàn thành 100% bộ thẻ 'IT & Software Vocab' (120 từ) với độ chính xác 96%. Chuẩn bị chuyển sang bộ Business English.",
    vocab: {
      word: "Scalability",
      phonetic: "/ˌskeɪ.ləˈbɪl.ə.ti/ • noun",
      meaning: "Khả năng mở rộng quy mô của một hệ thống hoặc mô hình kinh doanh.",
    },
    stats: { likes: 15, shares: 2 },
    initialComments: [],
  },
];

function usePostPage() {
  const { fetcher } = useFetcher();
  const { setLoading, loading } = useAppBase();

  const [posts, setPosts] = useState(MOCK_POSTS);

  const createPost = async (content, files = [], category = "Ghi chú học tập") => {
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
      await fetchMyPosts();
    } catch {
      const localPost = {
        id: Date.now(),
        user: {
          fullName: "Minh Nhật",
          username: "minhnhat",
          avatar: Images.avatar,
        },
        createdAt: "Vừa xong",
        category,
        content,
        stats: { likes: 0, shares: 0 },
        initialComments: [],
      };
      setPosts((prev) => [localPost, ...prev]);
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
      if (Array.isArray(res?.data) && res.data.length > 0) {
        setPosts(res.data);
      } else {
        setPosts(MOCK_POSTS);
      }
    } catch {
      setPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, fetchMyPosts, posts };
}

export default usePostPage;
