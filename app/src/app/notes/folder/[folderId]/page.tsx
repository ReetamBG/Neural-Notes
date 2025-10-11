"use client"
import useNotesStore from '@/store/notes.store';
import React from 'react'

const Page = () => {
  const {selectedFolder} = useNotesStore();
  return (
    <div>{selectedFolder?.title}</div>
  )
}

export default Page