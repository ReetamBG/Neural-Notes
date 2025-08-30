import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { signIn } from "@/lib/auth";
import Image from "next/image";

const AuthPage = () => {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <div className="flex flex-col gap-6 ">
        <Card>
          <CardHeader>
            <CardTitle>Sign In to continue</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dashboard" });
              }}
            >
              <Button variant="outline" className="px-10">
                <Image
                  alt="google logo"
                  height={15}
                  width={15}
                  src="/googleLogo.png"
                />
                Continue with Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
