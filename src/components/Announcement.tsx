import React from "react";

type AnnouncementProps = {
  title: string;
  body: string;
  speaker: string;
  joinLink: string;
  date: string;
  time: string;
  mode: string;
};

const Announcement: React.FC<AnnouncementProps> = ({
  title,
  body,
  speaker,
  joinLink,
  date,
  time,
  mode,
}) => (
  <div className="glass border border-primary/40 rounded-lg p-4 mb-6 text-center bg-primary/10">
    <h2 className="text-xl font-bold mb-2 text-primary">{title}</h2>
    <p className="mb-2 text-base">{body}</p>
    <p className="font-medium text-lg mt-2">
      <span className="text-secondary">Speaker:</span> {speaker}
      <br />
      <span className="text-secondary">Join Link:</span>{" "}
      <a href={joinLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
        Open Link
      </a>
      <br />
      <span className="text-secondary">Date:</span> {date}
      <br />
      <span className="text-secondary">Time:</span> {time}
      <br />
      <span className="text-secondary">Mode:</span> {mode}
    </p>
  </div>
);

export default Announcement;
