import { Outlet, Link, NavLink } from "react-router-dom";
import {
    SignedIn,
    SignedOut,
    UserButton,
    OrganizationSwitcher,
    useOrganization,
} from "@clerk/clerk-react";

function Layout() {
    const Organization = useOrganization();

    const navItemClass = ({ isActive }) =>            /* To highlight the page on sidebar we are currently on, in Blue */
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* ================= PUBLIC NAVBAR ================= */}
            <SignedOut>
                <div className="min-h-screen">
                    <header className="border-b border-slate-800 bg-slate-950">
                        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                            {/* Logo */}
                            <Link
                                to="/"
                                className="text-xl font-bold tracking-tight text-white"
                            >
                                AgencyOS
                            </Link>

                            {/* Public navigation */}
                            <div className="flex items-center gap-3">

                                <Link
                                    to="/pricing"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                >
                                    Pricing
                                </Link>

                                <Link
                                    to="/sign-in"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    to="/sign-up"
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                                >
                                    Sign Up
                                </Link>

                            </div>
                        </div>
                    </header>

                    <main>
                        <Outlet />
                    </main>
                </div>
            </SignedOut>


            {/* ================= LOGGED-IN APPLICATION ================= */}
            <SignedIn>
                <div className="flex min-h-screen">

                    {/* ================= SIDEBAR ================= */}
                    <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-900 md:flex">

                        {/* Logo */}
                        <div className="flex h-16 items-center border-b border-slate-800 px-5">
                            <Link
                                to="/dashboard"
                                className="text-xl font-bold tracking-tight text-white"
                            >
                                Agency<span className="text-indigo-400">OS</span>
                            </Link>
                        </div>


                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto px-3 py-6">

                            {/* MAIN */}
                            <div>
                                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Main
                                </p>

                                <div className="space-y-1">

                                    <NavLink
                                        to="/dashboard"
                                        className={navItemClass}
                                    >
                                        <span>⌂</span>
                                        Dashboard
                                    </NavLink>

                                    <NavLink
                                        to="/leads"
                                        className={navItemClass}
                                    >
                                        <span>◎</span>
                                        Leads
                                    </NavLink>

                                    <NavLink
                                        to="/follow-ups"
                                        className={navItemClass}
                                    >
                                        <span>◷</span>
                                        Follow-Ups
                                    </NavLink>

                                    <NavLink
                                        to="/emails"
                                        className={navItemClass}
                                    >
                                        <span>✉</span>
                                        Emails
                                    </NavLink>

                                    <NavLink
                                        to="/tasks"
                                        className={navItemClass}
                                    >
                                        <span>✓</span>
                                        Tasks
                                    </NavLink>

                                </div>
                            </div>


                            {/* MANAGEMENT */}
                            <div className="mt-8">

                                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Management
                                </p>

                                <div className="space-y-1">

                                    {/* Future feature */}
                                    <div className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600">
                                        <span>▣</span>

                                        Proposals

                                        <span className="ml-auto text-[10px] uppercase">
                                            Soon
                                        </span>
                                    </div>


                                    {/* Future feature */}
                                    <div className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600">
                                        <span>◷</span>

                                        Meetings

                                        <span className="ml-auto text-[10px] uppercase">
                                            Soon
                                        </span>
                                    </div>


                                    {/* Future feature */}
                                    <div className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600">
                                        <span>₹</span>

                                        Invoices

                                        <span className="ml-auto text-[10px] uppercase">
                                            Soon
                                        </span>
                                    </div>

                                </div>
                            </div>

                        </nav>


                        {/* ================= SIDEBAR BOTTOM ================= */}
                        <div className="border-t border-slate-800 p-4">

                            {/* Organization */}
                            <OrganizationSwitcher
                                hidePersonal                                                       //Personal Workspace is not shown in the dropdown
                                afterCreateOrganizationUrl={"dashboard"}                             //after creating and selecting organization, open dashboard of that organization
                                afterSelectOrganizationUrl={"dashboard"}
                                createOrganizationMode={"modal"}                                    //A modal is a popup window that appears on top of the current page, when you click on create organization
                                appearance={{                                                       //appearance prop lets you customize the UI of Clerk components.
                                    elements: {
                                        organizationPreviewMainIdentifier__organizationSwitcherTrigger: {        ////The name of selected organization appearing on navbar is by default black so making it white
                                            color: "white",
                                        },
                                        organizationSwitcherTriggerIcon: {                                          //The dropdown icon appearing on navbar beside selected organization name is by default black so making it white
                                            color: "white",
                                        },
                                    },
                                }}
                            />


                            {/* User */}
                            <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-800/60 p-3">

                                <UserButton />

                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white">
                                        Account
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Agency workspace
                                    </p>
                                </div>

                            </div>

                        </div>

                    </aside>


                    {/* ================= MAIN CONTENT ================= */}
                    <div className="flex min-w-0 flex-1 flex-col">

                        <main className="flex-1">
                            <Outlet />                                                   {/*Render the corresponding page (Home, Pricing, Dashboard, etc.) according to current URL. Navbar is fixed in all pages and the page to be rendered will be different */}
                        </main>

                    </div>

                </div>
            </SignedIn>

        </div>
    );
}

export default Layout;


