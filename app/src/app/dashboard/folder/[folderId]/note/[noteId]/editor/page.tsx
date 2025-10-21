import TextEditor from '@/components/Editor'
import React from 'react'

const Page = ({ params }: { params: Promise<{ folderId: string; noteId: string }> }) => {
  const { folderId, noteId } = React.use(params);
  
  return (
    <div className="h-full"><TextEditor folderId={folderId} noteId={noteId} /></div>
  )
}

export default Page