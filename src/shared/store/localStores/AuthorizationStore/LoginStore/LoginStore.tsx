import type { ILocalStore } from "@hooks/useLocalStore";
import { action, makeObservable, observable } from "mobx";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type RootStore from "@store/globalStores/RootStore/RootStore";


export default class LoginStore implements ILocalStore {
    login: string = "";
    password: string = "";
    message: string = "";

    constructor(
        private readonly rootStore: RootStore,
        private readonly navigate: AppRouterInstance
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
        this.login = value;
    };

    setPasswordValue = (value: string) => {
        this.password = value;
    };

    setMessage = (value: string) => {
        this.message = value;
    };

    validation = async () => {
        if (this.login === "") {
            this.setMessage("Заполните логин");
            return;
        }
        if (this.password === "") {
            this.setMessage("Заполните пароль");
            return;
        }

        const result = await this.rootStore.auth.loginReq(this.login, this.password);
        if (result.success) {
            this.setMessage(result.message);
            setTimeout(() => this.navigate.push("/films"), 1000);
        } else {
            this.setMessage(result.message);
        }
    };

    destroy() {

    }
}
