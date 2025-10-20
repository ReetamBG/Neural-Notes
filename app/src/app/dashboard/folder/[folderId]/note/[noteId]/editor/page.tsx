import TextEditor from '@/components/Editor'
import React from 'react'

const page = ({ params }: { params: { folderId: string; noteId: string } }) => {
  
  return (
    <div className="h-full"><TextEditor folderId={params.folderId} noteId={params.noteId} /></div>
  )
}

export default page