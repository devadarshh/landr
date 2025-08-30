"use client";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { JobInfo, User } from "@prisma/client";
import { useState } from "react";
interface StartCallProps {
  accessToken: string;
  jobInfo: Pick<JobInfo, "id" | "title" | "description" | "experienceLevel">;
  user: Pick<User, "name" | "imageUrl">;
}
export function StartCall({ jobInfo, user, accessToken }: StartCallProps) {
  const { connect, readyState, chatMetadata, callDurationTimestamp } =
    useVoice();
  if (readyState === VoiceReadyState.IDLE) {
  }
  const [] = useState(null);
  return (
    <div>
      <h1>hii</h1>
    </div>
  );
}





function FftVisualizer({ fft }: { fft: number[] }) {
  return (
    <div className="flex gap-1 items-center h-full">
      {fft.map((value, index) => {
        const percent = (value / 4) * 100;
        return (
          <div
            key={index}
            className="min-h-0.5 bg-primary/75 w-0.5 rounded"
            style={{ height: `${percent < 10 ? 0 : percent}%` }}
          />
        );
      })}
    </div>
  );
}
