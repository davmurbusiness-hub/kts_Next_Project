import { useRef, useState, useEffect } from 'react';
import s from './Sorter.module.scss';
import {Button, CheckBox, SortIcon, Text} from '@components/index';

export type SortOption = {
    id: string;
    label: string;
};

export type SortState = {
    id: string;
    enabled: boolean;
    descending: boolean;
};

type Props = {
    options: SortOption[];
    value: SortState[];
    onChange: (value: SortState[]) => void;
};


export default function Sorter({ options, value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                rootRef.current && !rootRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const update = (id: string, field: 'enabled' | 'descending', checked: boolean) => {
        const existing = value.find(item => item.id === id);
        let next: SortState[];

        if (existing) {
            next = value.map(item => item.id === id ? { ...item, [field]: checked } : item);
        } else {
            const newItem: SortState = {
                id,
                enabled: field === 'enabled' ? checked : false,
                descending: field === 'descending' ? checked : false,
            };
            next = [...value, newItem];
        }

        onChange(next);
    };

    const getState = (id: string): SortState => {
        return (
            value.find((v) => v.id === id) ?? {
                id,
                enabled: false,
                descending: true,
            }
        );
    };

    return (
        <div className={s.root} ref={rootRef}>
            <Button outline={true} onClick={() => setOpen(prev => !prev)}>
                <SortIcon/>
            </Button>

            {open && (
                <div className={s.dropdown}>
                    <div className={s.container}>
                        <Text view={'p-20'} className={s.section}>Сортировать</Text>
                        <Text view={'p-20'} className={s.section}>По убыванию</Text>
                    </div>

                    {options.map((option) => {
                        const state = getState(option.id);

                        return (
                            <div key={option.id} className={s.container}>
                                <div className={s.section}>
                                    <Text color={state.enabled ? 'white' : 'disabled'}>
                                        {option.label}
                                    </Text>

                                    <CheckBox
                                        checked={state.enabled}
                                        onChange={(checked: boolean) =>
                                            update(option.id, 'enabled', checked)
                                        }
                                    />
                                </div>

                                <div className={s.section}>
                                    <CheckBox
                                        disabled={!state.enabled}
                                        checked={state.descending}
                                        onChange={(checked: boolean) =>
                                            update(option.id, 'descending', checked)
                                        }
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
