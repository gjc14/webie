import { Link } from '@remix-run/react'
import { CloudUpload } from 'lucide-react'
import { ReactNode } from 'react'

import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { useTable } from '../../../lib/hooks/table'
import { DBToolTip } from '../../db-tooltip'
import { ToolBarAlert } from './tool-bar-alert'

const ToolBarWrapper = ({ children }: { children?: ReactNode }) => {
    return (
        <div className="w-full h-fit flex items-center gap-1 p-1 bg-primary-foreground rounded-md border border-border">
            {children}
        </div>
    )
}

type ToolBarProps = {
    onSaveRows: () => void
}

const ToolBar = ({ onSaveRows }: ToolBarProps) => {
    const { addRow, isRowsDirty, isTableConfigDirty } = useTable()

    return (
        <ToolBarWrapper>
            {/* Form part */}

            <Button
                size={'sm'}
                variant={'ghost'}
                onClick={onSaveRows}
                disabled={!isRowsDirty}
            >
                Save
            </Button>

            <Separator orientation="vertical" className="h-4/5" />

            {/* Function area */}
            <Button size={'sm'} variant={'ghost'} onClick={addRow}>
                Add row
            </Button>
            <Button
                size={'sm'}
                variant={'ghost'}
                onClick={() => alert('not implemented')}
            >
                Import
            </Button>
            <Button
                size={'sm'}
                variant={'ghost'}
                onClick={() => alert('not implemented')}
            >
                Export
            </Button>
            {(isRowsDirty || isTableConfigDirty) && (
                <DBToolTip asChild message="Uploading your data to database">
                    <CloudUpload size={16} className="animate-pulse ml-5" />
                </DBToolTip>
            )}

            {/* Additional area */}
            <div className="ml-auto flex items-center justify-end gap-1.5">
                <Link to={'form'}>
                    <Button
                        size={'sm'}
                        variant={'ghost'}
                        className="h-auto p-2"
                    >
                        Generate form
                    </Button>
                </Link>

                <ThemeToggle className="ml-auto mr-3 scale-90" />
            </div>
        </ToolBarWrapper>
    )
}

// TODO: Here should check if each column type is altered, instead of the whole column config
// PS. System will automatically save the new column, user dont need to manually save it.
const ToolBarEditMode = () => {
    const { isTableConfigDirty, setSettingSelectedColumn, resetTableConfig } =
        useTable()

    return (
        <ToolBarWrapper>
            <Button
                size={'sm'}
                variant={'ghost'}
                form="tableConfigForm"
                disabled={!isTableConfigDirty}
            >
                Save
            </Button>
            {isTableConfigDirty ? (
                <ToolBarAlert
                    promptTitle={'Discard changes'}
                    promptMessage={'Are you sure you want to discard changes?'}
                    executeMessage={'Discard'}
                    execute={() => {
                        setSettingSelectedColumn(null)
                        resetTableConfig()
                    }}
                >
                    <Button size={'sm'} variant={'ghost'}>
                        Discard
                    </Button>
                </ToolBarAlert>
            ) : (
                <Button
                    size={'sm'}
                    variant={'ghost'}
                    onClick={() => setSettingSelectedColumn(null)}
                >
                    Discard
                </Button>
            )}

            <div className="ml-auto flex items-center justify-end gap-1.5">
                <ThemeToggle className="ml-auto mr-3 scale-90" />
            </div>
        </ToolBarWrapper>
    )
}

export { ToolBar, ToolBarEditMode }
