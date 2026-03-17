"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Toast.module.scss";
import { CloseIcon } from "@components/index";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
  title?: string;
  onClose?: () => void;
  visible: boolean;
};

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "i",
};

export default function Toast({
                                message,
                                type = "info",
                                duration = 2000,
                                title,
                                onClose,
                              }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLeaving(true);
    timerRef.current = setTimeout(() => {
      onClose?.();
    }, 350);
  };

  useEffect(() => {
    if (duration === 0) return;
    const timer = setTimeout(startLeave, duration);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <div
          className={`${styles.toast} ${styles[type]} ${isLeaving ? styles.leave : styles.enter}`}
          role="alert"
          aria-live="assertive"
      >
        <span className={styles.icon}>{ICONS[type]}</span>

        <div className={styles.body}>
          {title && <p className={styles.title}>{title}</p>}
          <p className={styles.message}>{message}</p>
        </div>

        <CloseIcon style={{cursor: 'pointer'}} onClick={startLeave} />

        {duration > 0 && (
            <div
                className={styles.progress}
                style={{ animationDuration: `${duration}ms` }}
            />
        )}
      </div>
  );
}
