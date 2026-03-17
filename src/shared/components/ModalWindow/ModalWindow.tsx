"use client";

import {useEffect, useRef} from "react";
import s from "./ModalWindow.module.scss";
import {CloseIcon} from "@components/index";

type ModalWindowProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const ModalWindow: React.FC<ModalWindowProps> = ({isOpen, onClose, children}) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", onKey);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className={s.overlay}
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose();
            }}
            role="dialog"
            aria-modal="true"
        >
            <div className={s.modal}>
                <CloseIcon className={s.closeBtn} onClick={onClose} aria-label="Закрыть">
                    <CloseIcon/>
                </CloseIcon>

                {children}
            </div>
        </div>
    );
};

export default ModalWindow;
