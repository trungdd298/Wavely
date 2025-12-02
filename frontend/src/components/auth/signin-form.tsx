import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router"

const signInSchema = z.object({
    userName: z.string().min(3, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type SignInFormTypes = z.infer<typeof signInSchema>;

export function SigninForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    
    const { signIn } = useAuthStore();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors , isSubmitting } } = useForm<SignInFormTypes>({
            resolver: zodResolver(signInSchema),
        });
        
    const onSubmit = async (data: SignInFormTypes) => {
        const { userName, password } = data;
        
        // call backend API to create account
        await signIn(userName, password);
        
        navigate("/");
    };
    
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden border-border">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Sign in to your account using your username and password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="userName">Username</FieldLabel>
                                <Input id="userName" type="text" {...register("userName")} />
                                {errors.userName && <p className="text-destructive text-sm">{errors.userName.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input id="password" type="password" {...register("password")} />
                                {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isSubmitting}>Sign In</Button>
                                <FieldDescription className="text-center">
                                    Don't have an account? <a href="/signup">Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
};
