"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import type { ToastProps, ToastType } from './ToastComponent/Toast';
import Toast from './ToastComponent/Toast';

type ToastConfig = Omit<ToastProps, "visible" | "onClose">;

export type ToastApi = {
    show: (config: ToastConfig) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<ToastProps>({
        visible: false,
        message: "",
        type: "info",
    });
    // key меняется при каждом новом тосте — это размонтирует старый Toast
    // и монтирует новый, полностью сбрасывая его внутреннее состояние
    const [toastKey, setToastKey] = useState(0);
    const [hasShown, setHasShown] = useState(false);

    const visibleRef = useRef(false);

    const handleClose = useCallback(() => {
        visibleRef.current = false;
        setHasShown(false); // размонтируем Toast полностью после анимации ухода
    }, []);

    const show = useCallback((config: ToastConfig) => {
        visibleRef.current = true;
        setHasShown(true);
        setToastKey((k) => k + 1);
        setToast({ ...config, visible: true });
    }, []);

    const showTyped = useCallback(
        (type: ToastType, message: string, title?: string) => {
            show({ type, message, title, duration: 3000 });
        },
        [show]
    );

    const api: ToastApi = {
        show,
        success: (m, t) => showTyped("success", m, t),
        error:   (m, t) => showTyped("error",   m, t),
        warning: (m, t) => showTyped("warning", m, t),
        info:    (m, t) => showTyped("info",    m, t),
    };

    return (
        <ToastContext.Provider value={api}>
            {children}
            {hasShown && <Toast key={toastKey} {...toast} onClose={handleClose} />}
        </ToastContext.Provider>
    );
}

export const useToast = (): ToastApi => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
};
