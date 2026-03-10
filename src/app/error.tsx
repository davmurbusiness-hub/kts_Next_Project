'use client'

import {Button, PageText} from "@components/index";
import { useRouter } from "next/navigation";

export default function Error() {
    const router = useRouter();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <PageText description={'Непредвиденная ошибка. Может лучше найдем хорошие фильмы?'} title={"Ошибка"}/>
            <Button onClick={() => router.push('/films')}>
                На главную
            </Button>
        </div>
    );
}
