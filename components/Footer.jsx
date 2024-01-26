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
      <div className="text-[0.5rem]">
        <div>ROUTER: 0x440e24C674d2852CaAF58726335929e2e6Df276E</div>
        <div>WETH: 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9</div>
      </div>
    </div>
  );
}
