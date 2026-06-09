const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export async function submitFifaRegistration(formData) {
  const response = await fetch(`${API_BASE_URL}/formulario-fifa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
