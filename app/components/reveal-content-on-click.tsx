import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'
import { useState } from 'react'
import { cn } from '~/lib/utils'

export const RevealContentOnClick = ({
    children,
    trigger,
    className,
}: {
    children?: React.ReactNode
    trigger?: React.ReactNode
    className?: string
}) => {
    const [expanded, setExpanded] = useState(false)

    // By using `AnimatePresence` to mount and unmount the contents, we can animate
    // them in and out while also only rendering the contents when open
    return (
        <>
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.section
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 30,
                        }}
                        style={{ overflow: 'hidden' }}
                        className="w-full"
                    >
                        {children}
                    </motion.section>
                )}
            </AnimatePresence>
            <motion.button
                animate={expanded ? 'collapsed' : 'open'}
                variants={{
                    open: { opacity: 1 },
                    collapsed: { opacity: 0.4 },
                }}
                onClick={() => setExpanded(prev => !prev)}
                className={cn('w-full h-full', className)}
            >
                {trigger ? trigger : <p>Read More</p>}
            </motion.button>
        </>
    )
}
