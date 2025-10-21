import TextEditor from '@/components/Editor'
import React from 'react'

const Page = ({ params }: { params: Promise<{ folderId: string }> }) => {
  const { folderId } = React.use(params);
  return (
    <div className="h-full"><TextEditor isNewNote={true} folderId={folderId} /></div>
  )
}

export default Page