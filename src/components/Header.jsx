import { useTheme } from '../ThemeContext';
import { Btn } from './ui';
import { signInWithGoogle, signOut } from '../hooks/useAuth';

export default function Header({ tab, setTab, isAdmin, user }) {
    const { colors, isDark, toggle } = useTheme();
    const { PANEL, GREEN, MUTED, BORDER, TEXT } = colors;

    const TABS = [
        { id: 'setup', label: '⚙️ Setup' },
        { id: 'schedule', label: '📅 Schedule' },
        { id: 'standings', label: '🏆 Standings' },
        { id: 'champions', label: '🎉 Champions' }
    ];

    return (
        <div style={{
            background: PANEL, borderBottom: `2px solid ${GREEN}`,
            padding: '8px 20px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 12, flexWrap: 'wrap'
        }}>
            {/* Logo + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                    src="/marin-bocce-logo.png" alt="Marin Bocce"
                    style={{ height: 40, width: 'auto', objectFit: 'contain' }}
                    onError={(e) => e.target.style.display = 'none'}
                />
                <div>
                    <div style={{
                        fontSize: 16, fontWeight: 900, letterSpacing: 2,
                        color: TEXT, textTransform: 'uppercase', lineHeight: 1.1
                    }}>
                        <span style={{ color: GREEN }}>MARIN BOCCE</span>
                    </div>
                    <div style={{ fontSize: 10, color: MUTED, letterSpacing: 1, textTransform: 'uppercase' }}>
                        League Manager
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{
                        padding: '6px 14px', cursor: 'pointer', fontWeight: 700,
                        letterSpacing: 1, fontSize: 12, textTransform: 'uppercase',
                        background: 'none', border: 'none',
                        borderBottom: `3px solid ${tab === t.id ? GREEN : 'transparent'}`,
                        color: tab === t.id ? GREEN : MUTED, transition: 'color .2s',
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Auth + Admin + Theme Toggle */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Theme Toggle */}
                <button onClick={toggle} style={{
                    background: 'none', border: `1px solid ${BORDER}`, borderRadius: 4,
                    cursor: 'pointer', padding: '4px 8px', fontSize: 16, lineHeight: 1,
                    color: MUTED, transition: 'color .2s',
                }} title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                    {isDark ? '☀️' : '🌙'}
                </button>

                {isAdmin ? (
                    <>
                        <span style={{ fontSize: 11, color: GREEN, letterSpacing: 0.5 }}>
                            ✓ {user?.displayName?.split(' ')[0] || 'Admin'}
                        </span>
                        <Btn variant="secondary" style={{ fontSize: 10, padding: '4px 10px' }}
                            onClick={signOut}>
                            Sign Out
                        </Btn>
                    </>
                ) : user ? (
                    <>
                        <span style={{ fontSize: 11, color: colors.RED, letterSpacing: 0.5 }} title={user.email}>
                            Logged in as {user.email} (Not Admin)
                        </span>
                        <Btn variant="secondary" style={{ fontSize: 10, padding: '4px 10px' }} onClick={signOut}>Sign Out</Btn>
                    </>
                ) : (
                    <Btn variant="secondary" style={{ fontSize: 11, padding: '5px 12px' }}
                        onClick={signInWithGoogle}>
                        🔑 Admin
                    </Btn>
                )}
            </div>
        </div>
    );
}
