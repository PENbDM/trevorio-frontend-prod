import SelectOption from "./SelectOption";

type Props = {
    value: string | null;
    onChange: (value: string) => void;
    onClose: () => void;
};

export default function CredentialsStep({
                                            value,
                                            onChange,
                                            onClose,
                                        }: Props) {
    return (
        <section
            className="
                relative
                rounded-[18px]
                border border-[#e5e5e8]
                bg-white
                px-10 py-9
                shadow-[0_2px_6px_rgba(0,0,0,0.08)]
            "
        >
            <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="
                    absolute
                    right-7
                    top-7
                    flex h-[40px]
                    w-[40px]
                    items-center
                    justify-center
                    rounded-full
                    border border-[#e4e7eb]
                    text-[27px]
                    font-light
                    leading-none
                    text-[#53779a]
                    transition
                    hover:bg-[#f5f6f7]
                "
            >
                ×
            </button>

            <h1 className="text-center text-[28px] font-semibold text-[#41414f]">
                Connect a database
            </h1>

            <div className="mx-auto mt-8 max-w-[760px]">
                <div className="grid grid-cols-2 gap-10 text-[15px] text-[#555563]">
                    <div>
                        <p>🔒 Secure connection</p>
                        <p>• Read-only transaction</p>
                    </div>

                    <div>
                        <p>⚡ 2 minute set-up</p>
                        <p>• Chat support</p>
                    </div>
                </div>

                <p className="mt-8 border-b border-[#eeeeef] pb-8 text-[15px] text-[#555563]">
                    Data security is our first priority, which is why we&apos;re
                    trusted by many of the world&apos;s most successful organizations.
                </p>

                <h2 className="mt-8 text-center text-[21px] font-semibold">
                    Step 1: Your database credentials
                </h2>

                <div className="mt-7 grid grid-cols-2 gap-5">
                    <SelectOption
                        label="I know my database credentials"
                        selected={value === "know"}
                        onClick={() => onChange("know")}
                    />

                    <SelectOption
                        label="Someone needs to help me"
                        selected={value === "help"}
                        onClick={() => onChange("help")}
                    />
                </div>
            </div>
        </section>
    );
}