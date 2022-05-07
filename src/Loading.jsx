import { Hearts } from "react-loading-icons";
export default function Loading() {
  return (
    <div className="loading">
      <Hearts className="loading-icon" stroke="#23074d" speed={1.75} />
      <p>Adding love & sending...</p>
    </div>
  );
}
