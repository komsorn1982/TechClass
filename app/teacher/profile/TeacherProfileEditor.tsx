"use client";import{EditableAccountProfile}from"../../components/EditableAccountProfile";
export function TeacherProfileEditor({teacher}:{teacher:{firstName:string;lastName:string;username:string;avatarUrl:string|null}}){return <EditableAccountProfile person={teacher} profileEndpoint="/api/teacher/profile" avatarEndpoint="/api/teacher/avatar" loginPath="/teacher/login" teacher/>}
