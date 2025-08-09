import { useState } from 'react';

interface SlideToggleProps {
    onToggle: (on: boolean) => void;
    initial?: boolean;
}

export default function SlideToggle({ onToggle, initial = false }: SlideToggleProps) {
    const [on, setOn] = useState(initial);

    const handleChange = () => {
        setOn((prev) => {
            const next = !prev;
            onToggle(next);
            return next;
        });
    };

    return (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <span style={{ fontSize: 14, backgroundColor: 'rgba(255,255,255,0.7)', padding: '2px 4px', borderRadius: '4px' }}>Auto Slide</span>
            <span style={{ position: 'relative', width: 40, height: 22, display: 'inline-block' }}>
                <input
                    type="checkbox"
                    checked={on}
                    onChange={handleChange}
                    style={{
                        opacity: 0,
                        width: 0,
                        height: 0,
                        position: 'absolute',
                    }}
                />
                <span
                    style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: on ? '#0078d4' : '#ccc',
                        borderRadius: 22,
                        transition: 'background 0.2s',
                    }}
                />
                <span
                    style={{
                        position: 'absolute',
                        left: on ? 20 : 2,
                        top: 2,
                        width: 18,
                        height: 18,
                        background: '#fff',
                        borderRadius: '50%',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        transition: 'left 0.2s',
                    }}
                />
            </span>
        </label>
    );
}