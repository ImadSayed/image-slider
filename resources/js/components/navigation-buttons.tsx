export default function NavigationButtons() {
    const handleClick = (direction: 'prev' | 'next') => {
        const event = new CustomEvent('navigation-button-click', { detail: { direction } });
        document.dispatchEvent(event);
    };

    return (
        <div className="navigation-buttons">
            <button className="previous-button" onClick={() => handleClick('prev')}>
                <span>Prev</span>
            </button>
            <button className="next-button" onClick={() => handleClick('next')}>
                <span>Next</span>
            </button>
        </div>
    );
}
