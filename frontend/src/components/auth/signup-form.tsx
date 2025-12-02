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

const signUpSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    userName: z.string().min(3, 'Username is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignUpFormTypes = z.infer<typeof signUpSchema>;

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    
    const { signUp } = useAuthStore();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors , isSubmitting } } = useForm<SignUpFormTypes>({
        resolver: zodResolver(signUpSchema),
    });
    
    const onSubmit = async (data: SignUpFormTypes) => {
        const { firstName, lastName, userName, email, password } = data;
        
        // call backend API to create account
        await signUp(userName, password, email, firstName, lastName);
        
        navigate("/signin");
    };
    
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden border-border">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>
                        Enter your information below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                                <Input id="firstName" type="text" placeholder="John" {...register("firstName")} />
                                {errors.firstName && <p className="text-destructive text-sm">{errors.firstName.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                                <Input id="lastName" type="text" placeholder="Doe" {...register("lastName")} />
                                {errors.lastName && <p className="text-destructive text-sm">{errors.lastName.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="userName">Username</FieldLabel>
                                <Input id="userName" type="text" {...register("userName")} />
                                {errors.userName && <p className="text-destructive text-sm">{errors.userName.message}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                            </Field>
                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input id="password" type="password" {...register("password")} />
                                        {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirm-password">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input id="confirm-password" type="password" {...register("confirmPassword")} />
                                        {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>}
                                    </Field>
                                </Field>
                                <FieldDescription>
                                    Must be at least 8 characters long.
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isSubmitting}>Create Account</Button>
                                <FieldDescription className="text-center">
                                    Already have an account? <a href="/signin">Sign in</a>
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
    )
}
