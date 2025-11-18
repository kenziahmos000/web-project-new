import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5001/api";

const AdminPanel = () => {
  const [tab, setTab] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState({ regular: [], admins: [] });
  const [stats, setStats] = useState({
    totalUsers: 0,
    regularUsers: 0,
    adminUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setIsAdmin(false);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (tab === "recipes") {
      fetchRecipes();
    } else if (tab === "dashboard" && isAdmin) {
      fetchUsers();
    }
  }, [tab, isAdmin]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/recipes`);
      const data = await response.json();
      if (data.success) {
        setRecipes(data.recipes);
      }
    } catch (err) {
      setError("Failed to fetch recipes");
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Loading...
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "12px" }}>Access Denied</h2>
        <p style={{ color: "#666" }}>
          You must be logged in as an admin to view this page.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8f9fa, #e9ecef)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            marginBottom: "32px",
            color: "#333",
            fontSize: "32px",
            fontWeight: "700",
          }}
        >
          Admin Portal
        </h1>

        <div
          style={{
            marginBottom: "32px",
            display: "flex",
            gap: "12px",
            borderBottom: "2px solid #dee2e6",
            paddingBottom: "2px",
          }}
        >
          <button
            onClick={() => setTab("dashboard")}
            style={{
              padding: "12px 24px",
              border: "none",
              background: tab === "dashboard" ? "white" : "transparent",
              color: tab === "dashboard" ? "#667eea" : "#6c757d",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
              transition: "all 0.2s ease",
              boxShadow:
                tab === "dashboard" ? "0 -2px 10px rgba(0,0,0,0.05)" : "none",
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setTab("recipes")}
            style={{
              padding: "12px 24px",
              border: "none",
              background: tab === "recipes" ? "white" : "transparent",
              color: tab === "recipes" ? "#667eea" : "#6c757d",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
              transition: "all 0.2s ease",
              boxShadow:
                tab === "recipes" ? "0 -2px 10px rgba(0,0,0,0.05)" : "none",
            }}
          >
            🍳 Recipes
          </button>
          <button
            onClick={() => setTab("restaurants")}
            style={{
              padding: "12px 24px",
              border: "none",
              background: tab === "restaurants" ? "white" : "transparent",
              color: tab === "restaurants" ? "#667eea" : "#6c757d",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
              transition: "all 0.2s ease",
              boxShadow:
                tab === "restaurants" ? "0 -2px 10px rgba(0,0,0,0.05)" : "none",
            }}
          >
            🍽️ Restaurants
          </button>
        </div>

        {tab === "dashboard" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "24px",
                marginBottom: "32px",
              }}
            >
              {/* Stats Card - Total Users */}
              <div
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6c757d",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Total Users
                </div>
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {stats.totalUsers}
                </div>
              </div>

              {/* Stats Card - Regular Users */}
              <div
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6c757d",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Regular Users
                </div>
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {stats.regularUsers}
                </div>
              </div>

              {/* Stats Card - Admin Users */}
              <div
                style={{
                  background: "white",
                  padding: "24px",
                  borderRadius: "16px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  border: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6c757d",
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}
                >
                  Admin Users
                </div>
                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {stats.adminUsers}
                </div>
              </div>
            </div>

            {/* Users List */}
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "20px",
                  fontSize: "24px",
                  color: "#333",
                }}
              >
                Regular Users
              </h2>

              {/* Search Box */}
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  border: "2px solid #e9ecef",
                  fontSize: "15px",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
              />

              {users.regular.filter((u) =>
                u.email.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <p
                  style={{
                    color: "#999",
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  {searchQuery
                    ? "No users match your search"
                    : "No regular users found"}
                </p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  {users.regular
                    .filter((u) =>
                      u.email.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((u) => (
                      <div
                        key={u._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "16px 20px",
                          background: "#f8f9fa",
                          borderRadius: "12px",
                          border: "1px solid #e9ecef",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "16px",
                            }}
                          >
                            {u.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div
                              style={{
                                fontWeight: "600",
                                color: "#333",
                                marginBottom: "2px",
                              }}
                            >
                              {u.email}
                            </div>
                            <div style={{ fontSize: "12px", color: "#999" }}>
                              Joined{" "}
                              {new Date(u.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "6px 12px",
                            background: "#e7f3ff",
                            color: "#0066cc",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          Regular User
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "recipes" && (
          <div>
            <h2>Recipes</h2>
            {loading ? (
              <p>Loading recipes...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <table
                border="1"
                cellPadding="8"
                style={{ width: "100%", background: "#fff" }}
              >
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Author</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map((r) => (
                    <tr key={r._id}>
                      <td>{r.title}</td>
                      <td>{r.description}</td>
                      <td>{r.userEmail}</td>
                      <td>{r.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "restaurants" && (
          <div>
            <h2>Restaurants</h2>
            <p>
              Nearby restaurants are shown on the main Restaurants page. Admin
              management is not available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
