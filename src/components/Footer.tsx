import React from "react";

const Footer = () => (
  <footer>
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Product column - keep this */}
        <div>
          <h3 className="font-bold mb-4">Product</h3>
          <ul>
            <li>Dashboard</li>
            <li>Focus Timer</li>
            <li>Goal Tracking</li>
            <li>Mood Check-ins</li>
            <li>Productivity Tips</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center">
        
        <div className="mb-4">
          <span className="font-bold text-xl">Re–Focus</span>
          <p>Your productivity companion for students and self-learners...</p>
          <div className="flex gap-4 mt-4">
            <span>Smart Goals</span>
            <span>Focus Timer</span>
            <span>Mood Tracking</span>
            <span>Analytics</span>
          </div>
        </div>
      
        <div className="text-sm text-muted-foreground">
          © 2025 Re-Focus. All rights reserved.
        </div>
        
      </div>
    </div>
  </footer>
);

export default Footer;
