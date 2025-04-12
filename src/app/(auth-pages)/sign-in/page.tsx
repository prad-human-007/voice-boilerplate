import { signInAction, signInwithOAuthAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex w-full h-screen justify-center items-center">
        <Card >
            <CardHeader>
                <h1 className="text-2xl font-medium">Sign in</h1>
                <p className="text-sm text-foreground">
                    Don&apos;t have an account?{" "}
                    <Link className="text-foreground font-medium underline" href="/sign-up">
                    Sign up
                    </Link>
                </p>
            </CardHeader>
            <CardContent>
                <form className="flex-1 flex flex-col min-w-64">
                <div className="flex flex-col gap-2 [&>input]:mb-3">
                    <Label htmlFor="email">Email</Label>
                    <Input name="email" placeholder="you@example.com" required />
                    <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        className="text-xs text-foreground underline"
                        href="/forgot-password"
                    >
                        Forgot Password?
                    </Link>
                    </div>
                    <Input
                    type="password"
                    name="password"
                    placeholder="Your password"
                    required
                    />
                    <SubmitButton pendingText="Signing In..." formAction={signInAction}>
                    Sign in
                    </SubmitButton>
                    <FormMessage message={searchParams} />
                </div>
                </form>
                <form>
                    <Button className="w-full" formAction={signInwithOAuthAction} >Sign in with Google</Button>
                </form>
            </CardContent>
        </Card>
        
    </div>
    
    
  );
}