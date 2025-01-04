import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { unauthClient } from "../../clients/base";

// 모든 게시물 가져오기
export const usePosts = () => {
    return useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const { data } = await unauthClient.get("/api/posts"); // 모든 게시물 가져오기
            return data;
        },
    });
};

// 특정 사용자의 게시물 가져오기
export const useUserPosts = (userId) => {
    return useQuery({
        queryKey: ["userPosts", userId],
        queryFn: async () => {
            const { data } = await unauthClient.get(`/api/posts/user/${userId}`); // 사용자 ID로 게시물 가져오기
            return data;
        },
    });
};

// 새로운 게시물 생성
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["createPost"],
        mutationFn: async (newPost) => {
            const { data } = await unauthClient.post("/api/posts", newPost); // 새로운 게시물 생성
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]); // 게시물 목록 새로고침
        },
    });
};
