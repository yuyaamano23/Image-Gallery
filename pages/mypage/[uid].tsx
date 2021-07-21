import React, { FC, useEffect, useState } from 'react';
import { User } from 'models/User';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';

type Query = {
    uid: string;
};

const UserMypage: FC = () => {
    const [user, setUser] = useState<User>(null);
    const router = useRouter();
    const query = router.query as Query;

    useEffect(() => {
        // 初回レンダリングを考慮するために query に値がある場合だけ処理するように調整します。
        if (query.uid === undefined) {
            return;
        }

        async function loadUser() {
            const doc = await firebase
                .firestore()
                .collection('users')
                .doc(query.uid)
                .get();

            if (!doc.exists) {
                return;
            }

            const gotUser = doc.data() as User;
            gotUser.uid = doc.id;
            setUser(gotUser);
        }
        // useEffectはasyncが使えないから関数を分けている;
        loadUser();
    }, [query.uid]);

    return <div>{user ? user.name : 'ロード中...'}さんのページ</div>;
};
export default UserMypage;
