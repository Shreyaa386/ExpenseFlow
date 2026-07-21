import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  console.log("Dashboard User:", user);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "pink",
        color: "white",
        padding: "40px",
      }}
    >
      <h1 style={{ fontSize: "48px" }}>
        Dashboard Working
      </h1>

      <h2 style={{ marginTop: "20px" }}>
        Welcome {user?.name}
      </h2>

      <pre
        style={{
          background: "#000",
          color: "#0f0",
          padding: "20px",
          marginTop: "20px",
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>

      <button
        onClick={logout}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          background: "blue",
          color: "white",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;