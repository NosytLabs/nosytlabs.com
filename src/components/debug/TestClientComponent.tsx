import * as React from "react";

export function TestClientComponent() {
  console.log("TestClientComponent: Component rendered on client.");
  return (
    <div>
      <h2>This is a test client component.</h2>
    </div>
  );
}