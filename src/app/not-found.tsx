'use client'
import { useRouter } from 'next/navigation';
import {Button, PageText} from "@components/index";

export default function NotFound() {
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
            <PageText description={'Страница не найдена. Может лучше найдем хорошие фильмы?'} title={'404'}/>
            <Button onClick={() => router.push('/films')}>
                На главную
            </Button>
        </div>
    );
}
