import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";

function useBackendGet(pathname) {
  const apiBaseUrl =
    import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBackend() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiBaseUrl}${pathname}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setError(err?.message ?? String(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchBackend();

    return () => controller.abort();
  }, [apiBaseUrl, pathname]);

  return { data, isLoading, error };
}

function AccueilPage() {
  const { data, isLoading, error } = useBackendGet("/");

  return (
    <section id="center">
      <div>
        <div>
          <Link to="/connexion">Tester la connexion au backend</Link>
        </div>
        <h1>Accueil</h1>
        {isLoading ? (
          <p>Chargement des données backend…</p>
        ) : error ? (
          <p>Erreur backend : {error}</p>
        ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </section>
  );
}

function ConnexionPage() {
  const { data, isLoading, error } = useBackendGet("/connexion");

  return (
    <section id="center">
      <div>
        <Link to="/">Retour à l'accueil</Link>
      </div>
      <div>
        <h1>Connexion</h1>
        {isLoading ? (
          <p>Test de connexion au backend…</p>
        ) : error ? (
          <p>Erreur backend : {error}</p>
        ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AccueilPage />} />
        <Route path="/connexion" element={<ConnexionPage />} />
      </Routes>
    </>
  );
}

export default App;
