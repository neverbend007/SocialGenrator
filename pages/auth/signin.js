import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="signin-container">
      <button
        onClick={() => signIn('google', { callbackUrl: '/account' })}
        className="signin-button"
      >
        Sign in with Google
      </button>
    </div>
  );
}

// Add getServerSideProps to handle direct access to signin page
export async function getServerSideProps(context) {
  return {
    props: {}
  };
} 