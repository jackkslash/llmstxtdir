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
                <h1>Submit a Project</h1>
                <p>Submit a project to the directory</p>
                <form action={formAction} className='flex flex-col gap-4 w-full'>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="p-2 border rounded"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="text"
                        name="slug"
                        placeholder="Slug"
                        className="p-2 border rounded"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        className="p-2 border rounded"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <input
                        type="text"
                        name="website"
                        placeholder="Website"
                        className="p-2 border rounded"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        className="p-2 border rounded"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                    <input
                        type="text"
                        name="logoUrl"
                        placeholder="Logo URL"
                        className="p-2 border rounded"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    />
                    <input
                        type="text"
                        name="repoUrl"
                        placeholder="Repo URL"
                        className="p-2 border rounded"
                        value={formData.repoUrl}
                        onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    />
                    <div className='flex flex-row items-center gap-2'>
                        <label htmlFor="isOpenSource" className="text-sm">Is Open Source</label>
                        <input
                            type="checkbox"
                            id="isOpenSource"
                            name="isOpenSource"
                            checked={formData.isOpenSource}
                            onChange={(e) => setFormData({ ...formData, isOpenSource: e.target.checked })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={pending}
                        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
                    >
                        {pending ? 'Submitting...' : 'Submit'}
                    </button>
                    {state?.error && (
                        <p className="text-red-500" aria-live="polite" role="status">
                            {state.error}
                        </p>
                    )}
                    {state?.success && (
                        <p className="text-green-500" aria-live="polite" role="status">
                            Project submitted successfully
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}
