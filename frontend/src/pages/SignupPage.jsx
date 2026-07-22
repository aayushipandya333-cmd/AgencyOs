import {SignUp} from "@clerk/clerk-react"

function SignupPage()
{
    return <div className={"auth-container"}>
        <SignUp routing={"path"} path={"/sign-up"} signInUrl={"/sign-in"} />

    </div>
}

export default SignupPage