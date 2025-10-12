"use client"
import TextEditor from '@/components/Editor';
import useNotesStore from '@/store/notes.store';
import React from 'react'

const Page = () => {
  const {selectedFolder} = useNotesStore();
  return (
    <div><TextEditor /></div>
  )
}

export default Page