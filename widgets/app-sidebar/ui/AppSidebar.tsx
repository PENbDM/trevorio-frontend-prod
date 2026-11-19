import {
    Rocket,
    Save,
    ChartNoAxesColumnIncreasing,
    Compass,
    Gauge,
    BookOpen,
    UserRound,
    FileText,
    Settings,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import SidebarButton from "./SidebarButton";
import Link from "next/link";
interface Props {
    datasourceId: string;
}

export default function AppSidebar({ datasourceId }: Props) {




    return (
        <aside className="fixed left-0 top-0 z-50 flex h-screen w-[52px] flex-col items-center border-r border-[#e7e7e7] bg-white">
            <div className="flex h-[72px] items-center justify-center">
                <Link href={'/'}>
                    <div className="text-[27px] font-black text-[#ba6e66]">
                        T
                    </div>
                </Link>
            </div>

            <div className="flex flex-col items-center gap-2">
                <SidebarButton active>
                    <Link href={`/datasources/${datasourceId}/`}>
                        <Rocket size={21} />
                    </Link>

                </SidebarButton>

                <div className="group relative">
                    <Link
                        href={`/datasources/${datasourceId}/import-github`}
                        aria-label="Import SQL from GitHub"
                        className="
            flex h-[40px] w-[40px]
            items-center justify-center
            rounded-xl
            bg-[#eaf3fc]
            text-[#3f7fba]
            transition-colors
            hover:bg-[#dcecfb]
        "
                    >
                        <FaGithub size={21} />
                    </Link>

                    {/* Tooltip */}
                    <div
                        className="
            pointer-events-none
            absolute left-full top-1/2 z-[60]
            ml-3 -translate-y-1/2
            flex items-center gap-2
            whitespace-nowrap
            rounded-xl border border-[#e7e7e7]
            bg-white px-4 py-3
            opacity-0 shadow-lg
            transition-opacity duration-150
            group-hover:opacity-100
            group-focus-within:opacity-100
        "
                    >
        <span className="text-sm font-semibold text-[#202124]">
            Import SQL from GitHub
        </span>

                        <span
                            className="
                rounded-full
                bg-[#e3f0ff]
                px-2 py-0.5
                text-xs font-semibold
                text-[#3979d5]
            "
                        >
            New
        </span>
                    </div>
                </div>
                <SidebarButton>
                    <Save size={21} />
                </SidebarButton>
                <SidebarButton>
                    <ChartNoAxesColumnIncreasing size={21} />
                </SidebarButton>
                <SidebarButton>
                    <Compass size={21} />
                </SidebarButton>
            </div>

            <div className="mt-auto flex flex-col items-center gap-2 pb-5">
                <SidebarButton>
                    <Gauge size={21} />
                </SidebarButton>
                <SidebarButton>
                    <BookOpen size={21} />
                </SidebarButton>
                <SidebarButton>
                    <UserRound size={21} />
                </SidebarButton>
                <SidebarButton>
                    <FileText size={21} />
                </SidebarButton>
                <SidebarButton>
                    <Settings size={21} />
                </SidebarButton>
            </div>
        </aside>
    );
}
