import { RiTwitterXLine } from "react-icons/ri";
import { RiGithubLine } from "react-icons/ri";
import { RiDiscordLine } from "react-icons/ri";
import { SiGitbook } from "react-icons/si";

export function Footer() {
  return (
    <div className="bg-black text-[#808080] text-[1.5rem] flex justify-center items-center gap-12 h-[32px]">
      <RiTwitterXLine
        size={32}
        className="hover:scale-110 cursor-pointer transition duration-300 ease-in-out"
      />
      <RiDiscordLine
        size={32}
        className="hover:scale-110 cursor-pointer transition duration-300 ease-in-out"
      />
      <SiGitbook
        size={32}
        className="hover:scale-110 cursor-pointer transition duration-300 ease-in-out"
      />
      <RiGithubLine
        size={32}
        className="hover:scale-110 cursor-pointer transition duration-300 ease-in-out"
      />
    </div>
  );
}
