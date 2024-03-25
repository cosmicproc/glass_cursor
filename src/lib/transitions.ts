import { hideElement, showElement } from './utils';

export function typewriter(
    node: Element,
    {
        delay,
        maxDuration,
        cursor,
    }: { delay?: number; maxDuration: number; cursor: HTMLElement },
) {
    const originalNode =
        node.childNodes.length === 1
            ? node.childNodes[0].cloneNode(true)
            : node.cloneNode(true);
    const text = node.textContent || '';
    const duration = Math.min(maxDuration, text.length * 40);

    showElement(cursor);

    return {
        delay,
        duration,
        tick: (t: number) => {
            const i = Math.trunc(text.length * t);
            let current = 0;
            const newNode = originalNode.cloneNode(true);
            newNode.childNodes.forEach((childNode) => {
                if (current >= i || !childNode.textContent) {
                    childNode.textContent = '';
                } else if (current + childNode.textContent.length > i) {
                    childNode.textContent = childNode.textContent.slice(
                        0,
                        i - current,
                    );
                    current = i;
                } else {
                    current += childNode.textContent.length;
                }
            });
            node.replaceChildren(newNode);
            if (t === 1) {
                hideElement(cursor);
            }
        },
    };
}
