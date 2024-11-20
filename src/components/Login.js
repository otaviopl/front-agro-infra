import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        username,
        email,
        password,
      };

      // Formata o payload no formato esperado pelo backend
      const requestBody = {
        body: JSON.stringify(payload),
      };

      const response = await fetch(
        "https://aw1gwngj0h.execute-api.us-east-1.amazonaws.com/dev/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const rawData = await response.json();

      // Parseia o campo "body" da resposta do backend, que é um JSON stringificado
      const data = JSON.parse(rawData.body);

      if (rawData.statusCode === 200 && data.token) {
        // Credenciais válidas - Salva o token e redireciona
        localStorage.setItem("authToken", data.token);
        window.location.href = "/"; // Redireciona para a dashboard
      } else {
        throw new Error(data.message || "Erro ao realizar login");
      }
    } catch (err) {
      setError(err.message || "Algo deu errado, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Carregando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
