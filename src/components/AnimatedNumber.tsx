import { useEffect, useRef } from 'react';
import { CountUp } from 'countup.js';

const AnimatedNumber = ({ end, suffix = '', prefix = '', separator = '.' }: { end: number, suffix?: string, prefix?: string, separator?: string }) => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const countUp = new CountUp(ref.current, end, {
            suffix,
            prefix,
            separator,
            duration: 6,
        });
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                countUp.start();
                observer.disconnect();
            }
        });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, suffix, prefix, separator]);

    return <span ref={ref}>0</span>;
};

export default AnimatedNumber;