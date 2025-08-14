import ProtectedRoute from "@/routes/ProtectedRoute";

export default function Dashboard() {
  return (
    <>
      <ProtectedRoute>
        {" "}
        <h2> Dashboard</h2>
      </ProtectedRoute>
    </>
  );
}
