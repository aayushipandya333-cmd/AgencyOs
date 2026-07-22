import {SignIn, SignUp} from "@clerk/clerk-react"

function SigninPage()
{
    return <div className={"auth-container"}>
        <SignIn routing={"path"} path={"/sign-in"} signUpUrl={"/sign-up"} />

    </div>
}

export default SigninPage