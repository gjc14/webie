import { useNavigate } from '@remix-run/react'

import { Button } from '~/components/ui/button'
import { SerializedLoader } from './route'

export const PostMeta = ({ post }: { post: SerializedLoader['post'] }) => {
    const navigate = useNavigate()

    return (
        <>
            <h1>{post.title}</h1>
            <div className="flex flex-col gap-5 mt-5 mb-14 md:mt-6 md:mb:20">
                <p className="prose text-sm text-muted-foreground md:text-base">
                    {post.excerpt}
                </p>
                <div className="w-full h-fit flex justify-between items-center px-1.5 border-y">
                    <div className="flex gap-2 items-center my-1.5 md:my-2">
                        <img
                            src={
                                post.author.imageUri ||
                                '/placeholders/avatar.png'
                            }
                            alt={'Author avatar'}
                            className="w-9 h-9 rounded-full"
                        />
                        <Button
                            onClick={() =>
                                navigate(`/blog/author/${post.author.name}`)
                            }
                            variant={'link'}
                            className="px-0"
                        >
                            {post.author.name}
                        </Button>
                    </div>
                    <p className="text-xs md:text-sm">
                        {new Date(post.updatedAt).toLocaleString('zh-TW')}
                    </p>
                </div>
            </div>
        </>
    )
}
