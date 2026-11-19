type Props = {
    label: string;
    selected: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
};

export default function SelectOption({
                                         label,
                                         selected,
                                         onClick,
                                         icon,
                                         disabled = false,
                                     }: Props) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`
                flex min-h-[60px]
                w-full
                items-center
                justify-between
                rounded-[10px]
                border
                px-4
                text-left
                transition

                ${
                selected
                    ? "border-[#6caf75] bg-[#e8f5e9]"
                    : "border-[#b8d0ef] bg-white hover:bg-[#f7faff]"
            }

                ${
                disabled
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer"
            }
            `}
        >
            <div className="flex items-center gap-3">
                {icon}

                <span className="text-[16px] text-[#292934]">
                    {label}
                </span>
            </div>

            <div
                className={`
                    flex h-[19px]
                    w-[19px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    text-[12px]

                    ${
                    selected
                        ? "border-[#56a461] text-[#56a461]"
                        : "border-[#d9e1e8] text-[#d9e1e8]"
                }
                `}
            >
                ✓
            </div>
        </button>
    );
}