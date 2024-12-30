import { useFetcher } from '@remix-run/react'

import { Button } from '~/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Loading } from '~/components/loading'
import { TurnstileWidget } from '~/components/captchas/turnstile'

export const CTA = ({
    subscribeRoute = '/blog/subscribe/resource',
}: {
    subscribeRoute?: string
}) => {
    const fetcher = useFetcher()
    const isSubmitting = fetcher.formAction === subscribeRoute

    return (
        <section className="max-w-2xl flex flex-col py-20 px-6 my-12 mx-auto md:px-12 lg:px-18">
            <Card className="py-2 px-3 sm:py-6 sm:px-8">
                <CardHeader>
                    <CardTitle>Subscribe to new posts!</CardTitle>
                    <CardDescription>
                        If you like topics like{' '}
                        <span>Tech, Software Development, or Travel</span>.
                        Welcome to subscribe for free to get some fresh ideas!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <fetcher.Form
                        className="w-full flex items-center gap-3"
                        method="POST"
                        action={subscribeRoute}
                    >
                        <Input placeholder="your@ema.il" name="email" />
                        <Button size={'sm'}>
                            <Loading
                                size={16}
                                className={`absolute ${
                                    isSubmitting ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                            <span
                                className={`${
                                    isSubmitting ? 'opacity-0' : 'opacity-100'
                                }`}
                            >
                                Subscribe
                            </span>
                        </Button>

                        {/* Chose your CAPTCHA */}
                        {/* <input type="hidden" name="captcha" value="turnstile" /> */}
                        {/* <TurnstileWidget /> */}
                    </fetcher.Form>
                </CardContent>
            </Card>
        </section>
    )
}
