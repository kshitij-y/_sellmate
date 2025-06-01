import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import LineText from "@/components/lineText";
import { MailOpen } from "lucide-react";
export default function Auth() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Tabs defaultValue="Signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Signin">Sign In</TabsTrigger>
          <TabsTrigger value="Signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="Signin">
          <Card>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="Email" className="my-2" />
              </div>
              <div className="space-y-1 mt-4">
                <Label htmlFor="Password">Password</Label>
                <Input id="Password" className="my-2" type="password" />
                <div className="text-red-500 text-sm my-[-8px] cursor-pointer">
                  Forgot password?
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center justify-center w-full">
                <Button className="w-full">Sign In</Button>
              </div>
            </CardFooter>
            <LineText text="or" />
            <Button className="w-[86%] mx-auto">
              <MailOpen /> Login with Google
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="Signup">
          <Card>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" className="my-2" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="my-2" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" className="my-2" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" className="my-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Sign Up</Button>
            </CardFooter>
            <LineText text="or" />
            <Button className="w-[86%] mx-auto">
              <MailOpen /> Sign up with Google
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
