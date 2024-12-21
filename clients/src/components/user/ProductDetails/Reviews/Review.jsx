import { Star } from 'lucide-react'
import React from 'react'

const Review = () => {
     
  const reviews = [
    { id: 1, user: 'John Doe', rating: 5, comment: 'Great fit and comfort!', date: '2024-12-15' },
    { id: 2, user: 'Jane Smith', rating: 4, comment: 'Good quality but slightly expensive', date: '2024-12-14' }
  ];

  return (
    <div>
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="font-medium">{review.user}</span>
                <span className="text-gray-500 text-sm">{review.date}</span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
          
          {/* Add Review Form */}
          <form className="space-y-4 mt-8">
            <h3 className="text-xl font-bold">Write a Review</h3>
            <div>
              <label className="block mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="text-gray-300 hover:text-yellow-400"
                  >
                    <Star size={24} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-2">Comment</label>
              <textarea
                className="w-full border p-2 h-32"
                placeholder="Share your thoughts about the product..."
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white hover:bg-gray-800"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Review
