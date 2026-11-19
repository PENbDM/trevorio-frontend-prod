import SelectOption from "./SelectOption";
import {
    hostingProviders,
} from "../config/datasource-options";

type Props = {
    value: string | null;
    onChange: (value: string) => void;
};

export default function HostingProviderStep({
                                                value,
                                                onChange,
                                            }: Props) {
    return (
        <section
            className="
                rounded-[18px]
                border border-[#e5e5e8]
                bg-white
                px-10 py-10
                shadow-[0_2px_6px_rgba(0,0,0,0.08)]
            "
        >
            <h2 className="text-center text-[24px] font-semibold">
                Step 3: Your database hosting provider
            </h2>

            <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3">
                {hostingProviders.map(
                    (provider) => (
                        <SelectOption
                            key={provider.id}
                            label={provider.label}
                            selected={
                                value ===
                                provider.id
                            }
                            onClick={() =>
                                onChange(
                                    provider.id
                                )
                            }
                        />
                    )
                )}
            </div>
        </section>
    );
}