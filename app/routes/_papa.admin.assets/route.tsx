import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useSubmit } from '@remix-run/react'
import { useEffect, useState } from 'react'

import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { prisma, S3 } from '~/lib/db/_db.server'
import { capitalize, ConventionalError } from '~/lib/utils'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'
import {
    FileMeta,
    FileMetaSchema,
} from '../_papa.admin.api.object-storage/schema'
import { FileGrid } from './components/file-grid'

const displayOptions = ['all', 'image', 'video', 'audio', 'file'] as const

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    const formData = await request.formData()
    const newFileMetaString = formData.get('newFileMeta')

    if (!newFileMetaString || typeof newFileMetaString !== 'string') {
        return new Response('Invalid file metadata', { status: 400 })
    }

    const {
        success,
        data: newFileMetaData,
        error,
    } = FileMetaSchema.safeParse(JSON.parse(newFileMetaString))
    if (!success) {
        return json<ConventionalError>({ err: 'Invalid file metadata' })
    }

    try {
        await prisma.objectStorage.update({
            where: {
                id: newFileMetaData.id,
                key: newFileMetaData.key,
            },
            data: {
                name: newFileMetaData.name,
                description: newFileMetaData.description,
            },
        })
        return json({ msg: 'File updated', data: newFileMetaData })
    } catch (error) {
        console.log('Error updating file', error)
        return json<ConventionalError>({ err: 'Failed to update file' })
    }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url)

    const objects = await S3?.send(new ListObjectsV2Command({ Bucket: 'papa' }))
    if (!objects || !objects.Contents) return { files: [] as FileMeta[] }

    const { Contents } = objects

    const files = await Promise.all(
        Contents.map(async ({ Key, ETag, StorageClass }) => {
            if (!Key) return null
            const fileMetadata = await prisma.objectStorage.findUnique({
                where: { key: Key },
            })
            if (!fileMetadata) return null
            return {
                ...fileMetadata,
                url: url.origin + `/assets/private?key=${Key}`,
                eTag: ETag,
                storageClass: StorageClass,
            }
        })
    )
    const filteredFiles = files.filter(file => file !== null)

    return {
        files: filteredFiles,
    }
}

export default function AdminAsset() {
    const submit = useSubmit()
    const { files } = useLoaderData<typeof loader>()
    const [filesState, setFilesState] = useState(files)
    const [display, setDisplay] = useState('all')

    const filesDisplayed = filesState.filter(file => {
        if (display === 'all') return true
        if (display === 'file') {
            const fileGeneralType = file.type.split('/')[0]
            return !['image', 'video', 'audio'].includes(fileGeneralType)
        }
        const fileGeneralType = file.type.split('/')[0]
        return fileGeneralType === display
    })

    useEffect(() => {
        setFilesState(files)
    }, [files])

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle
                    title="Assets"
                    description="Manage all your assets on Papa platform"
                ></AdminTitle>
                <AdminActions>
                    <Label htmlFor="asset-filter">Filter by</Label>
                    <Select
                        defaultValue="all"
                        onValueChange={v => {
                            setDisplay(v)
                        }}
                    >
                        <SelectTrigger id="asset-filter" className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {displayOptions.map(option => (
                                <SelectItem key={option} value={option}>
                                    {capitalize(option)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </AdminActions>
            </AdminHeader>
            <FileGrid
                files={filesDisplayed}
                onFileUpdate={fileMeta => {
                    setFilesState(
                        filesState.map(file =>
                            file.id === fileMeta.id ? fileMeta : file
                        )
                    )
                    submit(
                        { newFileMeta: JSON.stringify(fileMeta) },
                        {
                            method: 'POST',
                            navigate: false,
                        }
                    )
                }}
            />
        </AdminSectionWrapper>
    )
}
