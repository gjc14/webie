import { format, setHours, setMinutes } from 'date-fns'
import { CalendarIcon, Clock } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

export const TimeSelector = ({
    date,
    setDate,
    hour12 = true,
    className,
}: {
    date: Date | undefined
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    hour12?: boolean
    className?: string
}) => {
    if (!date) {
        return undefined
    }

    const clock = hour12 ? format(date, 'a') : undefined
    const hours = hour12 ? format(date, 'KK') : format(date, 'HH')
    const minutes = format(date, 'mm')

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        target: 'hours' | 'minutes' | '12-hours'
    ) => {
        if (e.key === 'ArrowLeft') {
            return
        } else if (e.key === 'ArrowRight') {
            return
        }

        const [hours, minutes] = date
            ?.toTimeString()
            .split(':')
            .map(str => parseInt(str, 10))

        let newSelectedDate: Date = date
        if (target === 'hours') {
            const numberChange =
                e.key === 'ArrowUp' ? +1 : e.key === 'ArrowDown' ? -1 : 0

            newSelectedDate = setHours(date, hours + numberChange)
        } else if (target === 'minutes') {
            const numberChange =
                e.key === 'ArrowUp' ? +1 : e.key === 'ArrowDown' ? -1 : 0

            newSelectedDate = setMinutes(date, minutes + numberChange)
        } else if (target === '12-hours') {
            const numberChange = date.getHours() >= 12 ? -12 : +12

            newSelectedDate = setHours(date, hours + numberChange)
        }
        return setDate(newSelectedDate)
    }

    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value
        const inputNumber = parseInt(inputValue, 10)
        if (inputNumber < 0 || inputNumber > 24) {
            return
        } else {
            return setDate(setHours(date, inputNumber))
        }
    }

    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value
        const inputNumber = parseInt(inputValue, 10)
        if (inputNumber < 0 || inputNumber > 60) {
            return
        } else {
            return setDate(setMinutes(date, inputNumber))
        }
    }

    return (
        <div
            className={cn(
                'relative w-full h-9 flex items-center px-2 py-0.5 space-x-0.5 border border-input rounded-lg overflow-hidden',
                className
            )}
        >
            {clock && (
                <input
                    type="text"
                    className="w-[3ch] text-center text-sm rounded-none border-0 bg-transparent focus-visible:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-0"
                    readOnly
                    value={clock}
                    onKeyDown={e => handleKeyDown(e, '12-hours')}
                />
            )}
            <input
                type="text"
                className="w-[2ch] text-center text-sm rounded-none border-0 bg-transparent focus-visible:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-0"
                value={hours}
                onChange={e => handleHourChange(e)}
                onKeyDown={e => handleKeyDown(e, 'hours')}
            />
            <span className="h-fit text-sm mb-0.5">:</span>
            <input
                type="text"
                className="w-[2ch] text-center text-sm rounded-none border-0 bg-transparent focus-visible:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-0"
                value={minutes}
                onChange={e => handleMinuteChange(e)}
                onKeyDown={e => handleKeyDown(e, 'minutes')}
            />
            <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-2 m-1 bg-transparent pointer-events-none">
                <Clock size={18} />
            </div>
        </div>
    )
}

export const CalendarWithTime = ({
    date,
    setDate,
    className,
}: {
    date: Date | undefined
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    hour12?: boolean
    className?: string
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        `w-[280px] justify-start text-left font-normal ${
                            !date ? 'text-muted-foreground' : ''
                        }`,
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={date}
                    onSelect={day =>
                        setDate(prev => {
                            if (!day || !prev) {
                                return new Date()
                            }
                            day.setHours(prev.getHours())
                            day.setMinutes(prev.getMinutes())
                            return day
                        })
                    }
                    className="w-fit rounded-md border"
                    footer={
                        <label>
                            <TimeSelector
                                date={date}
                                setDate={setDate}
                                className="mt-1"
                            />
                        </label>
                    }
                />
            </PopoverContent>
        </Popover>
    )
}
