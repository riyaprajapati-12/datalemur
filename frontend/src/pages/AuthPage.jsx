import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  githubProvider,
  signInWithRedirect,
  getRedirectResult
} from "../firebase";
import axios from "axios";

const AuthPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        setLoading(false);

        if (result && result.user) {
          const user = result.user;
          const token = await user.getIdToken();

          await axios.post(
            "https://datalemur-1.onrender.com/api/user",
            {
              displayName: user.displayName,
              email: user.email,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          navigate("/home");
        }
      } catch (err) {
        console.error("Redirect error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    handleRedirect();
  }, [navigate]);

  const handleProviderSignIn = async (provider) => {
    try {
      setError("");
      setLoading(true);
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error("Redirect start error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Sign In / Join</h2>

        {loading ? (
          <p className="text-center text-gray-500">Checking login...</p>
        ) : (
          <>
            <button
              onClick={() => handleProviderSignIn(googleProvider)}
              className="w-full flex items-center justify-center py-3 bg-[#4285F4] text-white rounded-md"
            >
              Sign in with Google
            </button>

            <button
              onClick={() => handleProviderSignIn(githubProvider)}
              className="w-full flex items-center justify-center py-3 bg-gray-800 text-white rounded-md"
            >
              Sign in with GitHub
            </button>
          </>
        )}

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default AuthPage;
