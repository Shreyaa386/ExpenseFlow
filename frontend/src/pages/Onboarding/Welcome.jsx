import { useEffect } from "react";

function Welcome() {
  useEffect(() => {
    console.log("✅ Welcome Component Mounted");
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-4xl font-bold">
        Welcome Page
      </h1>

      <p>If you can see this, routing is working.</p>
    </div>
  );
}

export default Welcome;