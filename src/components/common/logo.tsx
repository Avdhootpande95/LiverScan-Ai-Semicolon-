export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>LiverScan AI Logo</title>
      <path d="M20.35 10.3C21.85 13.5 20.25 17.5 17 19.5C13.75 21.5 9.75 20.3 7.75 17.3C5.75 14.3 6.65 10.3 9.65 8.3C11.55 7.1 14.05 6.7 16.25 7.3" />
      <path d="M16 8C18 6 21 7 22 9" />
      <path d="M12 12L18 6" />
      <path d="M12 12L6 18" />
    </svg>
  );
}
