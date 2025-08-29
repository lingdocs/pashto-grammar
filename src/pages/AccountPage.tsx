import { useEffect } from "react";
import { useUser } from "../user-context";
import { signOut } from "@lingdocs/auth-shared";
const providers: ("google" | "twitter" | "github")[] = ["google", "twitter", "github"];

let popupRef: Window | null = null;

function AccountPage() {
  const { user, pullUser } = useUser();
  useEffect(() => {
    window.addEventListener("message", handleIncomingMessage);
    return () => {
      window.removeEventListener("message", handleIncomingMessage);
    };
    // eslint-disable-next-line
  }, []);
  function handleOpenSignup() {
    popupRef = window.open("https://account.lingdocs.com", "account", "height=800,width=500,top=50,left=400");
  }
  async function handleSignOut() {
    await signOut();
    pullUser();
  }
  function handleIncomingMessage(event: MessageEvent<any>) {
    if (event.origin === "https://account.lingdocs.com" && event.data === "signed in" && popupRef) {
      pullUser();
      popupRef.close();
    }
  }
  return <main className="col bg-faded py-3 d-flex flex-column">
    <div className="flex-shrink-0">
      {!user ?
        <div className="text-center mt-3">
          <h2 className="my-4">Sign in to LingDocs</h2>
          <p className="lead mb-4">When you sign in or make a LingDocs account you can:</p>
          <div className="mb-3"><i className="fas fa-graduation-cap mr-2" /> Save your progress on quizzes</div>
          <button className="btn btn-lg btn-primary my-4" onClick={handleOpenSignup}><i className="fas fa-sign-in-alt mr-2" /> Sign In</button>
        </div>
        :
        <div style={{ maxWidth: "650px" }}>
          <h3 className="mt-2 mb-4">Account</h3>
          <div className="card mb-4">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Name: {user.name}</li>
              {user.email && <li className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div>Email: {user.email}</div>
                  </div>
                </div>
              </li>}
              <li className="list-group-item">Account Level: {user.level} {user.upgradeToStudentRequest === "waiting"
                ? "(Upgrade Requested)"
                : ""}</li>
              <li className="list-group-item">Signs in with:
                {(user.password && user.email) && <span>
                  <i className="fas fa-key ml-2"></i> <span className="small mr-1">Password</span>
                </span>}
                {providers.map((provider) => (
                  <span key={provider}>
                    {user[provider] && <i className={`fab fa-${provider} mx-1`}></i>}
                  </span>
                ))}
              </li>
            </ul>
          </div>
          <h4 className="mb-3">Account Admin</h4>
          <div className="row mb-4">
            <div className="col-sm mb-3">
              <a className="btn btn-outline-secondary" href="https://account.lingdocs.com/user">
                <i className="fas fa-user mr-2"></i> Edit Account
              </a>
            </div>
            <div className="col-sm mb-3">
              <button className="btn btn-outline-secondary" onClick={handleSignOut}>
                <i className="fas fa-sign-out-alt mr-2"></i> Sign Out
              </button>
            </div>
          </div>
        </div>
      }
    </div>
    <p className="mt-4 text-center small"><a href="/privacy">privacy policy</a></p>
  </main>;
}

export default AccountPage;
