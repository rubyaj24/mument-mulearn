'use client'

import { useState } from 'react'
import { getCheckpointsForExport } from '@/actions/checkpoints'
import { Sheet } from 'lucide-react'

export default function ExportButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleExport = async (format: 'excel' | 'csv') => {
        try {
            setIsLoading(true)
            const checkpoints = await getCheckpointsForExport()

            if (!checkpoints || checkpoints.length === 0) {
                alert('No checkpoints to export')
                return
            }

            // Use custom export with checkpoint-specific columns
            const { exportCustom } = await import('@/lib/excel-export')
            
            const columnsMap: Record<string, string> = {
                'buddy_name': 'Verified By',
                'college_name': 'College',
                'teams': 'Team Name',
                'checkpoint_number': 'Checkpoint #',
                'is_absent': 'Absent',
                'meeting_medium': 'Meeting Medium',
                'camera_on': 'Camera On',
                'team_introduced': 'Team Introduced',
                'idea_summary': 'Idea Summary',
                'last_week_progress': 'Last Week Progress',
                'next_week_target': 'Next Week Target',
                'needs_support': 'Needs Support',
                'support_details': 'Support Details',
                'suggestions': 'Suggestions',
                'created_at': 'Date'
            }

            // Transform checkpoint data for export
            const exportData = checkpoints.map((cp: any) => {
                const teamName = typeof cp.teams === 'object' && cp.teams ? cp.teams.team_name : ''
                const collegeName = typeof cp.colleges === 'object' && cp.colleges ? cp.colleges.name : ''
                return {
                    buddy_name: cp.buddy_name || 'Unknown',
                    college_name: collegeName || '-',
                    teams: teamName,
                    checkpoint_number: cp.checkpoint_number || '',
                    is_absent: cp.is_absent ? 'Yes' : 'No',
                    meeting_medium: cp.meeting_medium || '-',
                    camera_on: cp.camera_on ? 'Yes' : (cp.camera_on === false ? 'No' : '-'),
                    team_introduced: cp.team_introduced ? 'Yes' : (cp.team_introduced === false ? 'No' : '-'),
                    idea_summary: cp.idea_summary || '-',
                    last_week_progress: cp.last_week_progress || '-',
                    next_week_target: cp.next_week_target || '-',
                    needs_support: cp.needs_support ? 'Yes' : (cp.needs_support === false ? 'No' : '-'),
                    support_details: cp.support_details || '-',
                    suggestions: cp.suggestions || '-',
                    created_at: cp.created_at ? new Date(cp.created_at).toLocaleDateString() : ''
                }
            })

            if (format === 'excel') {
                await exportCustom(exportData, columnsMap, 'checkpoints', 'excel')
            } else {
                await exportCustom(exportData, columnsMap, 'checkpoints', 'csv')
            }
        } catch (error) {
            console.error('Export failed:', error)
            alert('Failed to export. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex gap-2">
            <button
                onClick={() => handleExport('excel')}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <span className="inline-block animate-spin">↺</span>
                        Exporting...
                    </>
                ) : (
                    <>
                        <Sheet size={16} />
                         Export to Excel
                    </>
                )}
            </button>
            {/* <button
                onClick={() => handleExport('csv')}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <span className="inline-block animate-spin">↺</span>
                        Exporting...
                    </>
                ) : (
                    <>
                        📄 Export to CSV
                    </>
                )}
            </button> */}
        </div>
    )
}
