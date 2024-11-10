import { Form, useNavigation } from '@remix-run/react'
import { Button } from '~/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Loading } from '~/components/loading'
export const description =
    "A simple login form with email and password. The submit button says 'Sign in'."

export const SignInForm = () => {
    const navigation = useNavigation()

    const isSubmitting = navigation.formAction === '/admin/signin'

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Sign in</CardTitle>
                <CardDescription>
                    Enter your email below to access admin dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Form id="signIn" method="POST" className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        required
                    />
                </Form>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full" form="signIn">
                    {isSubmitting ? <Loading /> : 'Sign in'}
                </Button>
            </CardFooter>
        </Card>
    )
}
