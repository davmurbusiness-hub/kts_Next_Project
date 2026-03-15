import RegistrationPage from "@/pages-ui/Authorizarion/RegistrationPage";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Регистрация',
};

export default async function Page() {
    return (
        <RegistrationPage/>
    )
}
