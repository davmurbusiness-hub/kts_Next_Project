import AuthorizationPage from "@/pages-ui/Authorizarion/AuthorizationPage";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Вход',
};

export default async function Page() {
    return (
        <AuthorizationPage/>
    )
}
