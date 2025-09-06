import React from "react";

const FocusSession = ({ focusDuration }) => {
  return (
    <div>
      <h2>Focus Session</h2>
      <div>{focusDuration}:00</div>
      {/* Timer logic here */}
    </div>
  );
};

export default FocusSession;