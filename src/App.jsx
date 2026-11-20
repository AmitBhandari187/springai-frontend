import { useState } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = question.trim();
    if (!trimmed) {
      alert("Please enter a question!");
      return;
    }

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/qa/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmed }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Backend returned status ${response.status}`
        );
      }

      const data = await response.json();
      setAnswer(typeof data === "string" ? data : data.answer || "");
    } catch (err) {
      setError(err.message || "Failed to connect to the Spring Boot backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">✦</span>
          AI Compare
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          AI Workspace
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-tag">✦ YOUR PERSONAL AI ASSISTANT</div>

          <h1>
            Ask anything.
            <br />
            <span>Get intelligent answers.</span>
          </h1>

          <p>
            Ask your questions and let AI help you understand, explore and solve
            problems.
          </p>
        </section>

        {/* Question Input */}
        <section className="input-section">
          <label htmlFor="question">YOUR PROMPT</label>

          <textarea
            id="question"
            placeholder="Ask me anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div className="input-footer">
            <span>{question.length} characters</span>

            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Thinking..." : "Ask AI ↗"}
            </button>
          </div>
        </section>

        {/* AI Response */}
        <section className="response-section">
          <div className="response-header">
            <div className="response-title">
              <div className="bot-icon">✦</div>

              <div>
                <h2>AI Response</h2>
                <span>Your generated answer</span>
              </div>
            </div>

            <span className="response-badge">
              {loading
                ? "GENERATING"
                : error
                ? "ERROR"
                : answer
                ? "COMPLETED"
                : "READY"}
            </span>
          </div>

          <div className="response-content">
            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>AI is thinking...</p>
                <span>Generating your answer</span>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
              </div>
            ) : answer ? (
              <div className="answer-text">{answer}</div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✧</div>
                <h3>Your answer will appear here</h3>
                <p>Enter a question above and click Ask AI to get started.</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer>
          <p>
            AI Compare <span>·</span> Amit Bhandari
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
