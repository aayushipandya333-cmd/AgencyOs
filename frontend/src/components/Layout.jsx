import {Outlet, Link} from "react-router-dom"
import {SignedIn, SignedOut, UserButton, OrganizationSwitcher, useOrganization} from "@clerk/clerk-react";

function Layout() {
    const Organization = useOrganization()

    return <div className={"layout"}>
        <div className={"nav"}>
            <div className={"nav-container"}>
                <Link to={"/"} className={"nav-logo"}>
                     AgencyOS
                </Link>

                <div className={"nav-links"}>
                    <Link to={"/pricing"} className={"nav-link"}>
                        Pricing
                    </Link>

                    <SignedOut>
                    <Link to={"/sign-in"} className={"nav-link"}>
                        Sign In
                    </Link>
                    <Link to={"/sign-up"} className={"btn btn-primary"}>
                        Sign Up
                    </Link>
                    </SignedOut>

                    <SignedIn>
                        <OrganizationSwitcher
                            hidePersonal                                  //Personal Workspace is not shown in the dropdown
                            afterCreateOrganizationUrl={"dashboard"}       //after creating and selecting organization, open dashboard of that organization
                            afterSelectOrganizationUrl={"dashboard"}
                            createOrganizationMode={"modal"}     //A modal is a popup window that appears on top of the current page, when you click on create organization     
                            appearance={{                       //appearance prop lets you customize the UI of Clerk components.
                                elements: {
                                    organizationPreviewMainIdentifier__organizationSwitcherTrigger: {color: "white"},  //The name of selected organization appearing on navbar is by default black so making it white 
                                    organizationSwitcherTriggerIcon: {color: "white"}                                 //The dropdown icon appearing on navbar beside selected organization name is by default black so making it white 
                            }}}
                        />
                        {Organization && (
                            <>
                                <Link to={"/dashboard"} className={"nav-link"}>
                                        Dashboard
                                </Link>

                                <Link to={"/leads"} className={"nav-link"}>
                                            Leads
                                </Link>
                            </>
                        )}

                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </div>

        <main>
            <Outlet />         {/*  Render the corresponding page (Home, Pricing, Dashboard, etc.) according to current URL. Navbar is fixed in all pages and the page to be rendered will be different */}
        </main>


    </div>

} 


export default Layout