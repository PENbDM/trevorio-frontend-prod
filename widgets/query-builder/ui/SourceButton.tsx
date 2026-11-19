import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    active: boolean;
    onClick: () => void;
};

export default function SourceButton({
    children,
    active,
    onClick,
}: Props) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex
                h-[30px]
                items-center
                gap-1
                border-y
                border-r
                border-[#e2e3e6]
                px-3
                text-[11px]
                transition
                ${
                    active
                        ? "bg-white text-[#3f424b]"
                        : "bg-[#fafafa] text-[#666872] hover:bg-[#f4f5f6]"
                }
            `}
        >
            {children}
        </button>
    );
}
