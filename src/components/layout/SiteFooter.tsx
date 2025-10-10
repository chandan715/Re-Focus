import React from "react";

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gradient-subtle">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side: Logo + description */}
          <div>
            <h2 className="font-bold text-xl flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
                Re–Focus
              </span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Your productivity companion for students and self-learners. Stay focused,
              track goals, and build better habits with our intelligent tools.
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <span>🎯 Smart Goals</span>
              <span>⏱ Focus Timer</span>
              <span>😊 Mood Tracking</span>
              <span>📊 Analytics</span>
            </div>
          </div>

          {/* Right side: Product column */}
          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>Dashboard</li>
              <li>Focus Timer</li>
              <li>Goal Tracking</li>
              <li>Mood Check-ins</li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-8 flex flex-col items-center">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Re-Focus. All rights reserved. • Made for Students.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
