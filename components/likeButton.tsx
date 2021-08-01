import React, { FC, useState, useEffect } from 'react';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuthentication } from 'hooks/authentication';
import firebase from 'firebase/app';
import { Box, Text, Icon, Tooltip } from '@chakra-ui/react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

export type LikeButtonWithCountProps = {
    count: number;
    isLiked: boolean;
};

export type PostIdProps = {
    postId: string;
};

const LikeButton: FC<PostIdProps> = ({ postId }) => {
    const { user } = useAuthentication();

    useEffect(() => {}, []);

    const [isLike, setIsLike] = useState(false);

    const like = async () => {
        try {
            // userId,postIdのref型をstoreへ保存
            const userRef = firebase
                .firestore()
                .collection('users')
                .doc(user.uid);

            const postRef = firebase
                .firestore()
                .collection('posts')
                .doc(postId);

            await firebase
                .firestore()
                .collection('likes_posts_users')
                .doc()
                .set({
                    userId: userRef,
                    postId: postRef,
                    createdAt: new Date(),
                });

            console.log(postId, 'にいいねをしました');
        } catch (err) {
            console.log();
        }
    };
    const unlike = async () => {};

    const toggleLike = () => {
        if (!user) {
            return;
        }

        isLike ? unlike() : like();
        setIsLike(!isLike);
    };

    return (
        <Box display="flex" alignItems="center" color="gray.500">
            <Tooltip
                label={user ? 'いいね' : 'いいねするにはログインが必要です'}
                bg="gray.400"
                fontSize="11px"
            >
                <Text cursor="pointer" onClick={toggleLike}>
                    <Icon
                        as={isLike ? AiFillHeart : AiOutlineHeart}
                        mr="2.5"
                        fontSize="22px"
                        color={isLike ? 'red.400' : ''}
                    />
                </Text>
            </Tooltip>
        </Box>
    );
};
export default LikeButton;
