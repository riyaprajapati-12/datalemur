import { useState, useEffect } from 'react'; // useEffect को इम्पोर्ट करें
import { useNavigate } from 'react-router-dom';
import { 
    auth, 
    googleProvider, 
    githubProvider, 
    signInWithRedirect,  // <-- इसे बदलें
    getRedirectResult    // <-- इसे जोड़ें
} from '../firebase'; 
import axios from 'axios';

// --- आपके GoogleIcon और GithubIcon SVG कंपोनेंट यहां रहेंगे ---
const GoogleIcon = () => (
  <svg className="w-6 h-6 mr-2" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);
// --- End of Icon components ---

const AuthPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // डिफ़ॉल्ट रूप से true पर सेट करें
  const navigate = useNavigate();

  // === यह नया और महत्वपूर्ण हिस्सा है ===
  useEffect(() => {
    // यह फ़ंक्शन पेज लोड होने पर यह जांचता है कि क्या हम 
    // Google/GitHub से वापस रीडायरेक्ट होकर आए हैं।
    const checkForRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        setLoading(false); // जांच पूरी, लोडिंग रोकें

        if (result && result.user) {
          const user = result.user;
          console.log("✅ Redirect Success! User data:", user);

          // बैकएंड लॉजिक को यहां मूव करें
          const token = await user.getIdToken();
          console.log("Token acquired. Sending request to backend...");

          await axios.post(
            "https://datalemur-phgy.vercel.app/api/profile",
            {
              displayName: user.displayName,
              provider: user.providerData[0].providerId,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          console.log("✅ Backend call successful. Navigating home...");
          navigate("/home");
        }
        // यदि 'result' null है, तो इसका मतलब है कि यूजर ने अभी तक साइन इन नहीं किया है,
        // इसलिए कुछ भी न करें और उन्हें साइन-इन बटन दिखाएं।

      } catch (err) {
        console.error("❌ Redirect result error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    checkForRedirectResult();
  }, [auth, navigate]); // डिपेंडेंसी

  const handleProviderSignIn = async (provider) => {
    setLoading(true);
    setError('');
    try {
      // स्टेप 1: बस रीडायरेक्ट करें। बाकी काम useEffect संभालेगा।
      await signInWithRedirect(auth, provider);
      // इस लाइन के बाद, यूजर दूसरी साइट पर चला जाएगा, 
      // इसलिए यहां का कोड तुरंत एक्जीक्यूट नहीं होगा।

    } catch (err) {
      // यह कैच आमतौर पर तब फायर होता है जब रीडायरेक्ट शुरू करने में कोई समस्या होती है
      console.error("❌ Sign-in redirect initiation error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign In / Join
        </h2>
        
        {loading ? (
          <div className="text-center text-gray-600">
            Checking login status...
          </div>
        ) : (
          <>
            <button 
                onClick={() => handleProviderSignIn(googleProvider)} 
                // 'loading' को यहां 'disabled' के लिए इस्तेमाल करने की जरूरत नहीं है 
              // क्योंकि पेज वैसे भी रीडायरेक्ट हो जाएगा।
                className="w-full flex items-center justify-center py-3 px-4 text-white font-medium bg-[#4285F4] rounded-md hover:bg-[#357ae8] transition-colors duration-300"
              >
                <GoogleIcon />
                Sign in with Google
              </button>

              <button 
                onClick={() => handleProviderSignIn(githubProvider)} 
                className="w-full flex items-center justify-center py-3 px-4 text-white font-medium bg-gray-800 rounded-md hover:bg-gray-700 transition-colors duration-300"
              >
                <GithubIcon />
                Sign in with GitHub
              </button>
          </>
        )}
        
        {error && <p className="mt-4 text-sm text-center text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default AuthPage;
