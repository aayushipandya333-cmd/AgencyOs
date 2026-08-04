import {Routes, Route} from "react-router-dom"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx"
import SigninPage from "./pages/SigninPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import PricingPage from "./pages/PricingPage.jsx"
import LeadPage from "./pages/LeadPage.jsx";


function ProtectedRoute({children}) {
  return<>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
}

function App() {
  return<Routes>
    <Route path="/" element={<Layout />}>       /* Opens the fix page i.e. layout page, it shows navbar. It means all pages will render inside Layout.*/
      <Route index element={<HomePage />} />     /* Opens the home page as default page when user opens localhost:5173 */
      <Route path={"sign-in/*"} element={<SigninPage />}/>     /* Clerk have different routes like /sign-in, sign-in/verify, /sign-in/sso-callback this * is used to call all of them at once and same for signup */
      <Route path={"sign-up/*"} element={<SignupPage />}/>
      <Route path={"pricing"} element={<PricingPage />}/>
      <Route 
        path={"dashboard"} 
        element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
        }
        />
        <Route
        path={"leads"}
        element={
        <ProtectedRoute>
            <LeadPage />
        </ProtectedRoute>
        }
        />
    </Route>
  </Routes>
}


export default App



/*


function App() {
  return<Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path={"sign-in/*"} element={<SigninPage />}/>
      <Route path={"sign-up/*"} element={<SignupPage />}/>
      <Route path={"pricing"} element={<PricingPage />}/>
      <Route 
        path={"dashboard"} 
        element={
          <DashboardPage />
        }
        />
    </Route>
  </Routes>
}
*/