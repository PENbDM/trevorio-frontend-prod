import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    active?: boolean;
};

export default function SidebarButton({
    children,
    active = false,
}: Props) {
    return (
        <button
            type="button"
            className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-md
                transition
                ${
                    active
                        ? "bg-[#304d6d] text-white"
                        : "text-[#71849a] hover:bg-gray-100"
                }
            `}
        >
            {children}
        </button>
    );
}
