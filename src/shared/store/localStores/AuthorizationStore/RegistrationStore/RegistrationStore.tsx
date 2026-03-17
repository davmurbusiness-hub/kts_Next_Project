import type { ILocalStore } from "@hooks/useLocalStore";
import { action, makeObservable, observable } from "mobx";
import type RootStore from "@store/globalStores/RootStore/RootStore";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {ToastApi} from "@providers/Toast/ToastProvider";

export default class RegistrationStore implements ILocalStore {
    login: string = "";
    password: string = "";
    passwordSecond: string = "";
    message: string = "";

    constructor(
        private readonly rootStore: RootStore,
        private readonly navigate: AppRouterInstance,
    private readonly toast: ToastApi

    ) {
        makeObservable<RegistrationStore>(this, {
            login: observable,
            password: observable,
            passwordSecond: observable,
            message: observable,
            setLoginValue: action,
            setPasswordValue: action,
            setPasswordSecondValue: action,
            setMessage: action,
            register: action,
        });
    }

    setLoginValue = (value: string) => {
        this.login = value;
    };

    setPasswordValue = (value: string) => {
        this.password = value;
    };

    setPasswordSecondValue = (value: string) => {
        this.passwordSecond = value;
    };

    setMessage = (value: string) => {
        this.message = value;
    };

    register = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (this.login === "") {
            this.toast.error("Заполните логин (email)");
            return;
        }

        if (!emailRegex.test(this.login)) {
            this.toast.error("Введите корректный email\nПримеры:\n- user@example.com\n- name@domain.ru\n- test@mail.org");
            return;
        }

        if (this.password === "") {
            this.toast.error("Заполните пароль");
            return;
        }

        if (this.password.length < 6) {
            this.toast.error("Пароль должен содержать минимум 6 символов");
            return;
        }

        if (this.passwordSecond !== this.password) {
            this.toast.error("Пароли не совпадают");
            return;
        }

        const result = await this.rootStore.auth.registerReq(this.login, this.password);
        if (result.success) {
            this.toast.success(result.message);
            this.navigate.push("/films");
        } else {
            this.toast.error(result.message);
        }
    };

    destroy() {
    }
}
