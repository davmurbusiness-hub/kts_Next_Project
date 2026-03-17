import type { ILocalStore } from "@hooks/useLocalStore";
import { action, makeObservable, observable } from "mobx";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type RootStore from "@store/globalStores/RootStore/RootStore";

type ToastApi = {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
};

export default class LoginStore implements ILocalStore {
    login: string = "";
    password: string = "";
    message: string = "";

    constructor(
        private readonly rootStore: RootStore,
        private readonly navigate: AppRouterInstance,
        private readonly toast: ToastApi
    ) {
        makeObservable<LoginStore>(this, {
            login: observable,
            password: observable,
            message: observable,
            setLoginValue: action,
            setPasswordValue: action,
            setMessage: action,
            validation: action,
        });
    }

    setLoginValue = (value: string) => {
        this.login = value.toLowerCase();
    };

    setPasswordValue = (value: string) => {
        this.password = value;
    };

    setMessage = (value: string) => {
        this.message = value;
    };

    validation = async () => {
        if (this.login === "") {
            this.toast.error("Заполните логин");
            return;
        }
        if (this.password === "") {
            this.toast.error("Заполните пароль");
            return;
        }

        const result = await this.rootStore.auth.loginReq(this.login, this.password);
        if (result.success) {

            this.toast.success(result.message, );
            this.navigate.push("/films")
        } else {
            this.toast.error(result.message);
        }
    };

    destroy() {

    }
}
