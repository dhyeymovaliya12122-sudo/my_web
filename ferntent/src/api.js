// Small API wrapper used by the frontend to call backend auth endpoints
async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = (data && (data.message || data.error)) || res.statusText || 'Request failed';
    const e = new Error(err);
    e.response = { status: res.status, data };
    throw e;
  }
  return data;
}

export async function registerUser(payload) {
  // payload: { name, email, password }
  const res = await fetch('https://my-web-89so.onrender.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function loginUser(email, password) {
  const res = await fetch('https://my-web-89so.onrender.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export default { registerUser, loginUser };
