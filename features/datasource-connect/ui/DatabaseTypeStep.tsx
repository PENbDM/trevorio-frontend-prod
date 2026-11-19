import SelectOption from "./SelectOption";
import {
    databaseOptions,
} from "../config/datasource-options";

type Props = {
    value: string | null;
    onChange: (value: string) => void;
};

export default function DatabaseTypeStep({
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
                Step 2: Your database type
            </h2>

            <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-4">
                {databaseOptions.map((database) => (
                    <SelectOption
                        key={database.id}
                        label={database.label}
                        selected={
                            value === database.id
                        }
                        disabled={!database.enabled}
                        onClick={() =>
                            onChange(database.id)
                        }
                    />
                ))}

                <SelectOption
                    label="More database options"
                    selected={false}
                    disabled
                    onClick={() => {}}
                />
            </div>

            <div className="mt-10 flex justify-center">
                <button
                    type="button"
                    className="
                        rounded-full
                        border border-[#e2e5e8]
                        px-7 py-3
                        text-[#456b92]
                    "
                >
                    💬 Live chat support
                </button>
            </div>
        </section>
    );
}