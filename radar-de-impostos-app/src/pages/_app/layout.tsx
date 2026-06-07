import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Header } from "../../components/Header";
import bgImage from "../../assets/impostos-bg.jpg";

export const Route = createFileRoute("/_app")({
    component: MainLayout,
});

function MainLayout() {
    return (
        <div className="relative min-h-screen flex flex-col items-center bg-[#020618] text-white">
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-8 pointer-events-none"
                style={{ backgroundImage: `url(${bgImage})` }}
            />
            {/* Content */}
            <div className="relative z-10 w-full flex flex-col items-center">
                <Header />

                <Outlet />
            </div>
        </div>
    );
}
