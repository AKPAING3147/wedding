import React from 'react';

export default function PixelFooter() {
    return (
        <footer style={{
            width: '100%',
            backgroundColor: '#2c3e50',
            color: '#fff',
            padding: '30px 10px',
            textAlign: 'center',
            fontFamily: "'Press Start 2P', system-ui",
            fontSize: '0.7rem',
            borderTop: '4px solid #34495e',
            position: 'relative',
            zIndex: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
        }}>


            <p style={{ margin: 0, lineHeight: '1.8' }}>
                Pixel Love Garden &copy; {new Date().getFullYear()}
            </p>

            <p style={{ margin: 0, color: '#bdc3c7' }}>
                Made By <a
                    href="https://akp-dev.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: '#f1c40f',
                        textDecoration: 'none',
                        borderBottom: '2px dashed #f1c40f',
                        paddingBottom: '2px',
                        transition: 'all 0.2s'
                    }}
                >
                    AKP
                </a>
            </p>

            <style jsx>{`
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `}</style>
        </footer>
    );
}
