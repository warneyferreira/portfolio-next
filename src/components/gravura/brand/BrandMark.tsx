import type { SVGProps } from "react";

const VIEW_BOX = "0 0 32 32";
const MARK_PATH = "M0 0h26l4 4v26H0zM3 9h3l2 8 2-5h2l2 5 2-8h3l-4 14h-3l-1-5-2 5H6zM20 9h4l3 2v6l-2 2 3 4h-4l-2-4v4h-2zm2 3v4h2l1-1v-2l-1-1zM30 8h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zm0 4h2v2h-2zM8 30h2v2H8zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2zm4 0h2v2h-2z";

export const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW_BOX}" fill="currentColor"><path fill-rule="evenodd" d="${MARK_PATH}"/></svg>`;

export default function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={VIEW_BOX} fill="currentColor" aria-hidden {...props}>
      <path fillRule="evenodd" d={MARK_PATH} />
    </svg>
  );
}
