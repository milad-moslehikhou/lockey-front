import { FormsStateType } from './component'

export type CredentialType = {
    id: number,
    name: string,
    username: string,
    ip: string | null,
    uri: string | null,
    importancy: 'HIGH' | 'MEDIUM' | 'LOW',
    is_public: boolean,
    is_favorite: boolean,
    auto_genpass: boolean,
    tags: string,
    description: string,
    folder: number,
    created_by: number,
    created_at: Date,
    modified_by: number,
    modified_at: Date,
    team: number
}

export type CredentialStateType = {
    credentials: CredentialType[],
    formsState: FormsStateType
}