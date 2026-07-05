import React from 'react';

// Прототипын lucide-маягийн inline SVG иконууд — 24×24, stroke 1.8
function Ic({ kids, size = 15 }: { kids: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      style={{ flex: 'none', display: 'block' }}>
      {kids}
    </svg>
  );
}

export const IconHome = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><path d="M3.5 3.5h7v10h-7z" /><path d="M13.5 3.5h7v6h-7z" /><path d="M13.5 13.5h7v7h-7z" /><path d="M3.5 17.5h7v3h-7z" /></>} />
);
export const IconCal = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><path d="M3.5 5h17v15.5h-17z" /><path d="M3.5 9.5h17" /><path d="M8 3v4" /><path d="M16 3v4" /></>} />
);
export const IconCpu = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><path d="M5 5h14v14H5z" /><path d="M9.5 9.5h5v5h-5z" /><path d="M9 2.5v2.5" /><path d="M15 2.5v2.5" /><path d="M9 19v2.5" /><path d="M15 19v2.5" /><path d="M2.5 9H5" /><path d="M2.5 15H5" /><path d="M19 9h2.5" /><path d="M19 15h2.5" /></>} />
);
export const IconGlobe = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a13.5 13.5 0 0 1 0 18" /><path d="M12 3a13.5 13.5 0 0 0 0 18" /></>} />
);
export const IconTarget = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></>} />
);
export const IconSun = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2" /><path d="M12 19.5v2" /><path d="M2.5 12h2" /><path d="M19.5 12h2" /><path d="M5.2 5.2l1.4 1.4" /><path d="M17.4 17.4l1.4 1.4" /><path d="M5.2 18.8l1.4-1.4" /><path d="M17.4 6.6l1.4-1.4" /></>} />
);
export const IconMoon = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />} />
);
export const IconX = ({ size = 13 }: { size?: number }) => (
  <Ic size={size} kids={<><path d="M6.5 6.5l11 11" /><path d="M17.5 6.5l-11 11" /></>} />
);
export const IconSliders = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><path d="M4 21v-7" /><path d="M4 10V3" /><path d="M12 21v-9" /><path d="M12 8V3" /><path d="M20 21v-5" /><path d="M20 12V3" /><path d="M1.5 14h5" /><path d="M9.5 8h5" /><path d="M17.5 16h5" /></>} />
);
export const IconBell = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>} />
);
export const IconFlame = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flex: 'none', display: 'block' }}>
    <path d="M12 2.5C13.5 6.5 8 8.5 8 13a4 4 0 0 0 8 0c0-1.6-.9-2.8-.9-2.8s3.4 1.6 3.4 5.3a6.5 6.5 0 0 1-13 0C5.5 9.5 10.5 7.5 12 2.5z" />
  </svg>
);
export const IconBolt = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flex: 'none', display: 'block' }}>
    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
);
export const IconDownload = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M4 20h16" /></>} />
);
export const IconUpload = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><path d="M12 15V3" /><path d="M7 8l5-5 5 5" /><path d="M4 20h16" /></>} />
);
export const IconPlus = ({ size }: { size?: number }) => (
  <Ic size={size} kids={<><path d="M12 5v14" /><path d="M5 12h14" /></>} />
);
