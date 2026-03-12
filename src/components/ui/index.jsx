import { useTheme } from '../../ThemeContext';

export function Btn({ children, variant = 'primary', onClick, disabled, style = {} }) {
    const { colors } = useTheme();
    const { BORDER, GREEN, YELLOW, RED, CARD, MUTED, LIGHT, BG } = colors;

    return (
        <button disabled={disabled} onClick={onClick} style={{
            padding: '9px 22px', borderRadius: 4, fontWeight: 700, fontSize: 14,
            letterSpacing: 1, cursor: disabled ? 'not-allowed' : 'pointer',
            textTransform: 'uppercase', border: 'none',
            background: disabled ? BORDER
                : variant === 'primary' ? GREEN
                    : variant === 'yellow' ? YELLOW
                        : variant === 'red' ? RED
                            : CARD,
            color: disabled ? MUTED
                : (variant === 'primary' || variant === 'yellow') ? '#fff'
                    : LIGHT,
            opacity: disabled ? 0.6 : 1,
            transition: 'opacity .2s',
            ...style
        }}>
            {children}
        </button>
    );
}

export function Pill({ color, text }) {
    return (
        <span style={{
            background: color + '22', color, border: `1px solid ${color}44`,
            borderRadius: 3, padding: '1px 7px', fontSize: 11, fontWeight: 700,
            letterSpacing: 0.5, display: 'inline-block'
        }}>
            {text}
        </span>
    );
}

export function SectionHeader({ children, color }) {
    return (
        <h3 style={{
            color, margin: '0 0 10px', letterSpacing: 1,
            textTransform: 'uppercase', fontSize: 13, fontWeight: 700
        }}>
            {children}
        </h3>
    );
}
