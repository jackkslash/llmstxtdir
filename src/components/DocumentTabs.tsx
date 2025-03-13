'use client';

import { useState } from 'react';

interface Document {
    id: string;
    projectId: string;
    urlType: 'standard' | 'full';
    urlValue: string;
    contentHash: string;
    content: string;
    fetchedAt: Date;
}

type GroupedDocuments = {
    [date: string]: Document[];
};

interface DocumentAccordionProps {
    groupedDocuments: GroupedDocuments;
    sortedDates: string[];
}

export default function DocumentAccordion({ groupedDocuments, sortedDates }: DocumentAccordionProps) {
    const [openDate, setOpenDate] = useState<string | null>(sortedDates[0] || null);

    const toggleDate = (date: string) => {
        setOpenDate(openDate === date ? null : date);
    };

    // Get the most recent date
    const mostRecentDate = sortedDates[0];

    return (
        <div>
            {/* Accordion interface for documents grouped by date */}
            <div className="border-b border-gray-200">
                {sortedDates.map((date) => (
                    <div key={date} className="mb-2">
                        <button 
                            className="font-medium text-xs py-2 px-4 w-full text-left border-b-2 border-transparent"
                            onClick={() => toggleDate(date)}
                        >
                            {new Date(date).toLocaleDateString()}
                            {date === mostRecentDate && <span className="text-green-500 font-bold ml-2">(Latest Version)</span>}
                        </button>
                        {openDate === date && (
                            <ul className="space-y-2 pl-4">
                                {groupedDocuments[date].map((doc: Document) => (
                                    <li key={doc.id}>
                                        <a href={doc.urlValue} target="_blank" rel="noopener noreferrer" className="font-medium text-sm">
                                            {doc.urlValue}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
