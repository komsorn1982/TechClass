"use client";import{EditableAccountProfile}from"../components/EditableAccountProfile";
type Student={firstName:string;lastName:string;username:string;studentCode:string;gradeLevel:number;classroom:string;avatarUrl:string|null};
export function ProfileEditor({student}:{student:Student}){return <EditableAccountProfile person={student} profileEndpoint="/api/profile" avatarEndpoint="/api/profile/avatar" loginPath="/login"/>}
