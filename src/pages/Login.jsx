import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token); // JWT ടോക്കൺ ലോക്കൽ സ്റ്റോറേജിൽ സേവ് ചെയ്യുന്നു
      alert('Login Successful! Token Saved.');
      window.location.href = '/'; // ഹോം പേജിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു
    } catch (err) {
      alert(err.response?.data?.msg || 'Login Failed!');
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto', gap: '10px' }}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;