import { Logo } from "./Logo";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

interface prop {
  auth: boolean;
}


export const TopBar = ({auth } : prop) => {
  return (
    <div className="flex w-full justify-between">
      <div>
        <Logo />
      </div>
      <div className="flex items-center">
        <div>
          {auth && (
            <div className="mx-8">
              <Button
                className="rounded-full mx-8"
                variant="outline"
                size={"lg"}
                asChild
              >
                <a href="/auth/signin">Sign in</a>
              </Button>
              <Button
                className="rounded-full hidden  md:inline-flex"
                variant="default"
                size={"lg"}
                asChild
              >
                <a href="/auth/signup">Sign up</a>
              </Button>
            </div>
          )}
        </div>
        <ModeToggle />
      </div>
    </div>
  );
};
