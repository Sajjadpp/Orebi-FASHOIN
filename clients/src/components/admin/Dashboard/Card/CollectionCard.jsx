import React from 'react'
import Card from "./Card"

function CollectionCard({total , type, persentage, Sign, loading}) {


  return (
    
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Sign className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      {loading ? (
        <div className="w-full space-y-4 animate-pulse">
          {/* Placeholder for type */}
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          {/* Placeholder for total */}
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          {/* Placeholder for percentage */}
          <div className="h-4 bg-gray-300 rounded w-1/4 mt-2"></div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-1">{type}</p>
          <h3 className="text-2xl font-bold text-gray-800">{total}</h3>
          <p className="text-xs text-green-600 mt-2">{persentage}</p>
        </>
      )}
    </Card>

  )
}

export default CollectionCard
