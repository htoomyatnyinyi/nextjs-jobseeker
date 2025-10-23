import Link from "next/link";
import Links from "./Links";
import MobileNav from "./MobileNav";

const Nav = () => {
  return (
    <div>
      <div className="py-2 p-2 m-1 backdrop-blur-3xl shadow-xl ">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="p-2 m-1 ">
            <h1>jobDiary Inc</h1>
          </Link>
          <div className="hidden xl:flex xl:items-center">
            <Links />
          </div>
          <div className="xl:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
