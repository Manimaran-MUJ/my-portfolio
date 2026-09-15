import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  project: string;
  budget: string;
  timeline: string;
  status: string;
  received_at: string;
}

function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/inquiries`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          window.location.href = "/admin";
          return;
        }

        throw new Error(
          data.error || "Unable to load inquiries."
        );
      }

      setInquiries(data.inquiries);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load inquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const newCount = inquiries.filter(
    (inquiry) => inquiry.status === "new"
  ).length;

  return (
    <div className="admin-dashboard-page">
      <header className="admin-dashboard-header">
        <div>
          <span className="admin-dashboard-label">
            MANIMARAN ADMIN
          </span>

          <h1>Project Inquiries</h1>

          <p>
            Manage potential freelance clients and project leads.
          </p>
        </div>

        <div className="admin-dashboard-actions">
          <button
            type="button"
            onClick={loadInquiries}
          >
            Refresh
          </button>

          <a href="/">
            Portfolio
          </a>
        </div>
      </header>

      <main className="admin-dashboard-content">
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>Total Inquiries</span>
            <strong>{inquiries.length}</strong>
          </div>

          <div className="admin-stat-card">
            <span>New Leads</span>
            <strong>{newCount}</strong>
          </div>
        </div>

        {loading && (
          <div className="admin-message">
            Loading inquiries...
          </div>
        )}

        {error && (
          <div className="admin-message admin-message-error">
            {error}
          </div>
        )}

        {!loading && !error && inquiries.length === 0 && (
          <div className="admin-message">
            No project inquiries yet.
          </div>
        )}

        {!loading && !error && inquiries.length > 0 && (
          <div className="admin-inquiries">
            {inquiries.map((inquiry) => (
              <article
                className="admin-inquiry-card"
                key={inquiry.id}
              >
                <div className="admin-inquiry-top">
                  <div>
                    <h2>{inquiry.name}</h2>

                    <a href={`mailto:${inquiry.email}`}>
                      {inquiry.email}
                    </a>
                  </div>

                  <span
                    className={`admin-status ${inquiry.status}`}
                  >
                    {inquiry.status}
                  </span>
                </div>

                <div className="admin-inquiry-project">
                  <h3>Project Requirement</h3>

                  <p>{inquiry.project}</p>
                </div>

                <div className="admin-inquiry-details">
                  <div>
                    <span>Budget</span>
                    <strong>
                      {inquiry.budget || "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Timeline</span>
                    <strong>
                      {inquiry.timeline || "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <span>Received</span>
                    <strong>
                      {new Date(
                        inquiry.received_at
                      ).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;