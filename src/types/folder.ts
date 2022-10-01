export type FolderType = {
    id: number,
    name: string,
    color?: string,
    is_public?: boolean,
    parent?: number | null
}

export type FolderStateType = {
    folders: FolderType[],
}