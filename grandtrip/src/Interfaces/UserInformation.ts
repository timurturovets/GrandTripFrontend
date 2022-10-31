type Role = "Default" | "Editor" | "Admin"

export default interface UserInformation {
    id: number,
    username: string,
    role: Role,
}