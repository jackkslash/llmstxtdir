'use client'
import { submitProject } from '@/actions/projects'
import React, { useActionState, useState } from 'react'

const initialState = {
    error: '',
    success: false
}

export default function project() {

    const [state, formAction, pending] = useActionState(submitProject, initialState)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        website: '',
        category: '',
        logoUrl: '',
        repoUrl: '',
        isOpenSource: false
    })
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='flex flex-col items-center gap-8 mx-auto w-full max-w-sm'>
                <h1 className="font-medium text-lg">SUBMIT A PROJECT</h1>
                <p className="font-medium text-sm text-gray-500">SUBMIT A PROJECT TO THE DIRECTORY</p>
                <form action={formAction} className='flex flex-col gap-4 w-full'>
                    <input
                        type="text"
                        name="name"
                        placeholder="NAME"
                        className="p-2 font-medium text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="text"
                        name="slug"
                        placeholder="SLUG"
                        className="p-2 font-medium text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="DESCRIPTION"
                        className="p-2 font-medium text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <input
                        type="text"
                        name="website"
                        placeholder="WEBSITE"
                        className="p-2 font-medium text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="CATEGORY"
                        className="p-2 font-medium text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                    <input
                        type="text"
                        name="logoUrl"
                        placeholder="LOGO URL"
                        className="p-2 font-medium text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    />
                    <input
                        type="text"
                        name="repoUrl"
                        placeholder="REPO URL"
                        className="p-2 font-medium text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-black"
                        value={formData.repoUrl}
                        onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    />
                    <div className='flex flex-row items-center gap-4 py-2'>
                        <label htmlFor="isOpenSource" className="font-medium text-sm">OPEN SOURCE</label>
                        <input
                            type="checkbox"
                            id="isOpenSource"
                            name="isOpenSource"
                            checked={formData.isOpenSource}
                            onChange={(e) => setFormData({ ...formData, isOpenSource: e.target.checked })}
                            className="h-4 w-4 accent-black rounded border-gray-300 focus:ring-black"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={pending}
                        className="font-medium text-sm hover:opacity-70 disabled:opacity-50"
                    >
                        {pending ? 'SUBMITTING...' : 'SUBMIT'}
                    </button>
                    {state?.error && (
                        <p className="font-medium text-sm text-red-500" aria-live="polite" role="status">
                            {state.error}
                        </p>
                    )}
                    {state?.success && (
                        <p className="font-medium text-sm text-green-500" aria-live="polite" role="status">
                            PROJECT SUBMITTED
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
