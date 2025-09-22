'use client'

import SmartContractRoleSelection from './SmartContractRoleSelection'

interface RoleChangeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function RoleChangeModal({ isOpen, onClose, onSuccess }: RoleChangeModalProps) {
  if (!isOpen) return null

  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Change Your Role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <SmartContractRoleSelection
            onSuccess={handleSuccess}
            isRoleChange={true}
          />
        </div>
      </div>
    </div>
  )
}