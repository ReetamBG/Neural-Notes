import Link from "next/link";
import { Button } from "./ui/button";
import { auth, signOut } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ThemeToggler from "./ThemeToggler";

const Navbar = async () => {
  const session = await auth();
  return (
    <header className="sticky top-0 shadow-sm">
      {/* logo  */}
      <div className="flex justify-between px-4 py-4">
        <Link href="/">
          <h1 className="text-xl sm:text-2xl text-primary/90 font-extrabold">
            Neural Notes
          </h1>
        </Link>
        {/* navlinks  */}
        <div className="flex gap-4 items-center">
          <ThemeToggler />
          {session?.user ? (
            <>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="secondary" type="submit">
                  Sign Out
                </Button>
              </form>
              <Avatar>
                <AvatarImage src={session.user.image || "Hello"} />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
            </>
          ) : (
            <>
              <Button asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
