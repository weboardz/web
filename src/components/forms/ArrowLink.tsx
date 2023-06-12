import { ArrowRight } from "lucide-react";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

const ArrowLink = ({ href, text }: { href: Url; text: string }) => {
  return (
    <Link
      {...{ href }}
      className="group/arrow-link flex items-center gap-1 font-semibold text-AliceBlue-400 hover:text-AliceBlue-500"
    >
      {text}
      <ArrowRight
        size={16}
        className="mb-[2px] transition-transform group-hover/arrow-link:translate-x-2"
      />
    </Link>
  );
};

export { ArrowLink };
