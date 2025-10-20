import TextEditor from '@/components/Editor'
import React from 'react'

const page = async ({ params }: { params: { folderId: string } }) => {
  const { folderId } = await params;
  return (
    <div className="h-full"><TextEditor isNewNote={true} folderId={folderId} /></div>
  )
}

export default page