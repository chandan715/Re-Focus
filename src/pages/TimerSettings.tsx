import React, { useState } from "react";
import { Button, Input, Label } from "@/components/ui";

const TimerSettings = ({ focusDuration, onSetTimer }) => {
  const [duration, setDuration] = useState(focusDuration);

  return (
    <div>
      <Label htmlFor="focusDuration">Focus Duration (minutes)</Label>
      <Input
        id="focusDuration"
        type="number"
        min={1}
        value={duration}
        onChange={e => setDuration(Number(e.target.value))}
      />
      <Button onClick={() => onSetTimer(duration)} className="mt-4">Set</Button>
    </div>
  );
};

export default TimerSettings;